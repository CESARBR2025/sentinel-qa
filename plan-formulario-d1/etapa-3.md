# Etapa 3 — Ampliar `obtenerReporteCampoParaD1` (query + tipo + mapper)

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

`obtenerReporteCampoParaD1` es la query real de precarga del D1 (no confundir con `obtenerPrellenado`, que es de otro módulo — `/analisis/formulario-ingreso`). Hoy no trae `delito`, `modus_operandi`, `ofi_hay_detencion`, ni datos del reportante, aunque esas columnas ya existen en `ofi_reportes_campo`. Además tiene un bug de alias: selecciona `rc.ofi_calle`/`rc.ofi_colonia` sin alias pero el mapper lee `row.calle`/`row.colonia`, así que esos dos campos siempre llegan `null`.

## Archivos a modificar

- `lib/oficial/repository.ts` — función `obtenerReporteCampoParaD1` (línea ~570)
- `lib/oficial/types.ts` — interfaz `ReporteCampoParaD1` (línea ~212)
- `lib/oficial/mapper.ts` — función `rowToReporteCampoParaD1` (línea ~145)

## Cambios

### 1. `lib/oficial/repository.ts` — ampliar la query

Query actual:
```sql
SELECT
   rc.id,
   rc.folio_reporte_campo,
   rc.ofi_tipo_incidente,
   rc.ofi_descripcion,
   rc.ofi_calle,
   rc.ofi_colonia,
   rc.ofi_latitud AS latitud,
   rc.ofi_longitud AS longitud,
   rc.ofi_autoridad_recibe,
   rc.created_at,
   CONCAT(u.name, ' ', COALESCE(u.apellido, '')) AS oficial_nombre,
   o.no_nomina AS oficial_nomina,
   i.fecha_hora_inicio AS incidente_fecha_hora_inicio,
   desp.fecha_hora_despacho AS despacho_fecha_hora_despacho
FROM ofi_reportes_campo rc
LEFT JOIN ofi_oficiales o ON o.id = rc.ofi_oficial_id
LEFT JOIN users u ON u.id = o.user_id
LEFT JOIN incidentes i ON i.id = rc.incidente_id
LEFT JOIN incidente_despacho desp ON desp.incidente_id = rc.incidente_id
WHERE rc.id = $1
LIMIT 1
```

Reemplazar por (fix de alias `calle`/`colonia` + columnas nuevas):
```sql
SELECT
   rc.id,
   rc.folio_reporte_campo,
   rc.ofi_tipo_incidente,
   rc.ofi_descripcion,
   rc.ofi_calle AS calle,
   rc.ofi_colonia AS colonia,
   rc.ofi_latitud AS latitud,
   rc.ofi_longitud AS longitud,
   rc.ofi_autoridad_recibe,
   rc.created_at,
   rc.delito,
   rc.modus_operandi,
   rc.ofi_hay_detencion,
   rc.ofi_nombre_reportante,
   rc.ofi_telefono_reportante,
   CONCAT(u.name, ' ', COALESCE(u.apellido, '')) AS oficial_nombre,
   o.no_nomina AS oficial_nomina,
   i.fecha_hora_inicio AS incidente_fecha_hora_inicio,
   desp.fecha_hora_despacho AS despacho_fecha_hora_despacho
FROM ofi_reportes_campo rc
LEFT JOIN ofi_oficiales o ON o.id = rc.ofi_oficial_id
LEFT JOIN users u ON u.id = o.user_id
LEFT JOIN incidentes i ON i.id = rc.incidente_id
LEFT JOIN incidente_despacho desp ON desp.incidente_id = rc.incidente_id
WHERE rc.id = $1
LIMIT 1
```

Verificar contra el esquema real los nombres exactos de columna para `delito`, `modus_operandi`, `ofi_hay_detencion`, `ofi_nombre_reportante`, `ofi_telefono_reportante` en `ofi_reportes_campo` antes de dar por buena la query (usar `npm run db:schema` o consultar la BD real, regla del proyecto — no asumir solo por el nombre en `lib/oficial/types.ts`, que usa camelCase).

### 2. `lib/oficial/types.ts` — ampliar `ReporteCampoParaD1`

Agregar los campos nuevos a la interfaz (línea ~212):
```ts
export interface ReporteCampoParaD1 {
  id: string
  folioReporteCampo: string | null
  tipoIncidente: string | null
  descripcion: string | null
  calle: string | null
  colonia: string | null
  latitud: number | null
  longitud: number | null
  autoridadRecibe: string | null
  oficialNombre: string | null
  oficialNomina: string | null
  fechaHoraInicioIncidente: string | null
  fechaHoraDespacho: string | null
  created_at: string | null
  delito: string | null
  modusOperandi: string | null
  hayDetencion: boolean
  nombreReportante: string | null
  telefonoReportante: string | null
}
```

### 3. `lib/oficial/mapper.ts` — ampliar `rowToReporteCampoParaD1`

```ts
export function rowToReporteCampoParaD1(row: Record<string, unknown>): ReporteCampoParaD1 {
  return {
    id: String(row.id ?? ''),
    folioReporteCampo: (row.folio_reporte_campo as string) ?? null,
    tipoIncidente: (row.ofi_tipo_incidente as string) ?? null,
    descripcion: (row.ofi_descripcion as string) ?? null,
    calle: (row.calle as string) ?? null,
    colonia: (row.colonia as string) ?? null,
    latitud: row.latitud ? Number(row.latitud) : null,
    longitud: row.longitud ? Number(row.longitud) : null,
    autoridadRecibe: (row.ofi_autoridad_recibe as string) ?? null,
    oficialNombre: (row.oficial_nombre as string) ?? null,
    oficialNomina: (row.oficial_nomina as string) ?? null,
    fechaHoraInicioIncidente: toStr(row.incidente_fecha_hora_inicio),
    fechaHoraDespacho: toStr(row.despacho_fecha_hora_despacho),
    created_at: toStr(row.created_at),
    delito: (row.delito as string) ?? null,
    modusOperandi: (row.modus_operandi as string) ?? null,
    hayDetencion: Boolean(row.ofi_hay_detencion),
    nombreReportante: (row.ofi_nombre_reportante as string) ?? null,
    telefonoReportante: (row.ofi_telefono_reportante as string) ?? null,
  }
}
```

(El fix del alias `calle`/`colonia` ya queda resuelto por el punto 1 — el mapper no necesita cambiar esos dos campos, solo agregar los nuevos.)

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Confirmar contra la BD real (no solo el tipo) que las columnas `delito`, `modus_operandi`, `ofi_hay_detencion`, `ofi_nombre_reportante`, `ofi_telefono_reportante` existen en `ofi_reportes_campo` con esos nombres exactos — si algún nombre no coincide, ajustar la query al nombre real.
3. Probar `obtenerReporteCampoParaD1` con un `reporteCampoId` real que tenga `ofi_calle`/`ofi_colonia` llenos y confirmar que ahora `calle`/`colonia` en el resultado ya NO son `null` (antes del fix, siempre lo eran).
4. No modificar ningún otro archivo (la propagación al `prefill` de la página es la etapa 5).

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-4.md`.**
