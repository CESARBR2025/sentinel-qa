# Plan — Sistema de notificaciones por rol

**Estado**: propuesto, sin implementar.
**Relacionado**: [[Arquitectura — Roles y permisos (post-refactor 2026-07-15)]]

---

## Contexto

Hoy el sistema tiene un embrión de notificaciones que sólo sirve a un módulo:

- Tabla `notificaciones` con 102 filas y **3 tipos**: `incidente_svv` (91), `busqueda_plazo` (8), `despacho_asignado` (3).
- Campanita (`components/notificaciones/CampanillaNotificaciones.tsx`) montada en **un solo lugar**: `app/prevencion/layout.tsx:33`. El resto del sistema (108 páginas) no tiene campanita.
- Sólo **dos emisores reales**: `notificarMonitoristas` (`lib/incidentes/actions.ts:41`) y un INSERT inline de `despacho_asignado` (`lib/incidentes/actions.ts:223`).
- Sin historial, sin panel de administración, sin configuración de qué evento avisa a quién.

El resultado es que los flujos que cruzan roles se quedan mudos. Los cinco huecos de mayor impacto detectados en el mapeo:

1. `marcarSolicitudAtendida` (`lib/monitorista/repository.ts:608`) — fiscalía/juzgado esperan evidencias y nadie les avisa que ya llegaron.
2. `accionPedirEvidencias` (`lib/fiscalia/actions.ts:78`, `lib/agente_juzgado/actions.ts:107`) — el monitorista no se entera de que tiene trabajo nuevo.
3. `insertarReporteDenuncia` (`lib/d1/repository.ts:27`) — nace un expediente `RECIBIDA` y fiscalía no lo sabe.
4. `insertarSolicitudLiberacion` / `insertarDocumentoLiberacion` (`lib/agente_infracciones/repository.ts:317` / `:296`) — el ciudadano sube documentos y liberaciones no recibe aviso.
5. `cerrarInfraccion` (`lib/agente_infracciones/repository.ts:199`) — deja la infracción justo en el filtro de la bandeja de corralón (`lib/corralon/repository.ts:3`) sin avisarle.

**Resultado esperado**: campanita en todas las páginas, notificaciones dirigidas por rol con estado leído por persona, historial, y un apartado en el panel de administrador para gestionarlas.

### Decisiones tomadas con el usuario

| Tema | Decisión |
|---|---|
| Mecanismo | El de **menor impacto en rendimiento** con funcionalidad completa → polling optimizado (ver justificación abajo). Nada de SSE ni Web Push. |
| Modelo | **Una notificación por evento**, dirigida a un rol, con **leído por persona**. Si yo la marco leída, mis compañeros la siguen viendo sin leer. |
| Panel admin | Las 4 capacidades: matriz evento×rol, aviso manual, auditoría global, purga y retención. |
| Cobertura | **Todos los módulos**. |

---

## Por qué polling y no SSE

Contra la intuición, el polling actual **es más caro que el que propongo**, y SSE sería el más caro de todos en este despliegue:

- **Hoy**: `app/api/notificaciones/route.ts` llama a `generarAlertasBusquedas()` **en cada GET**, y el cliente pollea cada 2 min. Es decir, cada usuario conectado dispara un escaneo de `fichas_busqueda` más INSERTs, cada 2 minutos, aunque no haya pasado nada. Es un job de mantenimiento disfrazado de lectura.
- **Propuesto**: el polling pega a un endpoint de **contador** que hace una sola query indexada de sólo lectura, se pausa cuando la pestaña no está visible (`document.visibilityState`), y sólo pide la lista completa cuando el contador cambia o el usuario abre el dropdown. La generación de alertas se mueve a un cron.
- **SSE** mantendría una función serverless abierta por usuario conectado — en Vercel eso es tiempo de cómputo activo continuo, muy por encima de una query de conteo cada 45 s.

Neto: **menos escrituras, cero escaneos de tabla en la ruta caliente, y menos tiempo de cómputo** que hoy.

---

## Modelo de datos

El modelo actual es *fan-out*: una fila por usuario, con columna `leida`. No sirve para "compartidas por rol" porque marcar leída afectaría a todos, y quien entre al rol después no vería nada.

