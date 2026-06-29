import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { solicitudesInformacion, contestaciones } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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