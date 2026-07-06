import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { visitasDomiciliarias } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'ver')
  if (chequeo) return chequeo

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
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'editar')
  if (chequeo) return chequeo

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