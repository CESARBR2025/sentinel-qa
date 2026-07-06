import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarEventos, crearEvento } from '@/lib/reportes/formato-n-eventos-service'
import { verificarAccesoFormatoNApi } from '@/lib/reportes/permisos'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const registros = await listarEventos()
  return NextResponse.json(registros)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'crear')
  if (chequeo) return chequeo

  const body = await req.json()
  if (!body.fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  if (!body.region) return NextResponse.json({ error: 'Región requerida' }, { status: 400 })
  if (!body.evento) return NextResponse.json({ error: 'Evento requerido' }, { status: 400 })

  try {
    const id = await crearEvento({
      fecha: body.fecha,
      hora: body.hora,
      region: body.region,
      evento: body.evento,
      ubicacion: body.ubicacion ?? null,
      descripcion: body.descripcion ?? null,
      atenciones: body.atenciones ?? null,
      capturado_por: session.user.id,
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch (err: unknown) {
    const pgErr = err as { message?: string }
    return NextResponse.json({ error: pgErr?.message || 'Error desconocido' }, { status: 500 })
  }
}
