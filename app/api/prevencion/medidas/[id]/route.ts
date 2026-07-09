import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'
import { obtenerMedidaDetalleCompleto } from '@/lib/prevencion/repository'
import { updateMedidaApi, updateMedidaStatusApi } from '@/lib/prevencion/actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'ver')
  if (chequeo) return chequeo

  const { id } = await params
  const { medida, visitas } = await obtenerMedidaDetalleCompleto(id)

  if (!medida) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json({ medida, visitas })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()
  const updated = await updateMedidaApi(id, body)
  return NextResponse.json(updated)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()
  const updated = await updateMedidaStatusApi(id, body.status)
  return NextResponse.json(updated)
}