El modelo nuevo separa **el evento** de **quién lo leyó**:

- `notificaciones` — una fila por (evento × destinatario). El destinatario es un **rol** (`rol_id`) o un **usuario concreto** (`user_id`), nunca ambos nulos.
- `notificaciones_lecturas` — quién leyó qué. Ausencia de fila = no leída.

Así: el panel admin lista el evento una vez, cada persona tiene su propio leído/no leído, y un usuario que entra al rol más tarde ve el historial completo.

### Migración — `lib/db/manual-migrations/00XX_notificaciones_v2.sql`

```sql
BEGIN;

-- 1) Audiencia y metadatos del evento
ALTER TABLE notificaciones
  ALTER COLUMN user_id DROP NOT NULL,
  ADD COLUMN rol_id       integer REFERENCES roles(id) ON DELETE CASCADE,
  ADD COLUMN evento       text,
  ADD COLUMN entidad_tipo text,
  ADD COLUMN entidad_id   text,
  ADD COLUMN severidad    text NOT NULL DEFAULT 'info',
  ADD COLUMN emitida_por  text REFERENCES users(id) ON DELETE SET NULL,
  -- agrupa las filas emitidas en una misma llamada a emitir() (auditoría)
  ADD COLUMN grupo_id     uuid,
  -- idempotencia genérica: sustituye al UNIQUE específico de fichas
  ADD COLUMN clave_dedup  text;

-- 2) Backfill: el `tipo` viejo pasa a ser la clave de evento
UPDATE notificaciones SET evento = tipo WHERE evento IS NULL;
ALTER TABLE notificaciones ALTER COLUMN evento SET NOT NULL;

-- Toda notificación necesita un destinatario
ALTER TABLE notificaciones
  ADD CONSTRAINT notificaciones_destinatario_chk
  CHECK (user_id IS NOT NULL OR rol_id IS NOT NULL);

-- 3) Estado de lectura por persona
CREATE TABLE notificaciones_lecturas (
  notificacion_id uuid        NOT NULL REFERENCES notificaciones(id) ON DELETE CASCADE,
  user_id         text        NOT NULL REFERENCES users(id)          ON DELETE CASCADE,
  leida_en        timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (notificacion_id, user_id)
);

INSERT INTO notificaciones_lecturas (notificacion_id, user_id)
SELECT id, user_id FROM notificaciones WHERE leida = true AND user_id IS NOT NULL
ON CONFLICT DO NOTHING;

ALTER TABLE notificaciones DROP COLUMN leida;

-- 4) Dedup genérico. El UNIQUE viejo sólo cubría fichas de búsqueda;
--    clave_dedup sirve a cualquier evento y evita duplicados en reintentos.
DROP INDEX IF EXISTS notificaciones_user_id_ficha_id_hito_unique;
UPDATE notificaciones
   SET clave_dedup = evento || ':' || COALESCE(ficha_id::text, '') || ':' ||
                     COALESCE(hito, '') || ':u' || COALESCE(user_id, '')
 WHERE ficha_id IS NOT NULL;
CREATE UNIQUE INDEX notificaciones_clave_dedup_uq
  ON notificaciones (clave_dedup) WHERE clave_dedup IS NOT NULL;

-- 5) Matriz configurable evento × rol (la que edita el admin)
CREATE TABLE notificaciones_suscripciones (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento         text        NOT NULL,
  rol_id         integer     NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  activo         boolean     NOT NULL DEFAULT true,
  actualizado_en timestamptz NOT NULL DEFAULT now(),
  UNIQUE (evento, rol_id)
);

-- 6) Config (retención)
CREATE TABLE notificaciones_config (
  clave text PRIMARY KEY,
  valor text NOT NULL
);
INSERT INTO notificaciones_config (clave, valor) VALUES ('retencion_dias', '90');

-- 7) Índices de la ruta caliente
CREATE INDEX notificaciones_rol_creado_idx  ON notificaciones (rol_id,  creado_en DESC) WHERE rol_id  IS NOT NULL;
CREATE INDEX notificaciones_user_creado_idx ON notificaciones (user_id, creado_en DESC) WHERE user_id IS NOT NULL;
CREATE INDEX notificaciones_evento_idx      ON notificaciones (evento,  creado_en DESC);
CREATE INDEX notificaciones_lecturas_user_idx ON notificaciones_lecturas (user_id);

COMMIT;
```

