import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'
import { getFichasBusquedaFiltradas } from '@/lib/prevencion/repository'
import { createFichaApi } from '@/lib/prevencion/actions'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'ver')
  if (chequeo) return chequeo

  const search = request.nextUrl.searchParams
  const tipo = search.get('tipo')
  const status = search.get('status')

  const rows = await getFichasBusquedaFiltradas(tipo, status)
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'crear')
  if (chequeo) return chequeo

  const body = await request.json()
  const created = await createFichaApi(body)
  return NextResponse.json(created, { status: 201 })
}
