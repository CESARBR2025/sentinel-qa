import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { subir } from '@/lib/expediente/v2/client'
import { serializarRef } from '@/lib/expediente/v2/ref'
import { carpetaEvidenciasInfraccion } from '@/lib/expediente/v2/carpetas'
import { actualizarEvidenciasInfraccion } from '@/lib/agente_infracciones/repository'
import { verificarRolOficial } from '@/lib/oficial/service'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    if (!(await verificarRolOficial(session.user.id))) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const formData = await req.formData()
    const idInfraccion = formData.get('idInfraccion') as string
    const evidencias = formData.getAll('evidencias') as File[]

    if (!idInfraccion) {
      return NextResponse.json({ message: 'idInfraccion es requerido' }, { status: 400 })
    }
    if (!evidencias.length) {
      return NextResponse.json({ message: 'Debe enviarse al menos una evidencia' }, { status: 400 })
    }

    const carpetaBase = carpetaEvidenciasInfraccion(idInfraccion)

    const buffers = await Promise.all(
      evidencias.map(async (evidencia, index) => {
        const esValido = evidencia.type.startsWith('image/') || evidencia.type === 'application/pdf'
        if (!esValido) throw new Error(`Tipo de archivo no permitido: ${evidencia.name}`)
        const ext = evidencia.name.split('.').pop() ?? 'jpg'
        const nombre = `EVIDENCIA_${Date.now()}_${index}.${ext}`
        return { buffer: Buffer.from(await evidencia.arrayBuffer()), nombre, tipo: evidencia.type }
      }),
    )

    const refs = await Promise.all(
      buffers.map(buf => subir(buf, carpetaBase)),
    )

    const rutas = refs.map(r => serializarRef(r))
    await actualizarEvidenciasInfraccion(idInfraccion, rutas)

    return NextResponse.json({ message: 'Evidencias guardadas correctamente', data: rutas })
  } catch (error) {
    console.error('[VIA][EXP-DIGITAL][GUARDAR-EVIDENCIAS]', error)
    return NextResponse.json({
      message: error instanceof Error ? error.message : 'Error interno',
    }, { status: 500 })
  }
}
