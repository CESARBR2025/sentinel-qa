import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { fichasBusqueda } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

export async function POST(
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