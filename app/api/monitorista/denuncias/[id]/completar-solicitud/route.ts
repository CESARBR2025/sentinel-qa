import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { marcarSolicitudAtendida } from '@/lib/monitorista/denuncia-service'
import { insertHistorial } from '@/lib/monitorista/repository'
import { tienePermiso } from '@/lib/monitorista/permisos'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'editar'))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id: denunciaId } = await params
  const body = await req.json()
  const solicitudId: number = body.solicitudId

  if (!solicitudId) {
    return NextResponse.json({ error: 'solicitudId requerido' }, { status: 400 })
  }

  try {
    await marcarSolicitudAtendida(denunciaId, solicitudId)
    await insertHistorial(session.user.id, 'solicitud_completada', denunciaId)
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
