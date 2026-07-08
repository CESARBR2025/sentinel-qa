import { obtenerSolicitudesPendientes } from './repository'
import type { SolicitudRow } from './types'

function str(val: unknown): string | null {
  if (val === null || val === undefined) return null
  return String(val)
}

function rowToSolicitud(row: Record<string, unknown>): SolicitudRow {
  return {
    id: str(row.id) ?? '',
    folio: str(row.folio) ?? '',
    placa: str(row.placa) ?? '',
    estatusDependencia: str(row.estatus_dependencia) ?? '',
    motivoRetencion: str(row.motivo_retencion),
    createdAt: str(row.created_at) ?? '',
    nombreInfractor: str(row.nombre_infractor),
    correoInfractor: str(row.correo_infractor),
  }
}

export async function listarSolicitudesPendientes(): Promise<SolicitudRow[]> {
  const result = await obtenerSolicitudesPendientes()
  return result.rows.map(rowToSolicitud)
}
