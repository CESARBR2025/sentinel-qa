import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'
import { obtenerFichaDetalle } from '@/lib/prevencion/repository'
import { updateFichaApi } from '@/lib/prevencion/actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'ver')
  if (chequeo) return chequeo

  const { id } = await params
  const { ficha, seguimientos } = await obtenerFichaDetalle(id)

  if (!ficha) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json({ ficha, seguimientos })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()
  const updated = await updateFichaApi(id, body)
  return NextResponse.json(updated)
}
