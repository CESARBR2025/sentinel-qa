# Reporte de Alarmas Escolares 911 (formato C4)

**Propósito**: Concentrado de **alarmas escolares** (`incidentes.tipo_reporte = 'alarma_escolar'`)
del canal 911 ciudadano, replicando el reporte mensual que arma el C4 para Área de Líneas
(`ALARMAS ESCOLARES [MES].xlsx`).

Se accede desde `/agente_911/reportes/alarma-escolar`. Mismo permiso de canal (`911_ciudadano`),
mismo patrón de UI que [[Reporte de Llamadas de Extorsión 911]] (`FiltroRangoFechas` +
`BotonExportarExcel`).

---

## Regla de negocio clave: solo casos cerrados formalmente

A diferencia de extorsión, un registro **solo aparece en este reporte si el incidente fue
canalizado a Despacho y el oficial cerró el caso con Reporte de Campo**
(`incidentes.estatus IN ('atendido', 'cerrado_detencion')`, fijado en
`lib/oficial/repository.ts` al capturar `ofi_reportes_campo`). Esto refleja el flujo real: la
escuela reporta la alarma → C4 la registra y canaliza → una unidad real llega y el oficial cierra
con reporte de campo → **hasta entonces** el caso "cuenta" para el reporte mensual del C4.

**Unidad que arribó, hora de arribo y hora de canalización NO se capturan a mano** — se derivan
del flujo real de Despacho ya existente (`incidente_despacho`, `incidente_despacho_unidades`,
`incidente_despacho_elementos`), el mismo que usa el Tablón de Despacho para cualquier otro
incidente. Antes existían como columnas de texto libre en `incidente_alarma_escolar` pero nunca
se llegaron a capturar (0 filas en producción) — se eliminaron en
`lib/db/manual-migrations/0045_alarma_escolar_ajustes.sql`.

## Dirección: una sola fuente, no dos

La ubicación de una alarma escolar **es** la ubicación del incidente — no hay dos lugares
distintos. `incidente_alarma_escolar` tuvo brevemente su propio campo `direccion` de texto libre
en el panel de Step 4, duplicando lo que el operador ya llena en Step 3 (Ubicación: mapa de
Google + `calle`/`numero_exterior`/`colonia`/`referenciaUbicacion`, con coordenadas reales). Se
quitó (`lib/db/manual-migrations/0046_alarma_escolar_direccion.sql`) y el reporte construye la
columna "Dirección" directamente desde `incidentes` (más completo que el "Lugar" genérico que
usan otros reportes — por eso aquí no existe columna "Lugar" separada, a diferencia de
[[Reporte de Llamadas de Extorsión 911]]).

## Origen de datos

| Columna del reporte | Fuente BD |
|---|---|
| Fecha / Hora / Folio de Reporte | `incidentes.fecha_hora_inicio`, `incidentes.folio_cad` |
| Dirección | `incidentes.calle` + `numero_exterior` + `colonia` + `referencia_ubicacion` (capturados en Step 3 del formulario, un solo lugar por incidente) |
| Establecimiento / Inmueble | `incidente_alarma_escolar` (texto libre — sin catálogo de escuelas por ahora) |
| Tipo de Señal | `incidente_alarma_escolar.reporte_descripcion` (select con lista fija normalizada, panel del formulario) |
| Prioridad | `cat_prioridades.nombre` vía `incidentes.prioridad_id` — **no** es columna propia; ya se captura de forma genérica en Clasificación Técnica (Step 4 del formulario, visible también para alarma escolar) |
| Activaciones | `incidente_alarma_escolar.activaciones` |
| Falso | `incidente_alarma_escolar.es_falso` (boolean nullable — "Sin confirmar" si es null) |
| Responsable / Nombre Responsable | `incidente_alarma_escolar.responsable` (cargo, ej. "Dirección") + `nombre_responsable` |
| Verificador | `incidente_alarma_escolar.nombre_verificador` — operador de C4 que confirma por teléfono/radio, texto libre (no es el oficial que llega físicamente) |
| Hora Canalización | `incidente_despacho.fecha_hora_despacho` |
| Unidad Arribo / Hora Arribo | `incidente_despacho_unidades.unidad_placa` (agregadas con `STRING_AGG` si hay más de una) / `MIN(hora_llegada)`, unidades primarias (`es_refuerzo = false`) |
| Oficial | `incidente_despacho_elementos.elemento_nombre`, agregados con `STRING_AGG` (equipo primario, `es_refuerzo = false`) |