> `DROP COLUMN leida` rompe `lib/notificaciones/repository.ts` y `checker.ts`. **La migración y la reescritura de esos archivos tienen que ir en el mismo cambio**, no por separado.

### Audiencia: por rol, no por permiso

Hoy `notificarMonitoristas` resuelve destinatarios por **permiso** (`seccion IN (...) AND puede_ver`). El usuario pidió por **rol**, y es lo correcto aquí:

- La matriz del admin se entiende como evento × rol; una matriz evento × sección sería críptica.
- En la práctica los permisos se siembran desde `permisos_plantillas` por rol (`aplicarPlantillaRol`, `lib/permisos/core.ts:140`), así que rol ≈ conjunto de permisos.

**Riesgo aceptado**: si a alguien le revocan el permiso de una sección pero conserva el rol, seguirá recibiendo la notificación y al hacer click la página lo rebotará por su propio guard. No es un hueco de seguridad (cada página valida por su cuenta), sólo una notificación inútil. Se corrige desde la matriz.

---

## Capa de aplicación

### Catálogo de eventos — `lib/notificaciones/catalogo.ts`

Los defaults viven en código (versionados, revisables); la BD sólo guarda los **overrides** que el admin cambie. Si no hay fila en `notificaciones_suscripciones` para un evento, mandan los `rolesPorDefecto`.

```ts
export interface DefinicionEvento {
  label: string                       // "Incidente creado"
  modulo: string                      // "Incidentes" — agrupa la matriz del admin
  severidad: 'info' | 'aviso' | 'critico'
  rolesPorDefecto: string[]           // nombres de rol, tal cual en roles.nombre
  href?: (entidadId: string) => string
}

export const EVENTOS = {
  'incidente.creado':        { label: 'Incidente creado',      modulo: 'Incidentes', severidad: 'aviso',
                               rolesPorDefecto: ['agente_despacho'],
                               href: id => `/agente_911/ciudadano/incidentes/${id}` },
  'despacho.asignado':       { label: 'Despacho asignado',     modulo: 'Incidentes', severidad: 'critico',
                               rolesPorDefecto: ['Oficial de Campo'],
                               href: id => `/oficial/despachos/${id}` },
  'reporte_campo.cerrado':   { label: 'Reporte de campo cerrado', modulo: 'Oficial', severidad: 'info',
                               rolesPorDefecto: ['agente_despacho'],
                               href: id => `/oficial/reportes/${id}` },
  'd1.creada':               { label: 'Denuncia D1 creada',    modulo: 'Fiscalía',   severidad: 'aviso',
                               rolesPorDefecto: ['agente_fiscalia'],
                               href: id => `/fiscalia/solicitudes/${id}` },
  // … resto del catálogo (ver tabla de instrumentación)
} satisfies Record<string, DefinicionEvento>

export type ClaveEvento = keyof typeof EVENTOS
```

### Emisor — `lib/notificaciones/emisor.ts`

Única función que llama todo el sistema. **Nunca lanza**: una notificación fallida no puede tumbar una operación de negocio.

```ts
export async function emitir(evento: ClaveEvento, datos: {
  mensaje: string
  titulo?: string            // default: label del catálogo
  entidadId?: string
  entidadTipo?: string
  href?: string              // default: catálogo.href(entidadId)
  roles?: string[]           // override puntual de audiencia
  usuarios?: string[]        // destinatarios directos (además de los roles)
  emitidaPor?: string
  dedup?: string             // idempotencia
}): Promise<void>
```

Resuelve la audiencia (overrides de BD → defaults del catálogo), inserta **una fila por rol destinatario** más una por usuario directo, todas con el mismo `grupo_id`, y usa `ON CONFLICT (clave_dedup) DO NOTHING`.

