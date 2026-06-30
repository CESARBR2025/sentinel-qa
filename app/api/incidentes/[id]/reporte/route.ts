import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { db }      from '@/lib/db/index'
import { eq }      from 'drizzle-orm'
import { incidentes, incidenteReporteCampo, users } from '@/lib/db/schema'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params

  const [inc] = await db
    .select({ id: incidentes.id, folio: incidentes.folio, estatus: incidentes.estatus })
    .from(incidentes)
    .where(eq(incidentes.id, id))
    .limit(1)

  if (!inc) return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 })

  const [reporte] = await db
    .select({
      id:                      incidenteReporteCampo.id,
      incidenteId:             incidenteReporteCampo.incidenteId,
      contenidoReporte:        incidenteReporteCampo.contenidoReporte,
      lugarCalle:              incidenteReporteCampo.lugarCalle,
      lugarColonia:            incidenteReporteCampo.lugarColonia,
      lugarEntreCalles:        incidenteReporteCampo.lugarEntreCalles,
      lugarReferencia:         incidenteReporteCampo.lugarReferencia,
      datosPositivosNegativos: incidenteReporteCampo.datosPositivosNegativos,
      accionesRealizadas:      incidenteReporteCampo.accionesRealizadas,
      hayDetencion:            incidenteReporteCampo.hayDetencion,
      nombreDetenidos:         incidenteReporteCampo.nombreDetenidos,
      autoridadRecibe:         incidenteReporteCampo.autoridadRecibe,
      expedienteCi:            incidenteReporteCampo.expedienteCi,
      delitoFalta:             incidenteReporteCampo.delitoFalta,
      montoRobo:               incidenteReporteCampo.montoRobo,
      objetosRecuperados:      incidenteReporteCampo.objetosRecuperados,
      vehiculosRecuperados:    incidenteReporteCampo.vehiculosRecuperados,
      tipoVehiculo:            incidenteReporteCampo.tipoVehiculo,
      destinoVehiculo:         incidenteReporteCampo.destinoVehiculo,
      hayCateo:                incidenteReporteCampo.hayCateo,
      domicilioCateado:        incidenteReporteCampo.domicilioCateado,
      resultadoCateo:          incidenteReporteCampo.resultadoCateo,
      policiaCargo:            incidenteReporteCampo.policiaCargo,
      personalIngresoCi:       incidenteReporteCampo.personalIngresoCi,
      capturadoPorNombre:      users.name,
      creadoEn:                incidenteReporteCampo.creadoEn,
    })
    .from(incidenteReporteCampo)
    .leftJoin(users, eq(incidenteReporteCampo.capturadoPor, users.id))
    .where(eq(incidenteReporteCampo.incidenteId, id))
    .limit(1)

  if (!reporte) return NextResponse.json({ error: 'Este incidente no tiene reporte de campo' }, { status: 404 })

  return NextResponse.json({
    incidente: { id: inc.id, folio: inc.folio, estatus: inc.estatus },
    reporte,
  })
}