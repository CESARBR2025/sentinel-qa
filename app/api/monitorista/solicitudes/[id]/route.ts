import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { obtenerSolicitudConEvidencias } from '@/lib/monitorista/repository'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'ver'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { id } = await params
  const data = await obtenerSolicitudConEvidencias(id)
  if (!data) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json(data)
}
