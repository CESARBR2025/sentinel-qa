import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'
import { obtenerSolicitudDetalle } from '@/lib/prevencion/repository'
import { updateSolicitudApi } from '@/lib/prevencion/actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'ver')
  if (chequeo) return chequeo

  const { id } = await params
  const { solicitud, solicitudesC4, contestacion } = await obtenerSolicitudDetalle(id)

  if (!solicitud) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json({ solicitud, solicitudesC4, contestacion })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()
  const updated = await updateSolicitudApi(id, body)
  return NextResponse.json(updated)
}
