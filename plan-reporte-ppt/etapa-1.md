# Etapa 1 — Cambiar la fuente de verdad de "3 fotos completas" y la tabla base a D1

Leer primero `00-contexto.md` en esta misma carpeta.

## Objetivo

`listarDetenidosCompletos()` debe dejar de depender de `solicitud_fotos` (flujo Monitorista, descartado) y pasar a:
1. Partir de `ofi_reporte_denuncia` (D1) en vez de `ofi_reportes_campo` directo — solo detenidos con denuncia D1 levantada.
2. Considerar "3 fotos completas" cuando existan en `evidencias_detenido` los 3 `tipo_foto` (`frontal`, `derecho`, `izquierdo`) con `tipo_contenido = 'detenido'` y `detenido_index = 0`.

## Archivos a tocar

- `lib/reporte-detenidos/types.ts`
- `lib/reporte-detenidos/repository.ts`

## Cambios

### `types.ts`

Agregar a `DetenidoCompleto` los campos de identificación D1 (se van a mostrar en la tabla en la Etapa 3):

```ts
export interface DetenidoCompleto {
  id: string
  folio: string             // se mantiene: folio_reporte_campo (identificador operativo interno)
  folioDenuncia: string      // NUEVO: ofi_reporte_denuncia.folio_denuncia (ej. SSPM/D1/20260805/AIO0V2)
  iph: string | null         // NUEVO: ofi_reporte_denuncia.iph
  nombre: string
  evento: string
  delito: string
  faltaAdministrativa: string
  modusOperandi: string
  createdAt: string
}
```

### `repository.ts`

Reemplazar el query de `listarDetenidosCompletos()` completo:

```ts
export async function listarDetenidosCompletos(): Promise<DetenidoCompleto[]> {
  const res = await query<Record<string, unknown>>(
    `SELECT rc.id, rc.folio_reporte_campo, rc.ofi_tipo_incidente, rc.ofi_detenidos,
            rc.delito, rc.marco_legal, rc.falta_administrativa, rc.modus_operandi,
            rc.created_at,
            d.folio_denuncia, d.iph,
            d.delito as delito_denuncia, d.marco_legal as marco_legal_denuncia
     FROM ofi_reporte_denuncia d
     INNER JOIN ofi_reportes_campo rc ON rc.id = d.reporte_campo_id
     WHERE rc.ofi_detenidos IS NOT NULL
       AND rc.ofi_detenidos::text NOT IN ('[]', '1')
       AND (
         SELECT COUNT(DISTINCT ed.tipo_foto) FROM evidencias_detenido ed
         WHERE ed.reporte_campo_id = rc.id
           AND ed.tipo_contenido = 'detenido'
           AND ed.detenido_index = 0
           AND ed.tipo_foto IN ('frontal', 'derecho', 'izquierdo')
       ) = 3
     ORDER BY rc.created_at DESC`,
    [],
  )

  return res.rows.map((row): DetenidoCompleto => ({
    id: String(row.id),
    folio: String(row.folio_reporte_campo || ''),
    folioDenuncia: String(row.folio_denuncia || ''),
    iph: row.iph ? String(row.iph) : null,
    nombre: parseNombreDetenido(row.ofi_detenidos),
    evento: String(row.ofi_tipo_incidente || '—'),
    delito: String(row.delito || row.delito_denuncia || '—'),
    faltaAdministrativa: String(row.falta_administrativa || row.marco_legal || row.marco_legal_denuncia || '—'),
    modusOperandi: String(row.modus_operandi || '—'),
    createdAt: new Date(row.created_at as string).toISOString(),
  }))
}
```

Notas sobre el query, no te las saltes:

- `COUNT(DISTINCT ed.tipo_foto)`, **no** `COUNT(*)`: `insertarFotoFiscalia()` no hace upsert, cada "Reemplazar" en `FotosExpedienteSection.tsx` inserta una fila nueva sin borrar la anterior. Puede haber más de una fila por `tipo_foto`. Contar `DISTINCT` evita falsos positivos/negativos por duplicados.
- `INNER JOIN` (no `LEFT JOIN`) entre `ofi_reporte_denuncia` y `ofi_reportes_campo`: si `reporte_campo_id` es NULL en la denuncia, no puede tener detenidos ni fotos — se excluye naturalmente, correcto.
- Si `ofi_reporte_denuncia` tiene más de un registro apuntando al mismo `reporte_campo_id` (no debería pasar en el flujo normal, pero no hay constraint UNIQUE que lo impida), el resultado tendría filas duplicadas del mismo detenido. No agregues `DISTINCT ON` ni dedup todavía — si al correr el query de verificación (abajo) aparecen duplicados reales, repórtalo y detente antes de continuar a la Etapa 2.
- No toques `parseNombreDetenido()` — sigue igual.

## Verificación

1. `npx tsc --noEmit`.
2. Correr un script puntual (bórralo al terminar, no lo dejes commiteado) que ejecute el nuevo query contra la BD real (usar `DATABASE_URL` de `.env`) y confirmar que la denuncia `SSPM/D1/20260805/AIO0V2` (`reporte_campo_id = 83f0915a-e83b-4e38-9295-02e04c0de34e`) aparece en el resultado.
3. Confirmar que el conteo total de filas devueltas es razonable (no 0, no todas las filas de `ofi_reporte_denuncia`).

## Criterios de aceptación

- `listarDetenidosCompletos()` ya no referencia `solicitud_fotos` en ningún lado.
- La denuncia de prueba del contexto aparece en el resultado del query.
- `npx tsc --noEmit` limpio.
- **Detente aquí y espera confirmación del usuario antes de pasar a la Etapa 2.**
