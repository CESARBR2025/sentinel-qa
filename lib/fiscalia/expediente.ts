import { subir } from '@/lib/expediente/v2/client'
import { serializarRef } from '@/lib/expediente/v2/ref'

export async function subirArchivoFiscalia(
  archivo: File,
  idInfraccion: string,
): Promise<string> {
  const now = new Date()
  const anio = now.getFullYear().toString()
  const mes = String(now.getMonth() + 1).padStart(2, '0')

  const buffer = Buffer.from(await archivo.arrayBuffer())
  const subcarpeta = `oficios/${anio}/${mes}/${idInfraccion}`
  const ref = await subir({ buffer, nombre: archivo.name, tipo: archivo.type }, subcarpeta)
  return serializarRef(ref)
}
