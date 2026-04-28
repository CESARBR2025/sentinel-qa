import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { solicitudesC4Internas } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()

  const [created] = await db.insert(solicitudesC4Internas).values({
    solicitudId: id,
    descripcionEvidencias: body.descripcionEvidencias,
    status: 'pendiente',
  }).returning()

  return NextResponse.json(created, { status: 201 })
}