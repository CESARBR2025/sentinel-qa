# Contexto — Formato Reportes de Incidencias (UDAI)

Análisis hecho por Claude (arquitecto) el 2026-08-05, contra el archivo oficial `FORMATO INCIDENCIA.xlsx` y contra la **BD real de producción, consultada en vivo por conexión directa** (`DATABASE_URL` de `.env`, Postgres). A construir por DeepSeek (worker).

**Revisión 3 (misma fecha, la definitiva)**: el usuario cerró el alcance del reporte a **solo los incidentes que nacen de una llamada al 911 y se resuelven a través del flujo real** (911 → reporte de campo del oficial → reporte de denuncia). Esto descarta `iph_detenidos` como fuente — verificado que los 10 registros de esa tabla (y el módulo "Análisis" del que dependen) están **completamente desconectados** de los 7 incidentes reales que existen hoy en `incidentes`; ninguno de los 2 incidentes reales ya cerrados con detención tiene un `iph_detenidos` vinculado. El dato del detenido/vehículo en esos 2 casos reales vive en el JSON que captura el propio oficial en su reporte de campo (`ofi_reportes_campo.ofi_detenidos`/`ofi_vehiculos`), no en Análisis.

## Qué es el archivo fuente

`FORMATO INCIDENCIA.xlsx` — 2 hojas, ambas plantillas vacías: `INCIDENCIA` (38 columnas) y `PUESTAS A DISPOSICION` (52 columnas). Se exportan en un solo `.xlsx` con las 2 hojas, igual nombres/orden que el oficial.

## El universo del reporte (decisión del usuario)

- **Ancla: `incidentes`**, no `iph_detenidos`. Cada fila del reporte es un incidente 911, con los datos del detenido/vehículo como columnas adicionales que solo se llenan si el incidente terminó en detención.
- **Filtro de estatus**: `incidentes.estatus IN ('atendido', 'cerrado_detencion')` — son los 2 únicos estados "con solución" de la máquina de estados real (`lib/incidentes/actions.ts:79`: `'sin_despachar' → 'en_despacho' → 'en_sitio' → 'atendido' | 'cerrado_detencion'`). Los incidentes en curso **no aparecen en el reporte en absoluto** (ni como "Pendientes" ni como "Completas") — decisión explícita del usuario, para no mostrar algo que todavía puede cambiar.
- **Cardinalidad verificada 1:1** en los datos reales de hoy: ningún incidente tiene más de un `ofi_reportes_campo`, ninguna denuncia más de un detenido, ningún reporte de campo más de un `ofi_detalles_asegurados`. Se diseña asumiendo **1 fila por incidente** en ambas hojas. Si el negocio permite varios detenidos por incidente en el futuro, este supuesto se rompe y hay que revisar — se documenta como limitación conocida, no se resuelve preventivamente aquí.

## Cadena de JOIN (verificada contra la BD real, sin `iph_detenidos`)

```
incidentes inc                              (911 — ancla, filtrado por estatus)
  LEFT JOIN ofi_reportes_campo rc  ON rc.incidente_id = inc.id     (reporte de campo del oficial)
  LEFT JOIN ofi_reporte_denuncia rd ON rd.incidente_id = inc.id    (reporte de denuncia — solo si hubo detención/D1)
  LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id  (datos ricos del detenido, si Análisis los capturó)
  LEFT JOIN ofi_puesta_disposicion pd  ON pd.reporte_campo_id = rc.id  (tramo de traslado/entrega, si existe)
  LEFT JOIN ofi_oficiales ofic ON ofic.id = rc.ofi_oficial_id      (oficial que atendió)
  LEFT JOIN users u ON u.id = ofic.user_id                         (nombre real del oficial)
  LEFT JOIN incidente_personas_afectadas afe ON afe.incidente_id = inc.id  (nombre/sexo/edad del afectado, si se capturó)
  LEFT JOIN formato_incidencia_complemento comp ON comp.incidente_id = inc.id  (captura manual, tabla nueva)
```

## Mapa completo — Hoja `INCIDENCIA` (38 columnas)

