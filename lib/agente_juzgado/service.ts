import {
  obtenerRolUsuario,
  obtenerSolicitudesRecepcionadas,
  obtenerSolicitudesEnRevision,
  obtenerSolicitudesConMonitorista,
  obtenerSolicitudesCompletadas,
  obtenerSolicitudesCerradas,
  actualizarEstadoSolicitud,
  actualizarSolicitudConEvidencias,
  obtenerDetalleAsegurado,
  actualizarDetallesAsegurado,
} from './repository'
import { rowToSolicitud } from './mapper'
import type { SolicitudEvidencia, DetalleAsegurado, DatosAseguradoInput } from './types'

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

export async function listarSolicitudesConMonitorista(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesConMonitorista()
  return rows.map(rowToSolicitud)
}

export async function listarSolicitudesCompletadas(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesCompletadas()
  return rows.map(rowToSolicitud)
}

export async function listarSolicitudesCerradas(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesCerradas()
  return rows.map(rowToSolicitud)
}

export async function tomarCaso(id: string): Promise<void> {
  await actualizarEstadoSolicitud(id, 'EN_REVISION_JUZGADO', 'SIN_SOLICITUD')
}

export async function pedirEvidencias(id: string, evidencias: string): Promise<void> {
  await actualizarSolicitudConEvidencias(id, 'EN_REVISION_JUZGADO', 'PENDIENTE_MONITORISTA', evidencias)
}

export async function cerrarCaso(id: string): Promise<void> {
  await actualizarEstadoSolicitud(id, 'CERRADO')
}

export async function obtenerDatosAsegurado(solicitudId: string): Promise<DetalleAsegurado | null> {
  return obtenerDetalleAsegurado(solicitudId)
}

export async function guardarDetallesAsegurado(id: string, datos: DatosAseguradoInput, evidenciasJson?: string | null): Promise<void> {
  await actualizarDetallesAsegurado(id, datos, evidenciasJson)
}