- Capa de negocio: `lib/reportes-operativos/repository.obtenerAlarmasEscolaresDetalle(desde, hasta)`
  → `lib/reportes-operativos/service.obtenerDatosAlarmasEscolares(desde, hasta)`. Tipo
  `AlarmaEscolarDetalleRow`.
- La consulta hace `JOIN incidente_alarma_escolar` + `LEFT JOIN` a `cat_prioridades`,
  `incidente_despacho`, filtrando `estatus IN ('atendido','cerrado_detencion')`.
- **Unidad/oficial usan `LEFT JOIN LATERAL` + `STRING_AGG`, no `JOIN` directo.** `atiende_caso`
  en `incidente_despacho_elementos` es `true` por default para **todo** el equipo asignado en el
  despacho principal (solo se ajusta a un solo elemento en el flujo de rondín escalado) — un JOIN
  directo contra esa tabla produce una fila del reporte por cada oficial del equipo (fan-out
  detectado en pruebas reales: 1 incidente con 4 oficiales asignados → 4 filas duplicadas en la
  tabla). `unidad_arribo` usa `unidad_placa` (ej. "ER-721-A1"), no `unidad_ext_id` (UUID interno
  de la unidad, no legible) — mismo campo que ya usa [[Reporte de Llamadas de Extorsión 911]].

## Archivos involucrados

| Archivo | Rol |
|---|---|
| `app/agente_911/reportes/alarma-escolar/page.tsx` | Página del reporte |
| `components/911/reportes/TablaAlarmaEscolar.tsx` | Tabla, búsqueda cliente + paginación |
| `app/api/reportes/alarma-escolar/exportar/route.ts` | GET → ExcelJS → `.xlsx` (17 columnas) |
| `lib/reportes-operativos/repository.ts` | `obtenerAlarmasEscolaresDetalle()` |
| `lib/reportes-operativos/service.ts` | `obtenerDatosAlarmasEscolares()` |
| `app/agente_911/ciudadano/Formulario911.tsx` | Captura — Step 3 (Ubicación, compartido) + Step 4 "Detalles de Alarma Escolar" (visible si `tipoReporte === 'alarma_escolar'`) |
| `lib/incidentes/actions.ts::createAlarmaEscolar` | INSERT en `incidente_alarma_escolar` |
| `lib/db/manual-migrations/0045_alarma_escolar_ajustes.sql` | Quita `hora_canalizacion`/`unidad_arribo`/`hora_arribo` (huérfanas, superadas por el join a despacho); agrega `es_falso`; elimina `cat_turnos`/`usuario_modulos` (0 filas, 0 referencias en código) |
| `lib/db/manual-migrations/0046_alarma_escolar_direccion.sql` | Quita `direccion` (huérfana, superada por `incidentes.calle`/`numero_exterior`/`colonia`/`referencia_ubicacion` ya capturados en Step 3) |

## Seguridad

- Página y export validan sesión + `tieneAccesoSeccion(usuarioId, '911_ciudadano')`.

## Notas de diseño

- El campo `activaciones` del formulario tenía un bug de nombre (`numeroActivaciones` en el input,
  `activaciones` en el backend) que hacía que siempre se guardara `0` — corregido junto con este
  cambio.
- El Step 5 (Canalización) tenía un `<textarea>` "Observaciones" duplicado sin atributo `name` —
  campo muerto que nunca se guardaba. Se eliminó, dejando solo "Observaciones del Operador".
- **Establecimiento/Escuela sigue siendo texto libre** — el Excel origen (`Hoja3`, ~202 planteles
  con dirección/turno/contacto) es candidato natural para un catálogo de escuelas, pero se dejó
  fuera de esta iteración por decisión explícita del usuario.
- El campo "Dirección del Plantel" se agregó primero como texto libre en Step 4 y se quitó poco
  después (0046) al notar que duplicaba Step 3 — el operador no debe escribir la misma dirección
  dos veces. Mismo principio que ya se aplicó con unidad/hora de arribo (0045): si el dato ya
  existe en otro lado del flujo, el reporte lo lee de ahí, no lo vuelve a pedir.
