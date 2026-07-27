import { getToken, subir, estaConfigurado, limpiarCacheToken } from './v2/client'
import { serializarRef } from './v2/ref'
import type { RefExpediente } from './v2/ref'

function fecha() {
  const now = new Date()
  const YYYY = now.getFullYear().toString()
  const MM = String(now.getMonth() + 1).padStart(2, '0')
  return { YYYY, MM }
}

export async function obtenerGuestToken(_nombre: string): Promise<string> {
  return getToken()
}

export async function subirArchivoExpediente(
  _token: string,
  archivo: { buffer: Buffer; nombre: string; tipo: string },
  folio: string,
  tipoDoc: string,
): Promise<string> {
  const { YYYY, MM } = fecha()
  const subcarpeta = `${tipoDoc}/${YYYY}/${MM}/${folio}`
  const ref = await subir(archivo, subcarpeta)
  return serializarRef(ref)
}

export { limpiarCacheToken, estaConfigurado as isExpedienteConfigured }
export type { RefExpediente }
