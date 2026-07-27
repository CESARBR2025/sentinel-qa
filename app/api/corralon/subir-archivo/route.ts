import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { tienePermiso } from '@/lib/permisos/core'
import { subir } from '@/lib/expediente/v2/client'
import { serializarRef } from '@/lib/expediente/v2/ref'
import { carpetaCorralon } from '@/lib/expediente/v2/carpetas'
import { obtenerEstatusInfraccion, finalizarInfraccionCorralon } from '@/lib/corralon/repository'

function mapearEstatusFinal(estatusDep: string): string {
  if (estatusDep === 'LIBERADA_POR_ACCIDENTE') return 'FINALIZADA_ACCIDENTE'
  if (estatusDep === 'DELITO' || estatusDep === 'LIBERADA_POR_DELITO') return 'FINALIZADA_DELITO'
  return 'FINALIZADA_INFRACCION'
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const puede = await tienePermiso(session.user.id, 'corralon_solicitudes', 'ver')
  if (!puede) return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const formData = await req.formData()
  const infraccionId = formData.get('infraccionId') as string
  const archivo = formData.get('file') as File | null

  if (!infraccionId || !archivo) {
    return NextResponse.json({ error: 'infraccionId y file son requeridos' }, { status: 400 })
  }

  const esValido = archivo.type.startsWith('image/') || archivo.type === 'application/pdf'
  if (!esValido) {
    return NextResponse.json({ error: 'Tipo de archivo no permitido. Solo imágenes y PDF.' }, { status: 400 })
  }

  const estatusDepActual = await obtenerEstatusInfraccion(infraccionId)
  if (estatusDepActual === null) {
    return NextResponse.json({ error: 'Infracción no encontrada' }, { status: 404 })
  }

  try {
    const buffer = Buffer.from(await archivo.arrayBuffer())
    const ref = await subir({ buffer, nombre: archivo.name, tipo: archivo.type }, carpetaCorralon(infraccionId))
    const urlDocumento = serializarRef(ref)
    const nuevoEstatusDep = mapearEstatusFinal(estatusDepActual)

    await finalizarInfraccionCorralon(infraccionId, urlDocumento, nuevoEstatusDep)

    return NextResponse.json({ success: true, data: { url: urlDocumento, estatus: 'FINALIZADA', estatusDependencia: nuevoEstatusDep } })
  } catch (error) {
    console.error('[CORRALON][SUBIR-ARCHIVO]', error)
    return NextResponse.json({ error: 'Error interno al subir archivo' }, { status: 500 })
  }
}