| # | Columna Excel | Fuente final | Estado |
|---|---|---|---|
| 1 | IPH | `rd.iph` | OK si hubo denuncia; vacío si no |
| 2 | FOLIO 911 | `inc.folio` | **100% automático** (formato `SSPM/INC/2026/NNN`, siempre poblado) |
| 3 | FECHA EVENTO | `inc.fecha_hora_inicio::date` | Automático |
| 4 | FECHA REPORTE2 | `rd.fecha_reporte` | OK si hubo denuncia |
| 5 | DIA EVENTO | Calculado en código desde FECHA EVENTO | Automático, nunca requiere captura |
| 6 | HORA REPORTE | `rd.hora_reporte` | OK si hubo denuncia |
| 7 | HORA INICIO EVENTO | `inc.fecha_hora_inicio::time` | Automático |
| 8 | HORA FINAL EVENTO | `inc.fecha_hora_fin::time` | Automático, pero casi siempre NULL en la práctica (incidentes no se cierran en ese campo) |
| 9 | HORA PROMEDIO | Calculado desde 7 y 8 | Automático |
| 10 | DELITO | `COALESCE(rd.delito, rc.delito)` | Automático |
| 11 | ARTICULOS U OBJETOS | — | **Manual** (antes resolvía `iph.articulos_objetos`; sin `iph_detenidos` no hay reemplazo) |
| 12 | MODUS | `rc.modus_operandi` | Automático |
| 13 | CALLE | `rc.ofi_calle` | Automático |
| 14 | NUMERO O REFERENCIA | `rc.ofi_referencia` | Automático |
| 15 | COLONIA | `rc.ofi_colonia` | Automático |
| 16 | SECTOR | `rd.sector` | OK si hubo denuncia |
| 17 | RT | — | **Manual** (antes `iph.rt_responsable`, sin reemplazo) |
| 18 | TURNO | — | **Manual** (antes `iph.turno_responsable`, sin reemplazo; existe catálogo `cat_turnos` pero ninguna tabla del flujo 911 lo referencia hoy) |
| 19 | CRP | `rd.crp` | OK si hubo denuncia (formato real verificado: `ER-721-A1`) |
| 20 | AFECTADO | `afe.nombre` (`incidente_personas_afectadas`) | Automático si se capturó (hoy 1 fila en toda la BD — dato real pero escaso) |
| 21 | CALLE AFEC | — | **Manual** (sin domicilio propio del afectado en ninguna tabla) |
| 22 | NUMERO AFEC | — | **Manual** |
| 23 | COLONIA AFEC | — | **Manual** |
| 24 | TELEFONO AFEC | `inc.telefono_reportante` | Best-fit — es el teléfono de quien llamó al 911, no necesariamente el del afectado (mismo caveat que antes) |
| 25-33 | MARCA...MODELO | Ver "Vehículo" abajo | Automático con JSON + manual de respaldo |
| 34 | AP/NUC | — | **Manual** (sin reemplazo) |
| 35 | FUERO | Derivado de `rd.grupo_adscripcion` (contiene `FEDERAL` → `FEDERAL`, si no → `COMÚN`) | Automático con transformación — confirmado por el usuario, con override manual disponible por si el mapeo falla en un caso |
| 36 | LATITUD | `COALESCE(rc.ofi_latitud, rd.latitud, inc.latitud)` | Automático |
| 37 | LONGITUD | `COALESCE(rc.ofi_longitud, rd.longitud, inc.longitud)` | Automático |
| 38 | AGENTE_APREHENSOR | `u.name` (vía `rc.ofi_oficial_id → ofi_oficiales.user_id → users.name`) | Automático si el reporte de campo tiene oficial asignado (7/19 hoy) |

## Mapa completo — Hoja `PUESTAS A DISPOSICION` (52 columnas)

Solo tiene sentido para incidentes con `rc.ofi_hay_detencion = true` (`estatus = 'cerrado_detencion'`) — en los demás, las columnas de detenido/vehículo simplemente salen vacías (no es un error, es correcto: no hubo detenido).

