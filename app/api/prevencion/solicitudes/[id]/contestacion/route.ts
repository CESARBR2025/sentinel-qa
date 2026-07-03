import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { solicitudesInformacion, contestaciones } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()

  const [created] = await db.insert(contestaciones).values({
    solicitudId: id,
    fechaContestacion: body.fechaContestacion,
    archivoPdfUrl: body.archivoPdfUrl,
    fechaEntrega: body.fechaEntrega,
    horaEntrega: body.horaEntrega,
    nombreQuienRecibio: body.nombreQuienRecibio,
  }).returning()

  await db
    .update(solicitudesInformacion)
    .set({ status: 'completado', actualizadoEn: new Date().toISOString() })
    .where(eq(solicitudesInformacion.id, id))

  return NextResponse.json(created, { status: 201 })
}