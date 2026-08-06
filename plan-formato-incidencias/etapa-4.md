# Etapa 4 — Vista de tabla, segmentada Pendientes/Completas, con "Completar datos"

Depende de Etapa 2 (repository + `actions.ts`) y Etapa 3 (link desde el hub). **Leer `DESIGN.md` completo antes de tocar esta UI.**

Una sola tabla (no hay tab por hoja del Excel), segmentada por `SegmentPage` en `Pendientes` / `Completas`. El universo ya viene filtrado desde la Etapa 2 (`WHERE inc.estatus IN ('atendido','cerrado_detencion')`) — los incidentes en curso no llegan aquí, no hace falta ningún filtro adicional en esta capa.

## Archivos a crear

- `app/formatos-udai/reportes-incidencias/page.tsx`
- `components/formatos-udai/CompletarDatosModal.tsx`
- `components/formatos-udai/DetalleReporteIncidenciaModal.tsx`

## 1. Página

Mismo esqueleto que la Etapa 4 de la revisión anterior de este plan (`PageHeader` + `SegmentPage` con tabs `pendientes`/`completas` vía `?tab=` + tabla + `BotonExportarExcel`) — sin cambios de estructura, solo de columnas mostradas. Reusar:

```tsx
const registros = await listarReportesIncidencia()
const pendientes = registros.filter(r => r.estadoCompletitud === 'pendiente')
const completas = registros.filter(r => r.estadoCompletitud === 'completa')
```

Columnas de la tabla (resumen, el detalle completo va en el modal): **Fecha Evento, Folio 911, Delito, Detenido** (`—` si el incidente no tuvo detención), **Sector, Acciones** (`DetalleReporteIncidenciaModal` + `CompletarDatosModal`).

`BotonExportarExcel` apunta a `/api/formatos-udai/reportes-incidencias/exportar` (ver generalización con props `href`/`nombreArchivo` ya descrita en la revisión anterior — sigue igual, no cambia).

## 2. `CompletarDatosModal.tsx`

Mismo patrón visual (`createPortal`, overlay) que `DetalleFaltaAdministrativaModal.tsx`, con inputs editables. Llama a `guardarComplementoIncidencia` (`@/lib/formatos-udai/actions`) con `incidenteId: row.id`.

Campos del formulario, agrupados:

**"Hoja Incidencia"**: `rt`, `turno`, `articulosObjetos` (`<textarea>`), `apNuc`, `calleAfec`, `numeroAfec`, `coloniaAfec`, `fueroOverride` (con nota de ayuda: "el FUERO ya se calcula automático a partir del grupo de adscripción; solo llenar si está mal").

**"Hoja Puestas a Disposición" — mostrar solo si el incidente tiene detención** (`row.detenido` no nulo, o mejor: pasar como prop explícita si el repository expone `ofi_hay_detencion`; si no se agregó ese campo al tipo, usar como proxy que `row.agrupamiento`/`row.detenido` ya vengan con algo, o simplemente mostrar la sección siempre pero aclarar en el título "(solo aplica si hubo detención)"): `agrupamiento`, `folioRnd`, `originario`, `nucCu` (con nota: "sugerido desde CURP capturado por Análisis si existe, verificar antes de guardar"), `edad`, `fechaNacimiento`, `sexo`, `calleDet`, `numeroDet`, `coloniaDet`, `marca`, `submarca`, `tipoVehiculo`, `color`, `placas`, `estadoVehiculo`, `niv`, `motor`, `modelo`, `fechaIngreso`/`fechaSalida` (`<input type="datetime-local">`), `otroDelito` (`<textarea>`), `masc`, `umecas` (texto libre).

Botones: **"Guardar progreso"** (`marcarCompleto: false`) y **"Guardar y marcar como completa"** (`marcarCompleto: true`, primario). Mismo comportamiento de `pending`/cierre que se describió en la revisión anterior.

## 3. `DetalleReporteIncidenciaModal.tsx`

Solo lectura, mismo patrón de `Seccion`/`Grid`/`Campo` que `DetalleFaltaAdministrativaModal.tsx`. Secciones: "Identificación y tiempos", "Hecho", "Afectado", "Vehículo", "Detenido" (solo si `row.detenido` u otros campos de esa sección no son todos `null`), "Administrativo (Puesta a Disposición)". Badge de estado (Pendiente/Completa) en el header, junto al `FOLIO 911`.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. `/formatos-udai/reportes-incidencias` carga sin redirect para un usuario con permiso `formatos_udai:ver`.
3. Aparecen exactamente 7 registros repartidos entre "Pendientes"/"Completas" (todos en "Pendientes" al principio, ninguno tiene fila en `formato_incidencia_complemento` todavía).
4. Para el incidente `SSPM/INC/2026/007`, el modal de detalle muestra ya resueltos (sin necesidad de captura manual): folio 911, fecha/hora evento, sector, CRP, delito, coordenadas, y datos de vehículo/detenido extraídos del JSON del reporte de campo.
5. "Completar datos" en ese mismo incidente solo pide los campos que de verdad faltan (RT, TURNO, ARTICULOS U OBJETOS, AP/NUC, etc.) — no todo el formulario en blanco.
6. Guardar marcando como completa mueve el registro a la pestaña "Completas" sin recargar manualmente.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 5.
