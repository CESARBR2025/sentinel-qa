import { query } from '@/lib/db'

export async function obtenerSinD1(desde?: string, hasta?: string, nombre?: string) {
  const d = desde ?? '2000-01-01'
  const h = hasta  ?? new Date().toISOString().split('T')[0]

  const result = await query<Record<string, unknown>>(`
    SELECT
      COALESCE(r.folio_reporte_campo, r.ofi_folio_cad, 'S/C') AS folio,
      r.created_at::date           AS fecha,
      r.ofi_nombre_reportante      AS nombre_afectado,
      r.ofi_telefono_reportante    AS telefono
    FROM ofi_reportes_campo r
    WHERE r.quiere_denuncia = true
      AND NOT EXISTS (
        SELECT 1 FROM ofi_reporte_denuncia d WHERE d.reporte_campo_id = r.id
      )
      AND r.created_at::date BETWEEN $1 AND $2
      ${nombre ? `AND r.ofi_nombre_reportante ILIKE $3` : ''}
    ORDER BY r.created_at DESC
  `, nombre ? [d, h, `%${nombre}%`] : [d, h])

  return result.rows
}