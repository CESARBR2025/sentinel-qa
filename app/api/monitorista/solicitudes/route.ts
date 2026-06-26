import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db/index'
import { solicitudesEvidencia, evidencias, users } from '@/lib/db/schema'
import { eq, desc, sql } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const status = req.nextUrl.searchParams.get('status')

  const statusesPermitidos = ['pendiente', 'completada', 'cancelada']
  if (status && !statusesPermitidos.includes(status)) {
    return NextResponse.json({ error: 'status inválido' }, { status: 400 })
  }

  const filtro = status ? eq(solicitudesEvidencia.status, status) : undefined

  const lista = await db
    .select({
      id: solicitudesEvidencia.id,
      incidenteId: solicitudesEvidencia.incidenteId,
      folioIncidente: solicitudesEvidencia.folioIncidente,
      solicitadoPor: solicitudesEvidencia.solicitadoPor,
      solicitadoNombre: solicitudesEvidencia.solicitadoNombre,
      descripcion: solicitudesEvidencia.descripcion,
      status: solicitudesEvidencia.status,
      creadoEn: solicitudesEvidencia.creadoEn,
      completadoEn: solicitudesEvidencia.completadoEn,
      totalEvidencias: sql<number>`(SELECT count(*)::int FROM evidencias WHERE evidencias.solicitud_id = solicitudes_evidencia.id)`,
    })
    .from(solicitudesEvidencia)
    .where(filtro)
    .orderBy(desc(solicitudesEvidencia.creadoEn))
    .limit(100)

  return NextResponse.json(lista)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()

  const [created] = await db.insert(solicitudesEvidencia).values({
    incidenteId: body.incidenteId,
    folioIncidente: body.folioIncidente || null,
    solicitadoPor: session.user.id,
    solicitadoNombre: session.user.name || 'Usuario',
    descripcion: body.descripcion,
  }).returning()

  return NextResponse.json(created, { status: 201 })
}
