import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { solicitudesInformacion, solicitudesC4Internas, contestaciones } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'ver')
  if (chequeo) return chequeo

  const { id } = await params
  const solicitud = await db
    .select()
    .from(solicitudesInformacion)
    .where(eq(solicitudesInformacion.id, id))
    .then(r => r[0])

  if (!solicitud) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }

  const solicitudesC4 = await db
    .select()
    .from(solicitudesC4Internas)
    .where(eq(solicitudesC4Internas.solicitudId, id))
    .orderBy(solicitudesC4Internas.creadoEn)

  const contestacion = await db
    .select()
    .from(contestaciones)
    .where(eq(contestaciones.solicitudId, id))
    .then(r => r[0])

  return NextResponse.json({ solicitud, solicitudesC4, contestacion })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()

  const [updated] = await db
    .update(solicitudesInformacion)
    .set({ ...body, actualizadoEn: sql`now()` })
    .where(eq(solicitudesInformacion.id, id))
    .returning()

  return NextResponse.json(updated)
}