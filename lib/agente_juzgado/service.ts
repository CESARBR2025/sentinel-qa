import {
  obtenerRolUsuario,
  obtenerSolicitudesRecepcionadas,
  obtenerSolicitudesEnRevision,
  obtenerSolicitudesCerradas,
  actualizarEstadoSolicitud,
} from './repository'
import { rowToSolicitud } from './mapper'
import type { SolicitudEvidencia } from './types'

export async function verificarRolJuzgado(userId: string): Promise<boolean> {
  const rol = await obtenerRolUsuario(userId)
  return rol === 'agente_juzgado'
}

export async function listarSolicitudesRecepcionadas(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesRecepcionadas()
  return rows.map(rowToSolicitud)
}

export async function listarSolicitudesEnRevision(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesEnRevision()
  return rows.map(rowToSolicitud)
}

export async function listarSolicitudesCerradas(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesCerradas()
  return rows.map(rowToSolicitud)
}

export async function tomarCaso(id: string): Promise<void> {
  await actualizarEstadoSolicitud(id, 'EN_REVISION')
}

export async function cerrarCaso(id: string): Promise<void> {
  await actualizarEstadoSolicitud(id, 'CERRADO')
}
