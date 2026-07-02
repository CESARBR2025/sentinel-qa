import { query } from '@/lib/db'

export async function obtenerReportesD1(desde?: string, hasta?: string, folio?: string) {
  const d = desde ?? '2000-01-01'
  const h = hasta  ?? new Date().toISOString().split('T')[0]
  
  const result = await query<Record<string, unknown>>(`
    SELECT
      d.id,
      d.folio_denuncia,
      d.iph,
      d.folio_cu,
      d.folio_sija,
      d.delito,
      d.tipo_evento,
      d.violencia,
      d.fecha_reporte,
      d.hora_reporte,
      d.lugar_hecho,
      d.colonia_hecho,
      d.municipio,
      d.policia_a_cargo,
      d.crp,
      d.nomina_mando,
      d.se_genero_d1,
      d.estado_tramite,
      d.estado_evidencia,
      d.ofendido_hombre,
      d.ofendido_mujer,
      r.ofi_tipo_incidente,
      r.ofi_oficial_nombre,
      r.ofi_folio_cad
    FROM ofi_reporte_denuncia d
    LEFT JOIN ofi_reportes_campo r ON r.id = d.reporte_campo_id
        WHERE d.fecha_reporte BETWEEN $1 AND $2
        ${folio ? `AND (d.folio_denuncia ILIKE $3 OR d.iph ILIKE $3)` : ''}
        ORDER BY d.fecha_reporte DESC, d.hora_reporte DESC
    `, folio ? [d, h, `%${folio}%`] : [d, h])

    return result.rows
}