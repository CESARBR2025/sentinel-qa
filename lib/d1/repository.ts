import { query } from '@/lib/db'
import type { ReporteD1 } from './types'
import { rowToReporteD1 } from './mapper'

export async function verificarFolioDenunciaUnico(folio: string): Promise<boolean> {
  const result = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM ofi_reporte_denuncia WHERE folio_denuncia = $1`,
    [folio],
  )
  return Number(result.rows[0]?.count ?? 1) === 0
}

export async function insertarReporteDenuncia(params: Record<string, unknown>): Promise<string> {
  const result = await query<{ id: string }>(
    `INSERT INTO ofi_reporte_denuncia (
      folio_denuncia, iph, folio_cu, corporacion, sector, grupo_adscripcion,
      fecha_reporte, hora_reporte,
      fecha_avistamiento, hora_avistamiento,
      fecha_despacho, hora_despacho,
      fecha_confirmacion, hora_confirmacion,
      fecha_llegada, hora_llegada,
      hora_inicio_denuncia, hora_fin_denuncia,
      hora_termino_atencion, hora_cuestionario,
      lugar_hecho, lugar_apoyo,
      colonia_hecho, colonia_apoyo,
      municipio,
      latitud, longitud,
      tipo_evento, delito, violencia, crp,
      requirio_tablet, funcionaba_tablet,
      ofendido_hombre, ofendido_mujer, num_cuestionarios,
      intervino_gs, se_genero_d1, se_va_a_generar_d1,
      observaciones, capturado_por, incidente_id, reporte_campo_id,
      oficial_id, estado_tramite, estado_evidencia
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7::date, $8::time,
      $9::date, $10::time,
      $11::date, $12::time,
      $13::date, $14::time,
      $15::date, $16::time,
      $17::time, $18::time,
      $19::time, $20::time,
      $21, $22,
      $23, $24,
      $25,
      $26, $27,
      $28, $29, $30, $31,
      $32, $33,
      $34, $35, $36,
      $37, $38, $39,
      $40, $41, $42::uuid, $43::uuid,
      $44::uuid,
      'EN_REVISION_JUZGADO',
      'SIN_SOLICITUD'
    )
    RETURNING id`,
    [
      params.folioDenuncia, params.iph, params.folioCu,
      params.corporacion, params.sector, params.grupoAdscripcion,
      params.fechaReporte, params.horaReporte,
      params.fechaAvistamiento, params.horaAvistamiento,
      params.fechaDespacho, params.horaDespacho,
      params.fechaConfirmacion, params.horaConfirmacion,
      params.fechaLlegada, params.horaLlegada,
      params.horaInicioDenuncia, params.horaFinDenuncia,
      params.horaTerminoAtencion, params.horaCuestionario,
      params.lugarHecho, params.lugarApoyo,
      params.coloniaHecho, params.coloniaApoyo,
      params.municipio,
      params.latitudHecho, params.longitudHecho,
      params.tipoEvento, params.delito, params.violencia, params.crp,
      params.requirioTablet, params.funcionabaTablet,
      params.ofendidoHombre, params.ofendidoMujer, params.numCuestionarios,
      params.intervinoGs, params.seGeneroD1, params.seVaAGenerarD1,
      params.observaciones, params.capturadoPor,
      params.incidenteId, params.reporteCampoId,
      params.oficialId,
    ],
  )
  return result.rows[0].id
}

export async function obtenerReportesD1(desde?: string, hasta?: string, folio?: string): Promise<ReporteD1[]> {
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
      CONCAT(u.name, ' ', u.apellido) AS ofi_oficial_nombre,
      r.ofi_folio_cad
    FROM ofi_reporte_denuncia d
    LEFT JOIN ofi_reportes_campo r ON r.id = d.reporte_campo_id
    LEFT JOIN ofi_oficiales o ON o.id = r.ofi_oficial_id
    LEFT JOIN users u ON u.id = o.user_id
        WHERE d.fecha_reporte BETWEEN $1 AND $2
        ${folio ? `AND (d.folio_denuncia ILIKE $3 OR d.iph ILIKE $3)` : ''}
        ORDER BY d.fecha_reporte DESC, d.hora_reporte DESC
    `, folio ? [d, h, `%${folio}%`] : [d, h])

    return result.rows.map(rowToReporteD1)
}
