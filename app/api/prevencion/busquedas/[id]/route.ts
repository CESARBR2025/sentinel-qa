import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { fichasBusqueda, seguimientosBusqueda } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const ficha = await db
    .select()
    .from(fichasBusqueda)
    .where(eq(fichasBusqueda.id, id))
    .then(r => r[0])

  if (!ficha) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  const seguimientos = await db
    .select()
    .from(seguimientosBusqueda)
    .where(eq(seguimientosBusqueda.fichaId, id))
    .orderBy(seguimientosBusqueda.fechaHoraEnvio)

  return NextResponse.json({ ficha, seguimientos })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const [updated] = await db
    .update(fichasBusqueda)
    .set(body)
    .where(eq(fichasBusqueda.id, id))
    .returning()

  return NextResponse.json(updated)
}