import { query } from '@/lib/db'
import type { RolRow } from './types'

export async function obtenerRolUsuario(userId: string): Promise<string> {
  const result = await query<RolRow>(
    `SELECT r.nombre AS rol
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [userId],
  )
  return result.rows[0]?.rol ?? ''
}

export async function obtenerSolicitudesRecepcionadas() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rd.estado_tramite = 'EN_ANALISIS'
       AND rd.estado_evidencia = 'EVIDENCIA_ENVIADA'
     ORDER BY rd.updated_at DESC`,
  )
  return result.rows
}

export async function obtenerSolicitudesEnRevision() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rd.estado_tramite = 'EN_REVISION_JUZGADO'
       AND rd.estado_evidencia = 'SIN_SOLICITUD'
     ORDER BY rd.updated_at DESC`,
  )
  return result.rows
}

export async function obtenerSolicitudesConMonitorista() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rd.estado_tramite = 'EN_REVISION_JUZGADO'
       AND rd.estado_evidencia = 'PENDIENTE_MONITORISTA'
     ORDER BY rd.updated_at DESC`,
  )
  return result.rows
}

export async function obtenerSolicitudesCompletadas() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rd.estado_tramite = 'EN_REVISION_JUZGADO'
       AND rd.estado_evidencia = 'EVIDENCIA_ENVIADA'
     ORDER BY rd.updated_at DESC`,
  )
  return result.rows
}

export async function obtenerSolicitudesCerradas() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rd.estado_tramite = 'CERRADO'
     ORDER BY rd.updated_at DESC`,
  )
  return result.rows
}

export async function actualizarEstadoSolicitud(
  id: string,
  estadoTramite: string,
  estadoEvidencia?: string,
) {
  if (estadoEvidencia) {
    await query(
      `UPDATE ofi_reporte_denuncia
       SET estado_tramite = $1, estado_evidencia = $2, updated_at = NOW()
       WHERE id = $3`,
      [estadoTramite, estadoEvidencia, id],
    )
  } else {
    await query(
      `UPDATE ofi_reporte_denuncia
       SET estado_tramite = $1, updated_at = NOW()
       WHERE id = $2`,
      [estadoTramite, id],
    )
  }
}

export async function actualizarSolicitudConEvidencias(
  id: string,
  estadoTramite: string,
  estadoEvidencia: string,
  evidenciasJson: string,
) {
  await query(
    `UPDATE ofi_reporte_denuncia
     SET estado_tramite = $1, estado_evidencia = $2,
         monitorista_fechas_requeridas = $3::jsonb, updated_at = NOW()
     WHERE id = $4`,
    [estadoTramite, estadoEvidencia, evidenciasJson, id],
  )
}