**Regla de uso**: llamar siempre **después del COMMIT**, nunca dentro de la transacción de negocio. `insertarReporteCampo` (`lib/oficial/repository.ts:47`), `createDespacho` y `createRondinEscalado` corren con `BEGIN/COMMIT` explícito; el patrón correcto ya lo usa `notificarMonitoristas`, que se llama fuera.

### Lectura — `lib/notificaciones/repository.ts` (reescritura)

```sql
-- listarParaUsuario(userId, rolId, limite, offset)
SELECT n.id, n.evento, n.titulo, n.mensaje, n.href, n.severidad, n.creado_en,
       (l.user_id IS NOT NULL) AS leida
  FROM notificaciones n
  LEFT JOIN notificaciones_lecturas l
         ON l.notificacion_id = n.id AND l.user_id = $1
 WHERE n.user_id = $1 OR n.rol_id = $2
 ORDER BY n.creado_en DESC
 LIMIT $3 OFFSET $4;

-- contarNoLeidas(userId, rolId)  ← la query del polling
SELECT count(*)::int
  FROM notificaciones n
  LEFT JOIN notificaciones_lecturas l
         ON l.notificacion_id = n.id AND l.user_id = $1
 WHERE (n.user_id = $1 OR n.rol_id = $2) AND l.user_id IS NULL;
```

`marcarLeida` = `INSERT INTO notificaciones_lecturas … ON CONFLICT DO NOTHING`.

### API

| Ruta | Método | Uso |
|---|---|---|
| `/api/notificaciones/contador` | GET | Sólo `{noLeidas}`. Es lo único que se pollea. |
| `/api/notificaciones` | GET | Lista paginada (`?limite=5` para el dropdown). |
| `/api/notificaciones/[id]/leer` | POST | Marca leída para el usuario en sesión. |
| `/api/notificaciones/leer-todas` | POST | Marca todas. |
| `/api/cron/notificaciones` | GET | Alertas de plazo + purga por retención. Sacado de la ruta caliente. |

---

## UI

### Campanita en todas las páginas — sólo 2 archivos

`DashboardHeader` (`components/partials/Header.tsx`, 76 páginas) ya tiene slot `children` en `:159`, pero **no hay que usarlo**: obligaría a editar 76 archivos. En su lugar, montar la campanita **dentro** del header, justo antes de `{children}`. Y añadirla igual a `components/partials/SubHeader.tsx` (32 páginas), que hoy no tiene slot.

Ambos son ya client components, así que la campanita se auto-abastece por API y **no necesita props** — cero cambios en las 108 páginas.

### Campanita — reescritura de `CampanillaNotificaciones.tsx`

Se conserva la lógica de toast + sonido; se corrige lo demás:

- **Tema claro** (`#f8fafc`/`#1f355a`) — hoy es oscuro (`#0b1220`) sobre un header claro, desalineado con el sistema.
- Polling del **contador** cada 45 s vía `hooks/usePolling.ts` (ya existe), **pausado con `document.visibilityState`**.
- Lista completa sólo al abrir el dropdown o cuando el contador sube.
- Dropdown con **exactamente 5** notificaciones + enlace "Ver todas".
- Click → `marcarLeida` + `router.push(href)`.
- No leídas con indicador visual y color por `severidad`.

### Historial del usuario — `app/notificaciones/page.tsx`

Lista completa paginada, filtros por módulo/leídas, y "marcar todas como leídas".

---

## Panel de administrador

Añadir link "Notificaciones" al nav de `app/admin/layout.tsx:23-38` (hoy tiene 2: Usuarios, Roles). Reutilizar tokens de `app/admin/admin-styles.ts` (`pageWrap`, `cardStyle`, `btnPrimario`, `labelStyle`) y el patrón de tabla de `app/admin/usuarios/page.tsx`.

