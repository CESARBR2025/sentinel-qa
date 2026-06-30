import { query } from '@/lib/db'
import { rowToParReporte, rowToCuestionarioRobo, rowToChecklist } from './mapper'
import type { AuxParReporte, AuxCuestionarioRobo, AuxChecklist, UpsertChecklistInput } from './types'

export async function obtenerParesReporte(): Promise<AuxParReporte[]> {
  const result = await query<Record<string, unknown>>(`
    SELECT
      r.id                  AS reporte_campo_id,
      r.ofi_folio_cad       AS folio_cad,
      r.ofi_tipo_incidente  AS tipo_incidente,
      r.ofi_oficial_nombre  AS oficial_nombre,
      r.ofi_hay_detencion,
      r.ofi_autoridad_recibe,
      r.created_at          AS fecha_reporte,
      d.id                  AS reporte_d1_id,
      d.folio_denuncia      AS folio_denuncia,
      d.delito,
      -- Checklist si existe
      cl.id                       AS checklist_id,
      cl.denuncia_cu_d1,
      cl.denuncia_cu_d1_duracion,
      cl.detenido_fge,
      cl.detenido_fgr,
      cl.detenido_jc,
      cl.convenios,
      cl.trabajos_comunidad,
      cl.coincide_gps,
      cl.visualizo_camara,
      cl.ti_pi,
      cl.observaciones,
      cl.capturado_por,
      cl.created_at         AS cl_created_at,
      cl.updated_at         AS cl_updated_at
    FROM ofi_reportes_campo r
    INNER JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = r.id
    LEFT JOIN auxiliar_checklist cl
      ON cl.reporte_campo_id = r.id
      AND cl.reporte_d1_id   = d.id
    ORDER BY r.created_at DESC
    LIMIT 100
  `, [])
  return result.rows.map(rowToParReporte)
}

export async function obtenerCuestionariosRobo(): Promise<AuxCuestionarioRobo[]> {
  const result = await query<Record<string, unknown>>(`
    SELECT
      r.id                  AS reporte_campo_id,
      r.ofi_folio_cad       AS folio_cad,
      r.created_at          AS fecha,
      r.ofi_oficial_nombre  AS nombre_policia,
      d.folio_denuncia,
      d.delito,
      d.nomina_mando        AS nomina_policia,
      d.crp                 AS registro_tableta,
      d.sector,
      d.policia_ingresa_cu  AS nombre_ingreso
    FROM ofi_reportes_campo r
    INNER JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = r.id
    WHERE
      LOWER(r.ofi_tipo_incidente) LIKE '%robo%'
      OR LOWER(d.delito)          LIKE '%robo%'
    ORDER BY r.created_at DESC
  `, [])
  return result.rows.map(rowToCuestionarioRobo)
}

export async function upsertChecklist(data: UpsertChecklistInput): Promise<AuxChecklist> {
  const result = await query<Record<string, unknown>>(`
    INSERT INTO auxiliar_checklist (
      reporte_campo_id, reporte_d1_id,
      denuncia_cu_d1, denuncia_cu_d1_duracion,
      detenido_fge, detenido_fgr, detenido_jc,
      convenios, trabajos_comunidad,
      coincide_gps, visualizo_camara, ti_pi,
      observaciones, capturado_por
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
    ON CONFLICT (reporte_campo_id, reporte_d1_id)
    DO UPDATE SET
      denuncia_cu_d1         = EXCLUDED.denuncia_cu_d1,
      denuncia_cu_d1_duracion = EXCLUDED.denuncia_cu_d1_duracion,
      detenido_fge           = EXCLUDED.detenido_fge,
      detenido_fgr           = EXCLUDED.detenido_fgr,
      detenido_jc            = EXCLUDED.detenido_jc,
      convenios              = EXCLUDED.convenios,
      trabajos_comunidad     = EXCLUDED.trabajos_comunidad,
      coincide_gps           = EXCLUDED.coincide_gps,
      visualizo_camara       = EXCLUDED.visualizo_camara,
      ti_pi                  = EXCLUDED.ti_pi,
      observaciones          = EXCLUDED.observaciones,
      capturado_por          = EXCLUDED.capturado_por,
      updated_at             = now()
    RETURNING *
  `, [
    data.reporteCampoId, data.reporteD1Id,
    data.denunciaCuD1, data.denunciaCuD1Duracion,
    data.detenidoFge, data.detenidoFgr, data.detenidoJc,
    data.convenios, data.trabajosComunidad,
    data.coincideGps, data.visualizoCamara, data.tiPi,
    data.observaciones, data.capturadoPor,
  ])
  return rowToChecklist(result.rows[0])
}