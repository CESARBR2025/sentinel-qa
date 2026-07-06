import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { db }      from '@/lib/db/index'
import { eq }      from 'drizzle-orm'
import { incidentes, incidentePersonasAfectadas, incidenteDespacho, incidenteReporteCampo, incidenteExtorsion, incidenteAlarmaEscolar, catTiposIncidente, catTiposEmergencia, catPrioridades, catMediosCanalizacion, users } from '@/lib/db/schema'
import { registrarAudit } from '@/lib/incidentes/audit'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const { id } = await params

  const [inc] = await db
    .select({
      id:                  incidentes.id,
      folio:               incidentes.folio,
      canal:               incidentes.canal,
      tipoReporte:         incidentes.tipoReporte,
      estatus:             incidentes.estatus,
      nombreReportante:    incidentes.nombreReportante,
      anonimo:             incidentes.anonimo,
      sexo:                incidentes.sexo,
      edad:                incidentes.edad,
      esUsuarioFrecuente:  incidentes.esUsuarioFrecuente,
      esPersonaAfectada:   incidentes.esPersonaAfectada,
      esMigrante:          incidentes.esMigrante,
      calle:               incidentes.calle,
      colonia:             incidentes.colonia,
      entreCalles:         incidentes.entreCalles,
      referenciaUbicacion: incidentes.referenciaUbicacion,
      municipio:           incidentes.municipio,
      descripcion:         incidentes.descripcion,
      observaciones:       incidentes.observaciones,
      fechaHoraInicio:     incidentes.fechaHoraInicio,
      fechaHoraFin:        incidentes.fechaHoraFin,
      grupoWhatsapp:       incidentes.grupoWhatsapp,
      nombreOficial:       incidentes.nombreOficial,
      requiereDespacho:    incidentes.requiereDespacho,
      creadoEn:            incidentes.creadoEn,
      tipoIncidente:       catTiposIncidente.nombre,
      tipoEmergencia:      catTiposEmergencia.nombre,
      prioridad:           catPrioridades.nombre,
      medioCanalizacion:   catMediosCanalizacion.nombre,
      capturadoPorNombre:  users.name,
    })
    .from(incidentes)
    .leftJoin(catTiposIncidente,    eq(incidentes.tipoIncidenteId,    catTiposIncidente.id))
    .leftJoin(catTiposEmergencia,   eq(incidentes.tipoEmergenciaId,   catTiposEmergencia.id))
    .leftJoin(catPrioridades,       eq(incidentes.prioridadId,        catPrioridades.id))
    .leftJoin(catMediosCanalizacion, eq(incidentes.medioCanalizacionId, catMediosCanalizacion.id))
    .leftJoin(users,                eq(incidentes.capturadoPor,       users.id))
    .where(eq(incidentes.id, id))
    .limit(1)

  if (!inc) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  // Cargar sub-entidades en paralelo
  const [personas, despacho, reporte, extorsion, alarma] = await Promise.all([
    db.select().from(incidentePersonasAfectadas).where(eq(incidentePersonasAfectadas.incidenteId, id)),
    db.select().from(incidenteDespacho).where(eq(incidenteDespacho.incidenteId, id)).limit(1),
    db.select().from(incidenteReporteCampo).where(eq(incidenteReporteCampo.incidenteId, id)).limit(1),
    db.select().from(incidenteExtorsion).where(eq(incidenteExtorsion.incidenteId, id)).limit(1),
    db.select().from(incidenteAlarmaEscolar).where(eq(incidenteAlarmaEscolar.incidenteId, id)).limit(1),
  ])

  // Auditar vista de incidente sensible
  await registrarAudit({ userId: session.user.id, accion: 'VIEW', entidad: 'incidentes', entidadId: id })

  return NextResponse.json({
    ...inc,
    personasAfectadas: personas,
    despacho:          despacho[0]  ?? null,
    reporteCampo:      reporte[0]   ?? null,
    extorsion:         extorsion[0] ?? null,
    alarmaEscolar:     alarma[0]    ?? null,
  })
}