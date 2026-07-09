import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { query }   from '@/lib/db'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'

export async function GET(_req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const lista = await query(
    `SELECT i.id, i.folio, i.canal, i.estatus, i.fecha_hora_inicio AS "fechaHoraInicio", i.calle, i.colonia, i.descripcion, cti.nombre AS "tipoIncidente", cp.nombre AS prioridad, u.name AS "capturadoPor", d.id AS "despachoId", d.fecha_hora_despacho AS "fechaHoraDespacho", rc.acciones_realizadas AS "accionesRealizadas", rc.hay_detencion AS "hayDetencion" FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN users u ON i.capturado_por = u.id LEFT JOIN incidente_despacho d ON i.id = d.incidente_id LEFT JOIN incidente_reporte_campo rc ON i.id = rc.incidente_id WHERE i.estatus = 'atendido' ORDER BY i.creado_en DESC LIMIT 100`,
  )

  const resultado = await Promise.all(lista.rows.map(async (inc: Record<string, unknown>) => {
    if (!inc.despachoId) return { ...inc, unidades: [], elementos: [] }
    const [unidades, elementos] = await Promise.all([
      query(`SELECT unidad_placa AS placa FROM incidente_despacho_unidades WHERE despacho_id = $1`, [inc.despachoId]),
      query(`SELECT elemento_nombre AS nombre, elemento_nomina AS nomina FROM incidente_despacho_elementos WHERE despacho_id = $1`, [inc.despachoId]),
    ])
    return { ...inc, unidades: unidades.rows, elementos: elementos.rows }
  }))

  return NextResponse.json(resultado)
}
