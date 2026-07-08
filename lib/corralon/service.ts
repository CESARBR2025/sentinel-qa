import { obtenerSolicitudesPendientes, obtenerSolicitudesFinalizadas } from './repository'
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
    urlOrdenSalida: str(row.url_orden_salida_liberaciones),
    urlOficioPagoCorralon: str(row.url_oficio_pago_corralon),
    nombreTitular: str(row.nombre_titular_liberacion),
    apellidoPaternoTitular: str(row.appaterno_titular_liberacion),
    apellidoMaternoTitular: str(row.apmaterno_titular_liberacion),
    correoTitular: str(row.correo_titular_liberacion),
  }
}

export async function listarSolicitudesPendientes(): Promise<SolicitudRow[]> {
  const result = await obtenerSolicitudesPendientes()
  return result.rows.map(rowToSolicitud)
}

export async function listarSolicitudesFinalizadas(): Promise<SolicitudRow[]> {
  const result = await obtenerSolicitudesFinalizadas()
  return result.rows.map(rowToSolicitud)
}
