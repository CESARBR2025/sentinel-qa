import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { visitasDomiciliarias } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const visitas = await db
    .select()
    .from(visitasDomiciliarias)
    .where(eq(visitasDomiciliarias.medidaId, id))
    .orderBy(visitasDomiciliarias.fechaVisita)

  return NextResponse.json(visitas)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const [created] = await db.insert(visitasDomiciliarias).values({
    medidaId: id,
    fechaVisita: body.fechaVisita,
    horaVisita: body.horaVisita,
    resultado: body.resultado,
    apercibimientoAplicado: body.apercibimientoAplicado ?? false,
  }).returning()

  return NextResponse.json(created, { status: 201 })
}