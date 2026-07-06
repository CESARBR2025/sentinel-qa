import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { solicitudesInformacion } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'ver')
  if (chequeo) return chequeo

  const search = request.nextUrl.searchParams
  const status = search.get('status')
  const autoridad = search.get('autoridad')

  let query = db.select().from(solicitudesInformacion)

  if (status) {
    query = query.where(eq(solicitudesInformacion.status, status)) as typeof query
  }
  if (autoridad) {
    query = query.where(eq(solicitudesInformacion.autoridad, autoridad)) as typeof query
  }

  const rows = await query.orderBy(solicitudesInformacion.fechaActivacion)
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'crear')
  if (chequeo) return chequeo

  const body = await request.json()

  const [created] = await db.insert(solicitudesInformacion).values({
    enlace: body.enlace,
    oficio: body.oficio,
    fechaActivacion: body.fechaActivacion ?? new Date(),
    autoridad: body.autoridad,
    fiscalSolicita: body.fiscalSolicita,
    delito: body.delito,
    carpetaInvestigacion: body.carpetaInvestigacion,
    solicitudTexto: body.solicitudTexto,
    status: body.status ?? 'en_juridico',
  }).returning()

  return NextResponse.json(created, { status: 201 })
}