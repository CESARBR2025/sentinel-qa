import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { db }      from '@/lib/db/index'
import { incidentes, users, catTiposIncidente, catPrioridades } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'

export async function GET(_req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const lista = await db
    .select({
      id:                  incidentes.id,
      folio:               incidentes.folio,
      canal:               incidentes.canal,
      fechaHoraInicio:     incidentes.fechaHoraInicio,
      calle:               incidentes.calle,
      colonia:             incidentes.colonia,
      entreCalles:         incidentes.entreCalles,
      referenciaUbicacion: incidentes.referenciaUbicacion,
      descripcion:         incidentes.descripcion,
      tipoIncidente:       catTiposIncidente.nombre,
      prioridad:           catPrioridades.nombre,
      prioridadOrden:      catPrioridades.orden,
      capturadoPor:        users.name,
    })
    .from(incidentes)
    .leftJoin(catTiposIncidente, eq(incidentes.tipoIncidenteId, catTiposIncidente.id))
    .leftJoin(catPrioridades,    eq(incidentes.prioridadId,     catPrioridades.id))
    .leftJoin(users,             eq(incidentes.capturadoPor,    users.id))
    .where(and(
      eq(incidentes.estatus,          'sin_despachar'),
      eq(incidentes.requiereDespacho, true),
    ))
    .orderBy(catPrioridades.orden, desc(incidentes.fechaHoraInicio))

  return NextResponse.json(lista)
}