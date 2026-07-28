import { NextRequest, NextResponse } from 'next/server'
import { subir } from '@/lib/expediente/v2/client'
import { serializarRef } from '@/lib/expediente/v2/ref'
import { carpetaLiberacionCiudadana } from '@/lib/expediente/v2/carpetas'
import { insertarDocumentoLiberacion, obtenerInfraccionIdDeSolicitud } from '@/lib/agente_infracciones/repository'
import { verificarAccesoCiudadano } from '@/lib/via/auth-ciudadano'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const solicitudId = formData.get('solicitudId') as string
    const tipoDocumento = formData.get('tipoDocumento') as string
    const archivo = formData.get('file') as File

    if (!solicitudId || !tipoDocumento || !archivo) {
      return NextResponse.json({ error: 'solicitudId, tipoDocumento y archivo son requeridos' }, { status: 400 })
    }

    const infraccionId = await obtenerInfraccionIdDeSolicitud(solicitudId)
    if (!infraccionId || !(await verificarAccesoCiudadano(req, infraccionId))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const esValido = archivo.type.startsWith('image/') || archivo.type === 'application/pdf'
    if (!esValido) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
    }

    const buffer = Buffer.from(await archivo.arrayBuffer())
    const ref = await subir({ buffer, nombre: archivo.name, tipo: archivo.type }, carpetaLiberacionCiudadana(infraccionId))

    const id = crypto.randomUUID()
    await insertarDocumentoLiberacion({
      id,
      solicitudId,
      tipoDocumento,
      urlDocumento: serializarRef(ref),
    })

    return NextResponse.json({ success: true, data: { ruta: serializarRef(ref) } })
  } catch (error) {
    console.error('[VIA][CIUDADANO][SUBIR-ARCHIVO]', error)
    return NextResponse.json({ error: 'Error al subir archivo' }, { status: 500 })
  }
}
