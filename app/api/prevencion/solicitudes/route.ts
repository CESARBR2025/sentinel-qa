import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'
import { listarSolicitudesFiltradas } from '@/lib/prevencion/repository'
import { createSolicitudApi } from '@/lib/prevencion/actions'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'ver')
  if (chequeo) return chequeo

  const search = request.nextUrl.searchParams
  const status = search.get('status')
  const autoridad = search.get('autoridad')

  const rows = await listarSolicitudesFiltradas(status, autoridad)
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'crear')
  if (chequeo) return chequeo

  const body = await request.json()
  const created = await createSolicitudApi(body)
  return NextResponse.json(created, { status: 201 })
}
