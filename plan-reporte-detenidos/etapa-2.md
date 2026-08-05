# Etapa 2 — Módulo de datos de solo lectura: `lib/reporte-detenidos/`

## Contexto (resumen — ver `00-contexto.md`)

Requiere la Etapa 1 ya construida (sección de permiso `reporte_detenidos` existente). Esta etapa crea la capa de datos: un tipo `DetenidoCompleto` y un repository con una sola función de lectura, `listarDetenidosCompletos()`, que trae **solo** los reportes de campo con detenidos cuyas 3 fotos (frontal/derecho/izquierdo) ya están en estado `completado`.

## Objetivo

Dejar disponible `listarDetenidosCompletos(): Promise<DetenidoCompleto[]>` para que la Etapa 3 (PPT) y la Etapa 5 (página) lo consuman.

## Archivos a crear

### 1. `lib/reporte-detenidos/types.ts`

```ts
export interface DetenidoCompleto {
  id: string
  folio: string
  nombre: string
  evento: string
  delito: string
  faltaAdministrativa: string
  modusOperandi: string
  createdAt: string
}
```

### 2. `lib/reporte-detenidos/repository.ts`

Reutiliza el helper `query` de `@/lib/db` (mismo que usa `lib/monitorista/repository.ts` y `lib/monitorista/ppt-service.ts`). La condición de "3 fotos completadas" se expresa con un subquery `COUNT(*) = 3` sobre `solicitud_fotos`, en vez del `EXISTS` que usa el query original de Monitorista (ese solo pedía que existiera AL MENOS una fila completada; aquí se exige que las 3 lo estén):

```ts
import { query } from '@/lib/db'
import type { DetenidoCompleto } from './types'

function parseNombreDetenido(raw: unknown): string {
  // Misma lógica que lib/monitorista/mapper.ts / ppt-service.ts — se duplica
  // intencionalmente para no acoplar este módulo de solo lectura a Monitorista
  // (el proyecto ya tiene esta función duplicada 3 veces con el mismo criterio).
  if (typeof raw === 'string') {
    try { const arr = JSON.parse(raw); return Array.isArray(arr) && arr.length > 0 ? (arr[0].nombre || 'Sin nombre') : 'Sin nombre' }
    catch { return String(raw || 'Sin nombre') }
  }
  if (Array.isArray(raw) && raw.length > 0) return raw[0].nombre || 'Sin nombre'
  return 'Sin nombre'
}

export async function listarDetenidosCompletos(): Promise<DetenidoCompleto[]> {
  const res = await query<Record<string, unknown>>(
    `SELECT rc.id, rc.folio_reporte_campo, rc.ofi_tipo_incidente, rc.ofi_detenidos,
            rc.delito, rc.marco_legal, rc.falta_administrativa, rc.modus_operandi,
            rc.created_at,
            ord.delito as delito_denuncia, ord.marco_legal as marco_legal_denuncia
     FROM ofi_reportes_campo rc
     LEFT JOIN ofi_reporte_denuncia ord ON ord.reporte_campo_id = rc.id
     WHERE rc.ofi_detenidos IS NOT NULL
       AND rc.ofi_detenidos::text NOT IN ('[]', '1')
       AND (
         SELECT COUNT(*) FROM solicitud_fotos sf
         WHERE sf.reporte_campo_id = rc.id AND sf.estado = 'completado'
       ) = 3
     ORDER BY rc.created_at DESC`,
    [],
  )

  return res.rows.map((row): DetenidoCompleto => ({
    id: String(row.id),
    folio: String(row.folio_reporte_campo || ''),
    nombre: parseNombreDetenido(row.ofi_detenidos),
    evento: String(row.ofi_tipo_incidente || '—'),
    delito: String(row.delito || row.delito_denuncia || '—'),
    faltaAdministrativa: String(row.falta_administrativa || row.marco_legal || row.marco_legal_denuncia || '—'),
    modusOperandi: String(row.modus_operandi || '—'),
    createdAt: new Date(row.created_at as string).toISOString(),
  }))
}
```

## Qué NO tocar en esta etapa

- No crear `ppt-service.ts` todavía (Etapa 3).
- No modificar `lib/monitorista/repository.ts` ni ningún archivo de Monitorista.
- No crear página ni API todavía.

## Criterios de aceptación

1. `npx tsc --noEmit` pasa sin errores nuevos.
2. Se puede importar `listarDetenidosCompletos` desde un script/test puntual y confirmar que solo devuelve reportes con exactamente 3 `solicitud_fotos` en estado `completado` (comparar contra una consulta manual a la BD real, no asumir).
3. Los reportes que hoy se ven "Completados" en `/monitorista/detenidos` (los que tienen `fotos.length > 0 && fotos.every(f => f.estado === 'completado')`) deben coincidir con lo que devuelve `listarDetenidosCompletos()` — mismo criterio de negocio, expresado como query en vez de filtro en memoria.
