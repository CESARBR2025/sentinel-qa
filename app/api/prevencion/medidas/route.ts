import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { medidasProteccion } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'ver')
  if (chequeo) return chequeo

  const search = request.nextUrl.searchParams
  const autoridad = search.get('autoridad')
  const status = search.get('status')

  let query = db.select().from(medidasProteccion)

  if (autoridad) {
    query = query.where(eq(medidasProteccion.autoridad, autoridad)) as typeof query
  }
  if (status) {
    query = query.where(eq(medidasProteccion.status, status)) as typeof query
  }

  const rows = await query.orderBy(medidasProteccion.fechaVencimiento)
  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'crear')
  if (chequeo) return chequeo

  const body = await request.json()

  const [created] = await db.insert(medidasProteccion).values({
    expediente: body.expediente,
    nOficio: body.nOficio,
    fechaOficio: body.fechaOficio,
    fechaRecepcion: body.fechaRecepcion,
    personaRecepciona: body.personaRecepciona,
    autoridad: body.autoridad,
    nombreAutoridad: body.nombreAutoridad,
    delitos: body.delitos,
    victima: body.victima,
    demandado: body.demandado,
    tipoMedida: body.tipoMedida,
    domicilioProteccion: body.domicilioProteccion,
    colonia: body.colonia,
    telefono: body.telefono,
    tiempoMedida: body.tiempoMedida,
    fechaVencimiento: body.fechaVencimiento,
    tipoApercibimiento: body.tipoApercibimiento,
    enlace: body.enlace,
    observaciones: body.observaciones,
  }).returning()

  return NextResponse.json(created, { status: 201 })
}