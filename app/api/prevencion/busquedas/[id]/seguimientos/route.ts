import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { seguimientosBusqueda } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const [created] = await db.insert(seguimientosBusqueda).values({
    fichaId: id,
    tipo: body.tipo,
    fechaHoraEnvio: body.fechaHoraEnvio ?? new Date(),
  }).returning()

  return NextResponse.json(created, { status: 201 })
}