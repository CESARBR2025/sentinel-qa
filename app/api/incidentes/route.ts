import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { db }      from '@/lib/db/index'
import { incidentes, users, catTiposIncidente, catPrioridades } from '@/lib/db/schema'
import { desc, eq, and, gte, lte, ilike, SQL } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const p      = req.nextUrl.searchParams
  const canal  = p.get('canal')
  const estatus = p.get('estatus')
  const desde  = p.get('desde')
  const hasta  = p.get('hasta')
  const folio  = p.get('folio')

  // Whitelist — nunca confiar en parámetros del cliente directamente
  const canalesPermitidos  = ['911', 'whatsapp', 'radio']
  const estatusPermitidos  = ['sin_despachar', 'en_despacho', 'atendido']

  if (canal  && !canalesPermitidos.includes(canal))
    return NextResponse.json({ error: 'canal inválido' }, { status: 400 })
  if (estatus && !estatusPermitidos.includes(estatus))
    return NextResponse.json({ error: 'estatus inválido' }, { status: 400 })

  const filtros: SQL[] = []
  if (canal)   filtros.push(eq(incidentes.canal,   canal))
  if (estatus) filtros.push(eq(incidentes.estatus, estatus))
  if (desde)   filtros.push(gte(incidentes.fechaHoraInicio, desde))
  if (hasta)   filtros.push(lte(incidentes.fechaHoraInicio, hasta))
  if (folio)   filtros.push(ilike(incidentes.folio, `%${folio}%`))

  const lista = await db
    .select({
      id:              incidentes.id,
      folio:           incidentes.folio,
      canal:           incidentes.canal,
      tipoReporte:     incidentes.tipoReporte,
      estatus:         incidentes.estatus,
      fechaHoraInicio: incidentes.fechaHoraInicio,
      colonia:         incidentes.colonia,
      tipoIncidente:   catTiposIncidente.nombre,
      prioridad:       catPrioridades.nombre,
      capturadoPor:    users.name,
    })
    .from(incidentes)
    .leftJoin(catTiposIncidente, eq(incidentes.tipoIncidenteId, catTiposIncidente.id))
    .leftJoin(catPrioridades,    eq(incidentes.prioridadId,     catPrioridades.id))
    .leftJoin(users,             eq(incidentes.capturadoPor,    users.id))
    .where(filtros.length ? and(...filtros) : undefined)
    .orderBy(desc(incidentes.creadoEn))
    .limit(200)

  return NextResponse.json(lista)
}