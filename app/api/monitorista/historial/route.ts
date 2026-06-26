import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db/index'
import { monitoristaHistorial, solicitudesEvidencia, users } from '@/lib/db/schema'
import { eq, desc, gte, lte, and } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const p = req.nextUrl.searchParams
  const monitoristaId = p.get('monitoristaId') ?? session.user.id
  const desde = p.get('desde')
  const hasta = p.get('hasta')

  const filtros = [eq(monitoristaHistorial.monitoristaId, monitoristaId)]
  if (desde) filtros.push(gte(monitoristaHistorial.creadoEn, desde))
  if (hasta) filtros.push(lte(monitoristaHistorial.creadoEn, hasta))

  const lista = await db
    .select({
      id: monitoristaHistorial.id,
      accion: monitoristaHistorial.accion,
      solicitudId: monitoristaHistorial.solicitudId,
      incidenteId: monitoristaHistorial.incidenteId,
      creadoEn: monitoristaHistorial.creadoEn,
      monitoristaNombre: users.name,
      folioIncidente: solicitudesEvidencia.folioIncidente,
    })
    .from(monitoristaHistorial)
    .leftJoin(users, eq(monitoristaHistorial.monitoristaId, users.id))
    .leftJoin(solicitudesEvidencia, eq(monitoristaHistorial.solicitudId, solicitudesEvidencia.id))
    .where(and(...filtros))
    .orderBy(desc(monitoristaHistorial.creadoEn))
    .limit(200)

  return NextResponse.json(lista)
}
