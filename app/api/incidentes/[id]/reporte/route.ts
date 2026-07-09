import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { query }   from '@/lib/db'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const { id } = await params

  const inc = await query<{ id: string; folio: string; estatus: string }>(
    `SELECT id, folio, estatus FROM incidentes WHERE id = $1 LIMIT 1`,
    [id],
  )
  if (!inc.rows[0]) return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 })

  const reporte = await query(
    `SELECT r.id, r.incidente_id AS "incidenteId", r.contenido_reporte AS "contenidoReporte", r.lugar_calle AS "lugarCalle", r.lugar_colonia AS "lugarColonia", r.lugar_entre_calles AS "lugarEntreCalles", r.lugar_referencia AS "lugarReferencia", r.datos_positivos_negativos AS "datosPositivosNegativos", r.acciones_realizadas AS "accionesRealizadas", r.hay_detencion AS "hayDetencion", r.nombre_detenidos AS "nombreDetenidos", r.autoridad_recibe AS "autoridadRecibe", r.expediente_ci AS "expedienteCi", r.delito_falta AS "delitoFalta", r.monto_robo AS "montoRobo", r.objetos_recuperados AS "objetosRecuperados", r.vehiculos_recuperados AS "vehiculosRecuperados", r.tipo_vehiculo AS "tipoVehiculo", r.destino_vehiculo AS "destinoVehiculo", r.hay_cateo AS "hayCateo", r.domicilio_cateado AS "domicilioCateado", r.resultado_cateo AS "resultadoCateo", r.policia_a_cargo AS "policiaCargo", r.personal_ingreso_ci AS "personalIngresoCi", u.name AS "capturadoPorNombre", r.creado_en AS "creadoEn" FROM incidente_reporte_campo r LEFT JOIN users u ON r.capturado_por = u.id WHERE r.incidente_id = $1 LIMIT 1`,
    [id],
  )
  if (!reporte.rows[0]) return NextResponse.json({ error: 'Este incidente no tiene reporte de campo' }, { status: 404 })

  return NextResponse.json({
    incidente: { id: inc.rows[0].id, folio: inc.rows[0].folio, estatus: inc.rows[0].estatus },
    reporte: reporte.rows[0],
  })
}
