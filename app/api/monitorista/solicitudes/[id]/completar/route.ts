import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db/index'
import { solicitudesEvidencia, monitoristaHistorial } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const action: string = body.action ?? 'completar'

  if (!['completar', 'cancelar'].includes(action)) {
    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
  }

  const [sol] = await db
    .select({ id: solicitudesEvidencia.id, status: solicitudesEvidencia.status, incidenteId: solicitudesEvidencia.incidenteId })
    .from(solicitudesEvidencia)
    .where(eq(solicitudesEvidencia.id, id))
    .limit(1)

  if (!sol) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
  if (sol.status !== 'pendiente') return NextResponse.json({ error: 'La solicitud no está pendiente' }, { status: 400 })

  const newStatus = action === 'completar' ? 'completada' : 'cancelada'
  const historialAccion = action === 'completar' ? 'solicitud_completada' : 'solicitud_cancelada'

  await db.update(solicitudesEvidencia)
    .set({ status: newStatus, completadoEn: action === 'completar' ? sql`now()` : null })
    .where(eq(solicitudesEvidencia.id, id))

  await db.insert(monitoristaHistorial).values({
    monitoristaId: session.user.id,
    accion: historialAccion,
    solicitudId: id,
    incidenteId: sol.incidenteId,
  })

  return NextResponse.json({ status: newStatus })
}
