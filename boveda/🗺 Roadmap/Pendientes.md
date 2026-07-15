# Pendientes y Roadmap

**Propósito**: Próximas features y mejoras.

---

## Pendientes
- [ ] Tests automatizados (no hay ninguno actualmente)
- [ ] Estandarizar respuestas de API routes con apiHandler/apiSuccess
- [ ] Auditoría de mutaciones (registro de quién creó/actualizó qué)
- [ ] `components/maps/GoogleMapPicker.tsx` recibe `libraries` como prop opcional sin default —
  distintas páginas lo llaman con arrays de libraries de Google Maps diferentes (`['places']` en
  unas, sin especificar en otras). `useJsApiLoader` exige que TODA la app use exactamente las
  mismas opciones para el mismo `id: 'google-map-script'`; si un usuario navega client-side entre
  dos páginas con configs distintas, truena con "Loader must not be called again with different
  options". Reproducido en desarrollo navegando de una página con mapa a `/analisis/formulario-
  ingreso` en la misma sesión de servidor. Fix real: unificar `libraries` en un solo valor
  constante para toda la app (auditar los ~9 archivos que usan `useJsApiLoader`).
- [ ] Logging estructurado y observabilidad
- [ ] Validación de entrada con Zod en server actions

## Deuda técnica — roles y permisos (auditoría 2026-07-15)

Se corrigió el bug raíz (`PERMISO_TOTAL` invertido en `lib/permisos/core.ts`, sin bypass
para admin) y se migraron los 6 módulos de rol exacto (agente_911, agente_bitacorista,
agente_despacho, agente_infracciones, agente_juzgado, agente_liberaciones) al sistema de
permisos granular. Ver `boveda/🏗 Arquitectura/Decisiones.md`. Queda pendiente:

- [ ] **83 rutas de `app/api` sin ningún chequeo de rol/permiso** (solo exigen sesión vía
  `proxy.ts`, o ni eso). Se arreglaron ya las 3 más críticas (`via/infracciones/liberar-garantia`,
  `via/infracciones/registradas/[id]`, `via/liberaciones/documentos/[infraccionId]`). Prioridad
  sugerida para el resto, por sensibilidad de datos: `app/api/detenidos/*`, `app/api/incidentes/*`,
  `app/api/monitorista/*`, `app/api/prevencion/*`, `app/api/reportes*`, `app/api/via/infracciones/*`
  y `app/api/via/sa7/*` (mueven dinero). Usar el patrón de `verificarRolXXX`/`tienePermiso` ya
  existente en cada módulo — no reinventar.
- [ ] Revisar `app/api/complementos/gruas/route.ts` y `app/api/expediente/proxy/route.ts` — no
  validan sesión y no son parte del flujo público de ciudadano (a diferencia de `via/ciudadano/*`,
  `via/pagos/confirmar-*` y `via/curp`, que sí son intencionalmente públicos).
- [ ] `app/admin-transito/layout.tsx` sigue comparando `rolNombre !== 'admin_transito'` — no se
  tocó en esta pasada por ser un rol de módulo (no el bypass de super-admin), pero debería
  migrarse al mismo patrón de permisos granulares.
- [ ] Roles duplicados en BD: `Auxiliar` (id 32) y `Auxiliar de Novedades` (id 24) mapean al mismo
  módulo en `lib/permisos/registro.ts:73-88` — normalizar en BD requiere decisión de negocio
  (cuál es el nombre correcto) antes de eliminar el duplicado del código.
- [ ] Roles de prueba sueltos en la tabla `roles` de producción (`Prueba22`, `PRUEBA_CHATGPT`,
  `rol_prueba_2_sistema`, `ANALISTA_ROL`, `en_espera`, `ofi_destituido`) — limpiar si ya no se usan.

### Verificación en vivo (login real, 2026-07-15) — encontrado y corregido
- `lib/oficial/service.ts` tenía un **8º módulo no detectado** en ninguno de los barridos
  anteriores (ni el de roles hardcodeados, ni el de headers/logout — `/oficial` usa
  `ProfileDropdown`, no `DashboardHeader`, por eso no apareció en el grep de logout tampoco):
  `verificarRolOficial` comparaba `rol === 'Oficial de Campo'` a mano, sin bypass admin. Se
  detectó probando con el login real de Administrador: `/oficial`, `/oficial/despachos` y
  `/oficial/reportes` redirigían a `/dashboard` incluso para el admin. Migrado a
  `tienePermiso(userId, 'oficial_campo', 'ver')` (la sección ya existía en
  `lib/incidentes/permisos.ts`/`registro.ts`, con plantilla y filas de usuario reales ya en
  `puede_ver=true` — verificado en BD antes de migrar, cero riesgo para los 2 usuarios reales
  con ese rol). `obtenerRolUsuario` de `lib/oficial/repository.ts` quedó sin callers, eliminado.
  **Lección**: los checks de rol hardcodeado pueden usar cualquier nombre de función
  (`verificarRolXXX` no es un patrón universal) — la única forma confiable de encontrarlos todos
  es `grep -rn "=== '.*rol.*'"` contra el valor literal del rol, o probar cada módulo con un
  login real de Administrador.
- `app/api/expediente/subir-foto-detenido/route.ts` — rama `if/else` por rol (`agente_fiscalia`
  → destinos FISCALIA/AMBOS, `agente_juzgado` → JUZGADO_CIVICO/AMBOS, cualquier otro rol → 403).
  El admin caía en el `else` y quedaba bloqueado. Se agregó `esAdmin` como primera rama
  (destinos permitidos = todos). Sigue habiendo lógica de negocio por rol aquí (a propósito: qué
  destino puede subir fotos según dependencia) — no se migró a `tienePermiso` porque no es un
  simple ver/no-ver, es una regla de negocio distinta; solo se le agregó el bypass de admin.
- `lib/monitorista/actions.ts:requireMonitorista()` — `rol !== 'Monitorista'` a mano, bloqueaba
  `subirEvidencia` (Server Action) para el admin aunque ya pudiera ENTRAR a `/monitorista` vía el
  layout. Migrado a `tienePermiso(userId, 'solicitudes', 'ver')`. `getRolUsuario` de
  `lib/monitorista/repository.ts` quedó sin callers, eliminado.
- `app/admin-transito/layout.tsx` — el mismo `rolNombre !== 'admin_transito'` documentado como
  "pendiente" en la ronda anterior: probado en vivo, confirmado que bloqueaba al admin
  (`/admin-transito` → redirect a `/dashboard`). Migrado a
  `tienePermiso(userId, 'admin_transito', 'ver')` (sección y plantilla ya existían en
  `lib/admin-transito/permisos.ts`/`registro.ts`, 1 usuario real ya con `puede_ver=true`).
- **Barrido completo de las 133 páginas de la app** (login real de Administrador) encontró 2 bugs
  SQL preexistentes, sin relación con roles/permisos, que rompían páginas para CUALQUIER usuario:
  - `lib/reportes-operativos/repository.ts` y `service.ts` — `created_at` sin calificar en 7
    queries que hacen `JOIN` con `users` (que también tiene `created_at`) → error de Postgres
    "la referencia a la columna «created_at» es ambigua", tumbaba `/modulo_incidentes` con 500
    para todos. Arreglado calificando como `ofi_reportes_campo.created_at`.
  - Ver el punto de `GoogleMapPicker`/`useJsApiLoader` en la lista general de arriba — no se
    arregló (requiere auditar ~9 archivos), solo documentado.
  - El resto de los "500" detectados en el barrido fueron falsos positivos del método de prueba
    (IDs de prueba no-UUID/no-numéricos contra columnas `uuid`/`integer` reales) — verificado
    repitiendo con un UUID válido pero inexistente: todos devuelven 404 o redirect correcto, no
    hay bug real.

### Revisión final (code-review, 2026-07-15) — ya corregido en esta pasada
- `lib/fiscalia/service.ts` tenía un **7º módulo no detectado** en el barrido inicial:
  `verificarRolFiscalia` y una segunda `verificarRolJuzgado` (duplicada, usada por
  `lib/fiscalia/actions.ts`) seguían comparando `rolNombre === 'agente_fiscalia'/'agente_juzgado'`
  a mano, sin bypass admin. Migradas a `tienePermiso()`.
- N+1 queries en `verificarRolAgente911`/`verificarRolAgenteDespacho` (2 llamadas secuenciales a
  `tieneAccesoSeccion`, hasta 4 queries) — colapsado a `tieneAlgunAcceso(userId, [secciones])` en
  `lib/911/permisos.ts`, 1 sola query.
- Código muerto (`obtenerRolUsuario` sin callers) eliminado de
  `lib/fiscalia/repository.ts`, `lib/agente_infracciones/repository.ts`,
  `lib/agente_juzgado/repository.ts`, `lib/agente_liberaciones/repository.ts`.
- `mapaDefault`/`mapaCompleto` duplicadas en `lib/permisos/core.ts` colapsadas en `mapaBase(secciones, base)`.

### Revisión final — pendiente, no corregido (bajo impacto, decisión consciente)
- [ ] `verificarRolInfracciones` (usado por `app/api/via/infracciones/liberar-garantia`, un PATCH)
  está fijo en la acción `'ver'` en vez de `'editar'`, igual que su Server Action equivalente en
  `lib/agente_infracciones/actions.ts`. Hoy no hay ningún usuario en BD con `puede_ver=true` y
  `puede_editar=false` para la sección `infracciones`, así que no hay impacto real — pero si se
  configura ese caso a futuro, un usuario de solo-lectura podría liberar garantías. No se corrigió
  aquí para no desalinear el API route del Server Action que protege la misma operación; si se
  arregla, hacerlo en ambos lugares a la vez.
- [ ] Las 3 rutas API nuevas (`via/infracciones/liberar-garantia`, `via/infracciones/registradas/[id]`,
  `via/liberaciones/documentos/[infraccionId]`) devuelven `NextResponse.json` a mano para 401/403 en
  vez de `UnauthorizedError`/`ForbiddenError` de `lib/error-handler.ts` (que exige AGENTS.md). Se
  dejó así por ser consistente con 90/104 rutas API existentes que ya hacen lo mismo — ver el punto
  de la lista general "Estandarizar respuestas de API routes" arriba.

## UI: botón Dashboard, logout y textos hardcodeados (2026-07-15)

Causa raíz: `components/partials/Header.tsx` (`DashboardHeader`) por defecto apuntaba
`backHref="/dashboard"` a ciegas — pero para ~14 roles con hub propio (monitorista, auxiliar,
reportes, fiscalía, nCoordinación, agente_911, agente_despacho, agente_bitacorista,
agente_juzgado, agente_liberaciones, agente_infracciones, admin_transito, oficial, corralón),
`/dashboard` redirige automáticamente de vuelta a ese mismo hub (`app/dashboard/page.tsx`) — el
botón "← Dashboard" era un loop muerto. Además el componente no traía botón de cerrar sesión
propio (dependía de que cada página pasara `children`, y 27 no lo hacían). Y la versión
"CENTINELA v1.2" estaba copy-pasteada como texto literal en 65 archivos (por eso el último push
tuvo que tocar 65 archivos solo para subir el número).

**Corregido:**
- `lib/auth/helpers.ts`: nuevo `obtenerHubRol(rolNombre)` — única fuente de verdad rol→hub,
  reemplaza el if-chain duplicado que vivía en `app/dashboard/page.tsx`.
- `DashboardHeader`: `backHref` ahora es opcional sin default — si no se pasa, no se muestra
  ningún botón "volver" (nunca más un link hardcodeado a ciegas). Trae `<SignOutButton />`
  integrado, arreglando las 27 páginas que no tenían logout de una sola vez.
- 5 hubs raíz (monitorista, auxiliar, reportes, fiscalía, nCoordinación) calculan su `backHref`
  dinámicamente con `obtenerHubRol`: se oculta para el rol dueño del hub, muestra `/dashboard`
  real para Administrador.
- 4 subpáginas de `/analisis/*` apuntan a `/analisis` en vez de a `/dashboard`.
- `lib/constants.ts` nuevo (`APP_VERSION`) — los 65 archivos con "CENTINELA v1.2" hardcodeado
  ahora interpolan `{APP_VERSION}`; el próximo cambio de versión toca un solo archivo.

**Pendiente, no corregido en esta pasada (alcance acotado a pedido del usuario):**
- [ ] ~16 páginas que no son hub-raíz ni tienen backHref dinámico (`d1`, `d1_noiniciada`,
  `modulo_incidentes`, `reportes_incidentes`, `incidentes_camaras`, `denuncia/nuevo`,
  `estadisticos`, `sin_robos`, `incidentes`, `envio-de-formatos`, `oficial/despachos/[id]` ya
  tenía backHref correcto) ahora simplemente no muestran botón "volver" (antes apuntaban a
  `/dashboard`, incorrecto para varios roles). Si se quiere el botón de vuelta, hay que decidir
  cuál es el destino lógico de cada una caso por caso.
- [ ] 8 componentes `ProfileDropdown` casi idénticos (uno por módulo: oficial, fiscalía, juzgado,
  liberaciones, infracciones, auxiliar, nCoordinación, corralón) — navbar/dropdown duplicado 8
  veces. No se fusionaron en esta pasada (decisión del usuario: solo el footer). Cada uno ya
  incluye su propio logout funcional, así que no es un bug — es deuda de mantenimiento.

## Migración a header único (`DashboardHeader`, look de `/dashboard`) — plan por módulo (ver ADR-009)

Estándar final decidido: `DashboardHeader` (`components/partials/Header.tsx`), rehecho para verse
idéntico al header real de `/dashboard` (sticky, blur, logo 64px, animación `app-header-reveal`
en `globals.css`). **No** `SubHeader` — ese fue un primer intento, revertido por el usuario.
Migración deliberadamente gradual (no todo de un jalón) para poder revisar cada módulo en el
navegador antes de dar por bueno el cambio visual.

**Ya en `DashboardHeader` (2026-07-15):**
- `app/dashboard` (ahora consume el componente en vez de duplicar el header inline)
- `monitorista/detenidos/[id]`, `monitorista/denuncias/[id]`
- `auxiliar/cuestionario-robo`, `auxiliar/checklist`, `auxiliar/checklist/[id]`
- `oficial/despachos`, `oficial/reportes`, `oficial/reportes/[id]`, `oficial/reportes/[id]/fotos`

**Con logout agregado pero con su header propio sin migrar** (decisión explícita del usuario de
no arriesgar el look en esta pasada):
- `agente_infracciones/revision-documental/[id]`, `agente_liberaciones/revision-documental/[id]`
- `agente_juzgado/solicitudes/[solicitudId]`, `agente_juzgado/liberaciones/[id]`
- `fiscalia/solicitudes/[solicitudId]`, `fiscalia/expedientes/[solicitudId]`,
  `fiscalia/liberaciones/[id]`

**Siguen en `SubHeader` (no revertidas, pendiente decidir si migrar a `DashboardHeader`):**
- [ ] `formato-n-*` (~15 archivos), `monitorista/historial`, `monitorista/detenidos` (raíz),
  `monitorista/incidentes-camara*`, `monitorista/solicitudes` (raíz), `rol_servicios` — todas
  usaban `SubHeader` desde antes de esta sesión o se dejaron así; no se tocaron en la reversión
  porque el pedido explícito fue sobre las 9 recién migradas. Decidir si también pasan a
  `DashboardHeader` para tener un solo estilo de verdad en todo el sistema.

**Sin tocar — pendiente de decidir en próxima sesión:**
- [ ] `monitorista/solicitudes/[id]` — tema oscuro (`#050810`); `DashboardHeader` es claro,
  necesita variante oscura o quedarse con su header propio a propósito.
- [ ] Resto de páginas "detalle" de `agente_juzgado`/`fiscalia` con el template logo+color
  (`detenidos/[id]`, `asegurados/[id]`, `asegurados/puesta-disposicion/[id]`, etc.) — no
  auditadas aún, probablemente mismo patrón que las 7 ya resueltas.
- [ ] Los 8 `ProfileDropdown` de páginas hub (oficial, fiscalía, juzgado, liberaciones,
  infracciones, auxiliar, nCoordinación, corralón) — candidatos a reemplazar por `DashboardHeader`
  sin `backHref` (páginas hub no necesitan volver).
- [ ] Las ~16 páginas sin back button documentadas arriba (`d1`, `incidentes`, etc.) — decidir
  destino lógico de cada una antes de agregarles `DashboardHeader`.
