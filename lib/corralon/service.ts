import { obtenerSolicitudesPendientes, obtenerSolicitudesFinalizadas } from './repository'
import { rowToSolicitud } from './mapper'
import type { SolicitudRow } from './types'

export async function listarSolicitudesPendientes(): Promise<SolicitudRow[]> {
  const result = await obtenerSolicitudesPendientes()
  return result.rows.map(rowToSolicitud)
}

export async function listarSolicitudesFinalizadas(): Promise<SolicitudRow[]> {
  const result = await obtenerSolicitudesFinalizadas()
  return result.rows.map(rowToSolicitud)
}
