import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db/index'
import { monitoristaHistorial } from '@/lib/db/schema'
import { marcarSolicitudAtendida } from '@/lib/monitorista/denuncia-service'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id: denunciaId } = await params
  const body = await req.json()
  const solicitudId: number = body.solicitudId

  if (!solicitudId) {
    return NextResponse.json({ error: 'solicitudId requerido' }, { status: 400 })
  }

  try {
    await marcarSolicitudAtendida(denunciaId, solicitudId)
    await db.insert(monitoristaHistorial).values({
      monitoristaId: session.user.id,
      accion: 'solicitud_completada',
      incidenteId: denunciaId,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error interno'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
