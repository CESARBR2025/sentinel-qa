import { query } from '@/lib/db'

export async function obtenerReportesSinNovedad(desde?: string, hasta?: string, busqueda?: string) {
  const d = desde ?? '2000-01-01'
  const h = hasta  ?? new Date().toISOString().split('T')[0]

  const result = await query<Record<string, unknown>>(`
    SELECT
      folio_reporte_campo        AS reporte,
      ofi_nombre_reportante      AS nombre_reportante,
      ofi_telefono_reportante    AS telefono_reportante,
      ofi_observaciones          AS conclusion,
      created_at::date           AS fecha
    FROM ofi_reportes_campo
    WHERE ofi_hay_robo = false
      AND created_at::date BETWEEN $1 AND $2
      ${busqueda ? `AND (
        ofi_nombre_reportante ILIKE $3
        OR folio_reporte_campo ILIKE $3
        OR ofi_observaciones   ILIKE $3
      )` : ''}
    ORDER BY created_at DESC
  `, busqueda ? [d, h, `%${busqueda}%`] : [d, h])

  return result.rows
}