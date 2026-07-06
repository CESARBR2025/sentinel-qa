import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { fichasBusqueda } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'ver')
  if (chequeo) return chequeo

  const search = request.nextUrl.searchParams
  const tipo = search.get('tipo')
  const status = search.get('status')

  let query = db.select().from(fichasBusqueda)

  if (tipo) {
    query = query.where(eq(fichasBusqueda.tipo, tipo)) as typeof query
  }
  if (status) {
    query = query.where(eq(fichasBusqueda.status, status)) as typeof query
  }

  const rows = await query.orderBy(fichasBusqueda.fechaActivacion)
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'crear')
  if (chequeo) return chequeo

  const body = await request.json()

  const [created] = await db.insert(fichasBusqueda).values({
    tipo: body.tipo,
    folio: body.folio,
    enlace: body.enlace,
    fechaActivacion: body.fechaActivacion,
    carpetaInvestigacion: body.carpetaInvestigacion,
    nombreDesaparecida: body.nombreDesaparecida,
    edad: body.edad,
    fechaAceptacion: body.fechaAceptacion,
    rtAtiende: body.rtAtiende,
    elementoNovedades: body.elementoNovedades,
  }).returning()

  return NextResponse.json(created, { status: 201 })
}