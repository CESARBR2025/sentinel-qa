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
    `SELECT i.id, i.folio, i.canal, i.fecha_hora_inicio AS "fechaHoraInicio", i.calle, i.colonia, i.entre_calles AS "entreCalles", i.referencia_ubicacion AS "referenciaUbicacion", i.descripcion, cti.nombre AS "tipoIncidente", cp.nombre AS prioridad, cp.orden AS "prioridadOrden", u.name AS "capturadoPor" FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN users u ON i.capturado_por = u.id WHERE i.estatus = 'sin_despachar' AND i.requiere_despacho = true ORDER BY cp.orden, i.fecha_hora_inicio DESC`,
  )

  return NextResponse.json(lista.rows)
}
