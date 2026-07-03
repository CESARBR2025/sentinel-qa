import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { db }      from '@/lib/db/index'
import { incidentes, incidenteDespacho, incidenteDespachoUnidades, incidenteDespachoElementos, incidenteReporteCampo, catTiposIncidente, catPrioridades, users } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'

export async function GET(_req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const lista = await db
    .select({
      id:                incidentes.id,
      folio:             incidentes.folio,
      canal:             incidentes.canal,
      estatus:           incidentes.estatus,
      fechaHoraInicio:   incidentes.fechaHoraInicio,
      calle:             incidentes.calle,
      colonia:           incidentes.colonia,
      descripcion:       incidentes.descripcion,
      tipoIncidente:     catTiposIncidente.nombre,
      prioridad:         catPrioridades.nombre,
      capturadoPor:      users.name,
      despachoId:        incidenteDespacho.id,
      fechaHoraDespacho: incidenteDespacho.fechaHoraDespacho,
      // Resumen del reporte de campo
      accionesRealizadas: incidenteReporteCampo.accionesRealizadas,
      hayDetencion:       incidenteReporteCampo.hayDetencion,
    })
    .from(incidentes)
    .leftJoin(catTiposIncidente,    eq(incidentes.tipoIncidenteId,    catTiposIncidente.id))
    .leftJoin(catPrioridades,       eq(incidentes.prioridadId,        catPrioridades.id))
    .leftJoin(users,                eq(incidentes.capturadoPor,       users.id))
    .leftJoin(incidenteDespacho,    eq(incidentes.id, incidenteDespacho.incidenteId))
    .leftJoin(incidenteReporteCampo, eq(incidentes.id, incidenteReporteCampo.incidenteId))
    .where(eq(incidentes.estatus, 'atendido'))
    .orderBy(desc(incidentes.creadoEn))
    .limit(100)

  const resultado = await Promise.all(lista.map(async inc => {
    if (!inc.despachoId) return { ...inc, unidades: [], elementos: [] }
    const [unidades, elementos] = await Promise.all([
      db.select({ placa: incidenteDespachoUnidades.unidadPlaca })
        .from(incidenteDespachoUnidades)
        .where(eq(incidenteDespachoUnidades.despachoId, inc.despachoId)),
      db.select({ nombre: incidenteDespachoElementos.elementoNombre, nomina: incidenteDespachoElementos.elementoNomina })
        .from(incidenteDespachoElementos)
        .where(eq(incidenteDespachoElementos.despachoId, inc.despachoId)),
    ])
    return { ...inc, unidades, elementos }
  }))

  return NextResponse.json(resultado)
}