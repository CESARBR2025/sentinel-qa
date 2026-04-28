import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { fichasBusqueda } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const [updated] = await db
    .update(fichasBusqueda)
    .set({
      status: 'cancelada',
      fechaCancelacion: body.fechaCancelacion ?? new Date(),
      fiscalCancela: body.fiscalCancela,
      motivoCancelacion: body.motivoCancelacion,
    })
    .where(eq(fichasBusqueda.id, id))
    .returning()

  return NextResponse.json(updated)
}