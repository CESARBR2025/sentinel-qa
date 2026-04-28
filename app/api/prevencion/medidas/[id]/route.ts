import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { medidasProteccion, visitasDomiciliarias } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const medida = await db
    .select()
    .from(medidasProteccion)
    .where(eq(medidasProteccion.id, id))
    .then(r => r[0])

  if (!medida) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  const visitas = await db
    .select()
    .from(visitasDomiciliarias)
    .where(eq(visitasDomiciliarias.medidaId, id))
    .orderBy(visitasDomiciliarias.fechaVisita)

  return NextResponse.json({ medida, visitas })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const [updated] = await db
    .update(medidasProteccion)
    .set({ ...body, actualizadoEn: new Date() })
    .where(eq(medidasProteccion.id, id))
    .returning()

  return NextResponse.json(updated)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const [updated] = await db
    .update(medidasProteccion)
    .set({ status: body.status, actualizadoEn: new Date() })
    .where(eq(medidasProteccion.id, id))
    .returning()

  return NextResponse.json(updated)
}