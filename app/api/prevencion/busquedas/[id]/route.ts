import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { fichasBusqueda, seguimientosBusqueda } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'ver')
  if (chequeo) return chequeo

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
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()

  const [updated] = await db
    .update(fichasBusqueda)
    .set(body)
    .where(eq(fichasBusqueda.id, id))
    .returning()

  return NextResponse.json(updated)
}