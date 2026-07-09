import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { listarSolicitudesConFiltro, crearSolicitudEvidencia } from '@/lib/monitorista/repository'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'ver'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const status = req.nextUrl.searchParams.get('status') ?? undefined
  const rows = await listarSolicitudesConFiltro(status)
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'crear'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const body = await req.json()
  const id = await crearSolicitudEvidencia({
    incidenteId: body.incidenteId,
    folioIncidente: body.folioIncidente || null,
    solicitadoPor: session.user.id,
    solicitadoNombre: session.user.name || 'Usuario',
    descripcion: body.descripcion,
  })
  return NextResponse.json({ id }, { status: 201 })
}