| # | Columna Excel | Fuente final | Estado |
|---|---|---|---|
| 1-19 | IPH...CRP | Igual que hoja `INCIDENCIA` (mismo incidente) | — |
| 16 (bis) | AGRUPAMIENTO | — | **Manual** (antes `iph.agrupamiento_arresto`, sin reemplazo) |
| 17-20 | AFECTADO...COLONIA AFEC | Igual que hoja `INCIDENCIA` | — |
| 21-29 | MARCA...MODELO | Ver "Vehículo" abajo | — |
| 30 | DETENIDO | Ver "Detenido" abajo | — |
| 31 | ALIAS | `da.apodo` | Automático si Análisis lo capturó; si no, vacío (el JSON del reporte de campo no trae alias) |
| 32 | FECHA DE NAC | `da.fecha_nacimiento` | Automático si Análisis lo capturó; si no, **manual** |
| 33 | EDAD | — | **Manual** (ni `da` ni el JSON traen edad) |
| 34 | SEXO | `da.genero` | Automático si Análisis lo capturó; si no, **manual** |
| 35-37 | CALLE/NUMERO/COLONIA DET | `da.calle`/`da.numero`/`da.colonia` | Automático si Análisis lo capturó; si no, **manual** |
| 38 | LATITUD | Igual que hoja `INCIDENCIA` col. 36 | — |
| 39 | LONGITUD | Igual que hoja `INCIDENCIA` col. 37 | — |
| 40 | MUNICIPIO | `inc.municipio` | **100% automático** (columna `NOT NULL` en `incidentes`, siempre poblada — mejor que la fuente original) |
| 41 | ORIGINARIO | `da.originario` | Automático si Análisis lo capturó (2/14 hoy); si no, **manual** |
| 42 | NUC / CU | `da.curp` | Sugerencia automática, no fuente de verdad confirmada — usuario indicó incertidumbre, se deja editable |
| 43 | FUERO | Igual que hoja `INCIDENCIA` col. 35 | — |
| 44 | FOLIO RND | — | **Manual** (antes `iph.rnd`, sin reemplazo) |
| 45 | LATITUD2 | Mismo valor resuelto que col. 38/`LATITUD` (no hay una segunda coordenada distinta sin `iph.latitud_hecho`) | Automático, duplicado deliberado — documentar como limitación conocida |
| 46 | LONGITUD3 | Mismo valor resuelto que col. 39/`LONGITUD` | Automático, duplicado deliberado |
| 47 | AGENTE_APREHENSOR | Igual que hoja `INCIDENCIA` col. 38 | — |
| 48 | FECHA DE INGRESO | `fecha_evento + pd.hora_llegada_sede` cuando existe fila en `ofi_puesta_disposicion` | Automático pero escaso (1/19 `ofi_reportes_campo` tiene esta fila hoy); **manual** de respaldo |
| 49 | FECHA DE SALIDA | `fecha_evento + pd.hora_inicio_traslado` | Igual que arriba |
| 50 | OTRO DELITO | — | **Manual**, sin fuente automática |
| 51 | MASC | — | **Manual**, texto libre (decisión previa del usuario) |
| 52 | UMECAS | — | **Manual**, texto libre (decisión previa del usuario) |

### Detenido y vehículo — doble fuente, sin `iph_detenidos`

```
DETENIDO   = COALESCE(da.nombre + ap_paterno + ap_materno [Análisis, si existe],
                       primer elemento de rc.ofi_detenidos->>'nombre' + apellidos [reporte de campo, JSON])
MARCA/SUBMARCA/TIPO/COLOR/PLACAS/ESTADO/NIV/MOTOR/MODELO =
             COALESCE(da correspondiente si existiera [hoy no aplica, da no tiene campos de vehículo],
                       primer elemento de rc.ofi_vehiculos con llaves alternativas)
```

**Advertencia real sobre `ofi_vehiculos`/`ofi_detenidos` (JSON, sin esquema fijo)** — verificado con 2 muestras reales:

