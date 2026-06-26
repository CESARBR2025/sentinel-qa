import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db/index'
import { solicitudesEvidencia, evidencias, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params

  const [solicitud] = await db
    .select({
      id: solicitudesEvidencia.id,
      incidenteId: solicitudesEvidencia.incidenteId,
      folioIncidente: solicitudesEvidencia.folioIncidente,
      solicitadoPor: solicitudesEvidencia.solicitadoPor,
      solicitadoNombre: solicitudesEvidencia.solicitadoNombre,
      descripcion: solicitudesEvidencia.descripcion,
      status: solicitudesEvidencia.status,
      creadoEn: solicitudesEvidencia.creadoEn,
      completadoEn: solicitudesEvidencia.completadoEn,
    })
    .from(solicitudesEvidencia)
    .where(eq(solicitudesEvidencia.id, id))
    .limit(1)

  if (!solicitud) {
    return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
  }

  const evs = await db
    .select({
      id: evidencias.id,
      tipo: evidencias.tipo,
      nombreOriginal: evidencias.nombreOriginal,
      urlExpediente: evidencias.urlExpediente,
      subidoPorNombre: users.name,
      creadoEn: evidencias.creadoEn,
    })
    .from(evidencias)
    .leftJoin(users, eq(evidencias.subidoPor, users.id))
    .where(eq(evidencias.solicitudId, id))
    .orderBy(evidencias.creadoEn)

  return NextResponse.json({ solicitud, evidencias: evs })
}