| Página | Qué hace |
|---|---|
| `app/admin/notificaciones/page.tsx` | **Auditoría global**: tabla de eventos emitidos con filtros (evento, rol, fecha) y cuántas personas los han leído. Agrupa por `grupo_id`. |
| `app/admin/notificaciones/matriz/page.tsx` | **Matriz evento × rol**: filas agrupadas por `modulo` del catálogo, columnas = roles activos, checkbox por celda. Guarda en `notificaciones_suscripciones` con el patrón de `guardarPlantillaSeccionesAction` (`lib/permisos/core.ts:189`). |
| `app/admin/notificaciones/enviar/page.tsx` | **Aviso manual**: título, mensaje, href opcional, selector de roles (o todos). Emite con evento `admin.aviso`. |
| `app/admin/notificaciones/mantenimiento/page.tsx` | **Purga y retención**: editar `retencion_dias` y botón de purga inmediata (con confirmación, indicando cuántas filas se borrarán). |

---

## Instrumentación por módulo

Patrón único en todos los casos — una línea después del commit:

```ts
await emitir('d1.creada', { entidadId: reporteId, mensaje: `Nueva denuncia ${folio}` })
```

| Módulo | Puntos a instrumentar (archivo:línea) | Eventos |
|---|---|---|
| Incidentes | `lib/incidentes/actions.ts:99` `createIncidente`, `:240` `createIncidenteCliente`, `:420` `createRondinEscalado`, `:551` `createDespacho`, `:626` `enviarRefuerzos`, `:689` `cerrarPorDetencion` | `incidente.creado`, `rondin.escalado`, `despacho.asignado`, `despacho.refuerzos`, `incidente.cerrado_detencion` |
| Oficial | `lib/oficial/actions.ts:11` `crearReporteCampoOficial`, `:50` `marcarEnCamino`, `:79` `marcarEnSitio` | `reporte_campo.cerrado`, `despacho.en_camino`, `despacho.en_sitio` |
| D1 | `lib/d1/repository.ts:27` `insertarReporteDenuncia` | `d1.creada` |
| Monitorista | `repository.ts:155` `crearSolicitudEvidencia`, `:117` `actualizarEstadoSolicitud`, `:223` `insertarEvidencia`, `:448` `crearSolicitudFotos`, `:601` `rechazarFoto`, **`:608` `marcarSolicitudAtendida`**, `:533` `registrarIphDetenido` | `evidencia.solicitada`, `evidencia.entregada`, `foto.rechazada`, `iph.registrado` |
| Fiscalía | `actions.ts:56` `accionTomarCaso`, **`:78` `accionPedirEvidencias`**, `:243` `guardarPuestaDisposicion`, `:284` `guardarOficio` | `expediente.tomado`, `evidencia.solicitada`, `puesta_disposicion.generada`, `oficio.emitido` |
| Juzgado | `actions.ts:81` `accionTomarCaso`, `:107` `accionPedirEvidencias`, `:139` `accionCerrarCaso`; `repository.ts:377` `iniciarProceso`, `:386` `finalizarProceso` | `expediente.turnado`, `expediente.cerrado`, `proceso.iniciado`, `proceso.finalizado` |
| Liberaciones | `actions.ts:167` `revisarDocumento`, `:202` `finalizarRevision`, `:348` `generarOrdenPago` | `documento.revisado`, `revision.finalizada`, `orden_pago.generada` |
| Infracciones | `repository.ts:296` `insertarDocumentoLiberacion`, `:317` `insertarSolicitudLiberacion`, `:141` `marcarOrdenPagoPagada`, **`:199` `cerrarInfraccion`** | `liberacion.documento_subido`, `liberacion.solicitada`, `pago.confirmado`, `infraccion.cerrada` |
| Corralón | `lib/corralon/repository.ts:35` `finalizarInfraccionCorralon` | `corralon.finalizado` |
| Prevención | `actions.ts` — medidas (`:21`), visitas (`:53`), prórrogas (`:89`), fichas (`:130`), cancelación (`:188`), solicitudes (`:209`), C4 (`:238`), contestación (`:256`) | `medida.*`, `ficha.*`, `solicitud.*` |
| Admin Tránsito | `actions.ts:26` `crearOficial`, `:157` `destituirOficial`, `:174` `reactivarOficial` | `oficial.alta`, `oficial.destituido`, `oficial.reactivado` |
| Auxiliar | `actions.ts:20` `upsertChecklistAction` | `checklist.guardado` |
| Reportes | `formato-n-*-service.ts` `crear*` / `actualizar*` (7 servicios, mismo par) | `formato_n.capturado`, `formato_n.actualizado` |

