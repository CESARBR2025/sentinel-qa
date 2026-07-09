import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { obtenerSolicitudConIncidente, actualizarEstadoSolicitud, insertHistorial } from '@/lib/monitorista/repository'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'editar'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const action: string = body.action ?? 'completar'

  if (!['completar', 'cancelar'].includes(action)) {
    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
  }

  const sol = await obtenerSolicitudConIncidente(id)
  if (!sol) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
  if (sol.status !== 'pendiente') return NextResponse.json({ error: 'La solicitud no está pendiente' }, { status: 400 })

  const newStatus = action === 'completar' ? 'completada' : 'cancelada'
  const historialAccion = action === 'completar' ? 'solicitud_completada' : 'solicitud_cancelada'
  const completadoEn = action === 'completar'

  await actualizarEstadoSolicitud(id, newStatus, completadoEn)
  await insertHistorial(session.user.id, historialAccion, sol.incidente_id, id)

  return NextResponse.json({ status: newStatus })
}
