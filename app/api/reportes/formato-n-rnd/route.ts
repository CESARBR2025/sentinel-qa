import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarRnd, crearRnd } from '@/lib/reportes/formato-n-rnd-service'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const registros = await listarRnd()
  return NextResponse.json(registros)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  if (!body.fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  if (!body.folio) return NextResponse.json({ error: 'Folio requerido' }, { status: 400 })

  try {
    const id = await crearRnd({
      fecha: body.fecha,
      hora_detencion: body.hora_detencion,
      delito: body.delito,
      autoridad_que_realizo_detencion: body.autoridad_que_realizo_detencion,
      folio: body.folio,
      capturado_por: session.user.id,
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch (err: unknown) {
    const pgErr = err as { message?: string }
    return NextResponse.json({ error: pgErr?.message || 'Error desconocido' }, { status: 500 })
  }
}