```json
// Reporte de campo A (incidente 007):
"ofi_vehiculos": [{ "tipo": "automovil", "color": "ROJO", "serie": "...", "placas": "MNY-22-33`", "destino": "CORRALON MW" }]
// Reporte de campo B (incidente sembrado, no en el universo del reporte pero mismo capturador):
"ofi_vehiculos": [{ "tipo": "VEHICULO", "color": "GRIS", "marca": "NISSAN", "placa": "ULK-740-A", "modelo": "VERSA" }]
```

Ningún oficial llenó las mismas llaves: uno usó `placas` (con `s`) y no puso `marca`/`modelo`/`submarca`; otro usó `placa` (sin `s`) y sí puso `marca`/`modelo` pero no `submarca`/`niv`/`motor`/`estado`. La extracción en código debe leer **variantes de llave** (`v.placas ?? v.placa`) y aceptar que columnas como `SUBMARCA`/`NIV`/`MOTOR`/`ESTADO` casi siempre van a salir vacías del JSON — para esas, ofrecer también captura manual.

## Tabla nueva: `formato_incidencia_complemento`

Llave: `incidente_id` (decisión del usuario — ya no `iph_detenido_id`, porque no siempre hay detenido). Solo columnas sin ninguna fuente automática confiable hoy:

```sql
CREATE TABLE formato_incidencia_complemento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incidente_id uuid NOT NULL UNIQUE REFERENCES incidentes(id),

  -- Hoja INCIDENCIA
  rt character varying,
  turno character varying,
  articulos_objetos text,
  ap_nuc character varying,
  calle_afec character varying,
  numero_afec character varying,
  colonia_afec character varying,
  fuero_override character varying,   -- corrige el FUERO auto-derivado de grupo_adscripcion cuando el mapeo falle

  -- Hoja PUESTAS A DISPOSICION (solo aplica si hubo detención)
  agrupamiento character varying,
  folio_rnd character varying,
  originario character varying,
  nuc_cu character varying,
  edad integer,
  fecha_nacimiento date,
  sexo character varying,
  calle_det character varying,
  numero_det character varying,
  colonia_det character varying,
  marca character varying,
  submarca character varying,
  tipo_vehiculo character varying,
  color character varying,
  placas character varying,
  estado_vehiculo character varying,
  niv character varying,
  motor character varying,
  modelo character varying,
  fecha_ingreso timestamptz,
  fecha_salida timestamptz,
  otro_delito text,
  masc text,
  umecas text,

  completado_en timestamptz,      -- NULL = pendiente; con valor = completo, exportable
  completado_por text REFERENCES users(id),
  creado_en timestamptz NOT NULL DEFAULT NOW(),
  actualizado_en timestamptz
);
```

`completado_en` sigue siendo el único criterio de "Pendiente" vs. "Completa" (el humano decide cuándo el registro está listo, no se exige que cada columna tenga valor).

## Fuera de alcance (no implementar salvo pedido explícito)

- Tocar `formAnalisis.tsx` / `useAnalistaForm.ts` / el módulo de Análisis en general — quedó fuera de la cadena de este reporte.
- Tocar el flujo de captura de `ofi_reportes_campo.ofi_detenidos`/`ofi_vehiculos` (JSON) para estandarizar sus llaves — se lee tal cual está, de forma defensiva, no se corrige en origen.
- Convertir `MASC`/`UMECAS` a catálogo.
- Incidentes "en curso" — no entran al reporte bajo ninguna pestaña.
- Soportar más de 1 reporte de campo o más de 1 detenido por incidente — se asume 1:1, documentado como límite conocido.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update`.
3. `npm run db:schema` después de aplicar la migración de Etapa 1.
4. Bóveda actualizada (Etapa 6).
5. Prueba manual en navegador (la hace el usuario): con los 2 incidentes reales `cerrado_detencion` (`SSPM/INC/2026/006` y `007`), confirmar que "Completar datos" solo pide lo que de verdad falta (no todo el formulario en blanco como en el ejemplo original de `IPH-0009`, que era un registro fuera de la cadena real).
