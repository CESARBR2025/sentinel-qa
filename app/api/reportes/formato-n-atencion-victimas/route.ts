import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarAtencionVictimas, crearAtencionVictimas, obtenerAtencionVictimasPorFechaPeriodo, Periodo } from '@/lib/reportes/formato-n-atencion-victimas-service'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const periodo = searchParams.get('periodo') as Periodo | null

  const registros = await listarAtencionVictimas(periodo || undefined)
  return NextResponse.json(registros)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  if (!body.fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  if (!body.periodo) return NextResponse.json({ error: 'Periodo requerido' }, { status: 400 })

  try {
    const id = await crearAtencionVictimas({
      fecha: body.fecha,
      periodo: body.periodo,
      capturado_por: session.user.id,
      numero_atenciones: body.numero_atenciones,
      atenciones_medicas: body.atenciones_medicas,
      atenciones_psicologicas: body.atenciones_psicologicas,
      asesorias_juridicas: body.asesorias_juridicas,
      observaciones: body.observaciones ?? null,
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch (err: unknown) {
    const pgErr = err as { code?: string; message?: string }
    const isDuplicate = pgErr?.code === '23505' || (pgErr?.message || '').includes('duplicate key')
    if (isDuplicate) {
      const existente = await obtenerAtencionVictimasPorFechaPeriodo(body.fecha, body.periodo)
      return NextResponse.json({
        error: 'Ya existe un reporte de Atención a Víctimas para esta fecha y periodo.',
        existenteId: existente?.id || null,
      }, { status: 409 })
    }
    return NextResponse.json({ error: pgErr?.message || 'Error desconocido' }, { status: 500 })
  }
}
