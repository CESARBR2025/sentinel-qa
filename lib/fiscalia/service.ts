import {
  obtenerRolUsuario,
  obtenerSolicitudesPendientes,
  obtenerSolicitudesEnProceso,
  obtenerSolicitudesConMonitorista,
  obtenerSolicitudesCompletadas,
  actualizarEstadoSolicitud,
  actualizarSolicitudConEvidencias,
} from './repository'
import { rowToSolicitud } from './mapper'
import type { SolicitudEvidencia } from './types'

export async function verificarRolFiscalia(userId: string): Promise<boolean> {
  const rol = await obtenerRolUsuario(userId)
  return rol === 'agente_fiscalia'
}

export async function listarSolicitudesPendientes(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesPendientes()
  return rows.map(rowToSolicitud)
}

export async function listarSolicitudesEnProceso(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesEnProceso()
  return rows.map(rowToSolicitud)
}

export async function tomarCaso(id: string): Promise<void> {
  await actualizarEstadoSolicitud(id, 'EN_ANALISIS', 'SIN_SOLICITUD')
}

export async function listarSolicitudesConMonitorista(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesConMonitorista()
  return rows.map(rowToSolicitud)
}

export async function listarSolicitudesCompletadas(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesCompletadas()
  return rows.map(rowToSolicitud)
}

export async function pedirEvidencias(id: string, evidencias: string): Promise<void> {
  await actualizarSolicitudConEvidencias(id, 'EN_ANALISIS', 'PENDIENTE_MONITORISTA', evidencias)
}
