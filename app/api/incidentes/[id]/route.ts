import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { query }   from '@/lib/db'
import { registrarAudit } from '@/lib/incidentes/audit'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const { id } = await params

  const inc = await query(
    `SELECT i.id, i.folio, i.canal, i.tipo_reporte AS "tipoReporte", i.estatus, i.nombre_reportante AS "nombreReportante", i.anonimo, i.sexo, i.edad, i.es_usuario_frecuente AS "esUsuarioFrecuente", i.es_persona_afectada AS "esPersonaAfectada", i.es_migrante AS "esMigrante", i.calle, i.colonia, i.entre_calles AS "entreCalles", i.referencia_ubicacion AS "referenciaUbicacion", i.municipio, i.descripcion, i.observaciones, i.fecha_hora_inicio AS "fechaHoraInicio", i.fecha_hora_fin AS "fechaHoraFin", i.grupo_whatsapp AS "grupoWhatsapp", i.nombre_oficial AS "nombreOficial", i.requiere_despacho AS "requiereDespacho", i.creado_en AS "creadoEn", cti.nombre AS "tipoIncidente", cte.nombre AS "tipoEmergencia", cp.nombre AS prioridad, cmc.nombre AS "medioCanalizacion", u.name AS "capturadoPorNombre" FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_tipos_emergencia cte ON i.tipo_emergencia_id = cte.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN cat_medios_canalizacion cmc ON i.medio_canalizacion_id = cmc.id LEFT JOIN users u ON i.capturado_por = u.id WHERE i.id = $1 LIMIT 1`,
    [id],
  )
  if (!inc.rows[0]) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const [personas, despacho, reporte, extorsion, alarma] = await Promise.all([
    query(`SELECT id, incidente_id AS "incidenteId", nombre, sexo, edad, creado_en AS "creadoEn" FROM incidente_personas_afectadas WHERE incidente_id = $1`, [id]),
    query(`SELECT id, incidente_id AS "incidenteId", fecha_hora_despacho AS "fechaHoraDespacho", despachado_por AS "despachadorPor", creado_en AS "creadoEn" FROM incidente_despacho WHERE incidente_id = $1 LIMIT 1`, [id]),
    query(`SELECT id, incidente_id AS "incidenteId", contenido_reporte AS "contenidoReporte", lugar_calle AS "lugarCalle", lugar_colonia AS "lugarColonia", lugar_entre_calles AS "lugarEntreCalles", lugar_referencia AS "lugarReferencia", datos_positivos_negativos AS "datosPositivosNegativos", acciones_realizadas AS "accionesRealizadas", hay_detencion AS "hayDetencion", nombre_detenidos AS "nombreDetenidos", autoridad_recibe AS "autoridadRecibe", expediente_ci AS "expedienteCi", delito_falta AS "delitoFalta", monto_robo AS "montoRobo", objetos_recuperados AS "objetosRecuperados", hay_cateo AS "hayCateo", domicilio_cateado AS "domicilioCateado", resultado_cateo AS "resultadoCateo", policia_a_cargo AS "policiaCargo", capturado_por AS "capturadoPor", creado_en AS "creadoEn" FROM incidente_reporte_campo WHERE incidente_id = $1 LIMIT 1`, [id]),
    query(`SELECT id, incidente_id AS "incidenteId", telefono_extorsion AS "telefonoExtorsion", grupo_delictivo AS "grupoDelictivo", modus_operandi AS "modusOperandi", unidad_resultado AS "unidadResultado", folio_reporte AS "folioReporte", fecha, creado_en AS "creadoEn" FROM incidente_extorsion WHERE incidente_id = $1 LIMIT 1`, [id]),
    query(`SELECT id, incidente_id AS "incidenteId", establecimiento, direccion, inmueble, responsable, reporte_descripcion AS "reporteDescripcion", hora_canalizacion AS "horaCanalizacion", unidad_arribo AS "unidadArribo", hora_arribo AS "horaArribo", nombre_responsable AS "nombreResponsable", nombre_verificador AS "nombreVerificador", activaciones, creado_en AS "creadoEn" FROM incidente_alarma_escolar WHERE incidente_id = $1 LIMIT 1`, [id]),
  ])

  await registrarAudit({ userId: session.user.id, accion: 'VIEW', entidad: 'incidentes', entidadId: id })

  return NextResponse.json({
    ...inc.rows[0],
    personasAfectadas: personas.rows,
    despacho:          despacho.rows[0]  ?? null,
    reporteCampo:      reporte.rows[0]   ?? null,
    extorsion:         extorsion.rows[0] ?? null,
    alarmaEscolar:     alarma.rows[0]    ?? null,
  })
}