**No instrumentar** (alto volumen, cero valor): `reportarUbicacionOficial` (telemetría GPS), `upsertPatrullas` (`lib/flota/repository.ts:16`, sincroniza toda la flota cada 6 h), `insertHistorial`, `actualizarCampo`.

### Trampa: doble emisión en Prevención

Cada entidad de `lib/prevencion/actions.ts` tiene **dos** funciones que hacen el mismo INSERT: la server action (`createMedida:21`) y su gemela de API (`createMedidaApi:285`). Poner `emitir()` en ambas duplicaría la notificación. **Extraer primero un servicio compartido** y emitir ahí una sola vez.

---

## Fases

1. **Infraestructura** — migración SQL, `catalogo.ts`, `emisor.ts`, reescritura de `repository.ts`, rutas API nuevas, cron. Sin cambios visibles todavía.
2. **UI** — campanita reescrita, montada en `Header.tsx` y `SubHeader.tsx`, página de historial.
3. **Panel admin** — las 4 páginas + link en el nav.
4. **Instrumentación** — módulo por módulo, empezando por los 5 huecos de mayor impacto.

Las fases 1-3 dejan el sistema funcionando con los 3 eventos que ya existen; la 4 es incremental y de bajo riesgo (una línea por punto).

---

## Verificación

1. `npx tsc --noEmit`, `npm run build` y `npm run lint` limpios.
2. **Migración**: correrla sobre la BD real y verificar que las 102 filas sobreviven, que las 4 leídas quedaron en `notificaciones_lecturas`, y que el `CHECK` de destinatario no rechaza ninguna fila existente:
   ```sql
   SELECT count(*) FROM notificaciones;                        -- 102
   SELECT count(*) FROM notificaciones_lecturas;               -- 4
   SELECT count(*) FROM notificaciones WHERE evento IS NULL;   -- 0
   ```
3. **Leído por persona** (el requisito central): emitir un aviso al rol Administrador (11 usuarios), entrar con dos administradores distintos, marcarla leída con uno y confirmar que el otro la sigue viendo sin leer.
4. **Historial de late-joiner**: cambiar a un usuario al rol destinatario después de emitida y confirmar que la ve en su historial.
5. **Campanita global**: verificar que aparece tanto en una página con `DashboardHeader` (ej. `/dashboard`) como en una con `SubHeader` (ej. `/agente_despacho/kpi-incidencias`).
6. **Navegación**: click en una notificación lleva a la pestaña correcta y la marca leída.
7. **Dropdown**: exactamente 5 elementos aunque haya más; "Ver todas" lleva al historial.
8. **Rendimiento**: con la pestaña oculta el polling se detiene (verificable en la pestaña Network); el endpoint de contador no ejecuta ningún INSERT.
9. **Panel admin**: desmarcar un rol en la matriz y confirmar que deja de recibir ese evento; enviar un aviso manual y verlo llegar; purgar y ver bajar el conteo.
10. Post-cambio (AGENTS.md): `npx graphify update` y crear `boveda/🧩 Features/Notificaciones.md`.

## Riesgos

- **`DROP COLUMN leida`** deja inservibles `repository.ts` y `checker.ts` hasta reescribirlos: migración y código van juntos o no van.
- **Emitir dentro de transacciones**: `insertarReporteCampo`, `createDespacho` y `createRondinEscalado` usan `BEGIN/COMMIT` explícito. Emitir dentro deja notificaciones fantasma si la tx aborta.
- **Doble emisión en Prevención** (arriba).
- **Ruido**: instrumentar los ~40 eventos de golpe puede saturar al usuario. Los defaults del catálogo deben ser conservadores; la matriz del admin es la válvula.
- **Roles basura en la matriz**: hay 32 roles, varios de prueba (`Prueba22`, `PRUEBA_CHATGPT`, `rol_prueba_2_sistema`, `en_espera`). La matriz debe listar sólo `activo = true` y conviene limpiar antes.
