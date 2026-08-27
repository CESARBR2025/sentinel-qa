import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerObservacionesPorFecha, upsertObservaciones } from '@/lib/n-coordinacion/repository'
import { verificarAccesoFormatoNApi } from '@/lib/reportes/permisos'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const url = new URL(req.url)
  const fecha = url.searchParams.get('fecha')
  if (!fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })

  const obs = await obtenerObservacionesPorFecha(fecha)
  return NextResponse.json(obs)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'crear')
  if (chequeo) return chequeo

  const body = await req.json()
  if (!body.fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })

  await upsertObservaciones(body.fecha, session.user.id, String(body.observaciones ?? ''))
  return NextResponse.json({ success: true })
}
