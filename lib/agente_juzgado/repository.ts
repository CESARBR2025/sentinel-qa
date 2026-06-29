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
     WHERE rd.estado_tramite = 'EN_REVISION'
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
) {
  await query(
    `UPDATE ofi_reporte_denuncia
     SET estado_tramite = $1, updated_at = NOW()
     WHERE id = $2`,
    [estadoTramite, id],
  )
}
