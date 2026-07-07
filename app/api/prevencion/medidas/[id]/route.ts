import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { medidasProteccion, visitasDomiciliarias } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
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
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()

  const [updated] = await db
    .update(medidasProteccion)
    .set({ ...body, actualizadoEn: sql`now()` })
    .where(eq(medidasProteccion.id, id))
    .returning()

  return NextResponse.json(updated)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()

  const [updated] = await db
    .update(medidasProteccion)
    .set({ status: body.status, actualizadoEn: new Date().toISOString() })
    .where(eq(medidasProteccion.id, id))
    .returning()

  return NextResponse.json(updated)
}