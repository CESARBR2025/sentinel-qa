# Etapa 4 — Precarga de detenido(s) desde `ofi_detalles_asegurados`

Leer primero `00-contexto.md` de esta misma carpeta.

## Objetivo

`ofi_detalles_asegurados` ya guarda nombre completo de cada detenido del reporte de campo (se llena automáticamente al crear el reporte, ver `insertarDetallesAsegurados` en `lib/oficial/repository.ts`). Hoy el D1 no los muestra en ningún lado. Se agrega una consulta nueva (puede haber más de un detenido por reporte, por eso va separada de `obtenerReporteCampoParaD1`, que es `LIMIT 1`).

## Archivos a modificar

- `lib/oficial/repository.ts` — nueva función
- `lib/oficial/types.ts` — nuevo tipo
- `lib/oficial/service.ts` — nuevo wrapper de servicio (mismo patrón que `obtenerDatosParaD1`, línea ~221)

## Cambios

### 1. `lib/oficial/types.ts` — nuevo tipo

```ts
export interface DetenidoReporteCampo {
  nombre: string | null
  apellidoPaterno: string | null
  apellidoMaterno: string | null
}
```

### 2. `lib/oficial/repository.ts` — nueva función

Buscar `insertarDetallesAsegurados` en este mismo archivo para confirmar los nombres exactos de columna de `ofi_detalles_asegurados` (`nombre_detenido`, `ap_paterno_detenido`, `ap_materno_detenido`, `reporte_campo_id`) y mantener consistencia:

```ts
export async function obtenerDetenidosPorReporteCampo(reporteCampoId: string): Promise<DetenidoReporteCampo[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT nombre_detenido, ap_paterno_detenido, ap_materno_detenido
     FROM ofi_detalles_asegurados
     WHERE reporte_campo_id = $1
     ORDER BY id`,
    [reporteCampoId],
  )
  return result.rows.map(row => ({
    nombre: (row.nombre_detenido as string) ?? null,
    apellidoPaterno: (row.ap_paterno_detenido as string) ?? null,
    apellidoMaterno: (row.ap_materno_detenido as string) ?? null,
  }))
}
```

Importar `DetenidoReporteCampo` desde `./types` igual que el resto de tipos ya importados en este archivo.

### 3. `lib/oficial/service.ts` — wrapper

Mismo patrón que `obtenerDatosParaD1` (línea ~221):
```ts
export async function obtenerDetenidosParaD1(reporteCampoId: string): Promise<DetenidoReporteCampo[]> {
  return obtenerDetenidosPorReporteCampo(reporteCampoId)
}
```

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Probar `obtenerDetenidosParaD1` con un `reporteCampoId` real que tenga detenidos registrados y confirmar que devuelve un array con los nombres completos (no un objeto único, no `null`).
3. Probar con un `reporteCampoId` sin detenidos y confirmar que devuelve un array vacío, no un error.
4. No modificar `app/denuncia/nuevo/page.tsx` ni `FormularioD1.tsx` todavía (eso es etapa 5 y 6).

**Detenerse aquí y esperar confirmación del usuario antes de pasar a `etapa-5.md`.**
