import { subir } from '@/lib/expediente/v2/client'
import { serializarRef } from '@/lib/expediente/v2/ref'
import { carpetaOficios } from '@/lib/expediente/v2/carpetas'

export async function subirArchivoFiscalia(
  archivo: File,
  idInfraccion: string,
): Promise<string> {
  const buffer = Buffer.from(await archivo.arrayBuffer())
  const ref = await subir({ buffer, nombre: archivo.name, tipo: archivo.type }, carpetaOficios(idInfraccion))
  return serializarRef(ref)
}
