import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { query }   from '@/lib/db'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const p       = req.nextUrl.searchParams
  const canal   = p.get('canal')
  const estatus = p.get('estatus')
  const desde   = p.get('desde')
  const hasta   = p.get('hasta')
  const folio   = p.get('folio')

  const canalesPermitidos = ['911', 'whatsapp', 'radio']
  const estatusPermitidos = ['sin_despachar', 'en_despacho', 'atendido']

  if (canal   && !canalesPermitidos.includes(canal))   return NextResponse.json({ error: 'canal inválido' }, { status: 400 })
  if (estatus && !estatusPermitidos.includes(estatus)) return NextResponse.json({ error: 'estatus inválido' }, { status: 400 })

  const conditions: string[] = []
  const params: unknown[] = []
  if (canal)   { conditions.push(`i.canal = $${params.length + 1}`); params.push(canal) }
  if (estatus) { conditions.push(`i.estatus = $${params.length + 1}`); params.push(estatus) }
  if (desde)   { conditions.push(`i.fecha_hora_inicio >= $${params.length + 1}`); params.push(desde) }
  if (hasta)   { conditions.push(`i.fecha_hora_inicio <= $${params.length + 1}`); params.push(hasta) }
  if (folio)   { conditions.push(`i.folio ILIKE $${params.length + 1}`); params.push(`%${folio}%`) }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const lista = await query(
    `SELECT i.id, i.folio, i.canal, i.tipo_reporte AS "tipoReporte", i.estatus, i.fecha_hora_inicio AS "fechaHoraInicio", i.colonia, cti.nombre AS "tipoIncidente", cp.nombre AS prioridad, u.name AS "capturadoPor" FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN users u ON i.capturado_por = u.id ${where} ORDER BY i.creado_en DESC LIMIT 200`,
    params.length ? params : undefined,
  )

  return NextResponse.json(lista.rows)
}
