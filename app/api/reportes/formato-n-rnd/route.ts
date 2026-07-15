import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarRnd, crearRnd } from '@/lib/reportes/formato-n-rnd-service'
import { verificarAccesoFormatoNApi } from '@/lib/reportes/permisos'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const registros = await listarRnd()
  return NextResponse.json(registros)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'crear')
  if (chequeo) return chequeo

  const body = await req.json()
  if (!body.fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  if (!body.folio) return NextResponse.json({ error: 'Folio requerido' }, { status: 400 })
  if (!body.hora_detencion) return NextResponse.json({ error: 'Hora de detención requerida' }, { status: 400 })
  if (!body.delito) return NextResponse.json({ error: 'Delito requerido' }, { status: 400 })
  if (!body.autoridad_que_realizo_detencion) return NextResponse.json({ error: 'Autoridad que realizó la detención requerida' }, { status: 400 })

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
