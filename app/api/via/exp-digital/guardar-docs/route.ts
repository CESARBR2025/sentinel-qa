import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { subir } from '@/lib/expediente/v2/client'
import { serializarRef } from '@/lib/expediente/v2/ref'
import { carpetaDocsInfraccion } from '@/lib/expediente/v2/carpetas'
import { actualizarUrlsDocumentosInfraccion } from '@/lib/agente_infracciones/repository'
import { verificarRolOficial } from '@/lib/oficial/service'

function validarArchivo(file: File | null) {
  if (!file) return
  const esValido = file.type.startsWith('image/') || file.type === 'application/pdf'
  if (!esValido) throw new Error(`Tipo de archivo no permitido: ${file.name}`)
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    if (!(await verificarRolOficial(session.user.id))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const formData = await req.formData()
    const idInfraccion = formData.get('idInfraccion') as string
    const archivoInapam = formData.get('archivoInapam') as File | null
    const archivoIne = formData.get('archivoIne') as File | null
    const archivoTarjetaCirculacion = formData.get('archivoTarjetaCirculacion') as File | null

    if (!idInfraccion) {
      return NextResponse.json({ message: 'idInfraccion es requerido' }, { status: 400 })
    }

    const tieneDocumentos = archivoIne || archivoInapam || archivoTarjetaCirculacion
    if (!tieneDocumentos) {
      return NextResponse.json({ message: 'No se enviaron documentos' }, { status: 400 })
    }

    validarArchivo(archivoInapam)
    validarArchivo(archivoIne)
    validarArchivo(archivoTarjetaCirculacion)

    const carpetaBase = carpetaDocsInfraccion(idInfraccion)

    const [refIne, refInapam, refTarjeta] = await Promise.all([
      archivoIne ? subir({ buffer: Buffer.from(await archivoIne.arrayBuffer()), nombre: archivoIne.name, tipo: archivoIne.type }, `${carpetaBase}/ine`) : Promise.resolve(null),
      archivoInapam ? subir({ buffer: Buffer.from(await archivoInapam.arrayBuffer()), nombre: archivoInapam.name, tipo: archivoInapam.type }, `${carpetaBase}/inapam`) : Promise.resolve(null),
      archivoTarjetaCirculacion ? subir({ buffer: Buffer.from(await archivoTarjetaCirculacion.arrayBuffer()), nombre: archivoTarjetaCirculacion.name, tipo: archivoTarjetaCirculacion.type }, `${carpetaBase}/tc`) : Promise.resolve(null),
    ])

    await actualizarUrlsDocumentosInfraccion(idInfraccion, {
      ine: refIne ? serializarRef(refIne) : null,
      inapam: refInapam ? serializarRef(refInapam) : null,
      tarjetaCirculacion: refTarjeta ? serializarRef(refTarjeta) : null,
    })

    return NextResponse.json({
      message: 'Documentos guardados correctamente',
      data: {
        urlIne: refIne ? serializarRef(refIne) : null,
        urlInapam: refInapam ? serializarRef(refInapam) : null,
        urlTarjetaCirculacion: refTarjeta ? serializarRef(refTarjeta) : null,
      },
    })
  } catch (error) {
    console.error('[VIA][EXP-DIGITAL][GUARDAR-DOCS]', error)
    return NextResponse.json({
      message: error instanceof Error ? error.message : 'Error interno',
    }, { status: 500 })
  }
}
