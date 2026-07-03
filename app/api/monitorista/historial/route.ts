import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { tienePermiso } from '@/lib/monitorista/permisos'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'historial', 'ver'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const p = req.nextUrl.searchParams
  const monitoristaId = p.get('monitoristaId') ?? session.user.id
  const desde = p.get('desde')
  const hasta = p.get('hasta')

  const filtros: string[] = []
  const params: unknown[] = []
  let idx = 1

  filtros.push(`mh.monitorista_id = $${idx++}`)
  params.push(monitoristaId)

  if (desde) {
    filtros.push(`mh.creado_en >= $${idx++}`)
    params.push(desde)
  }
  if (hasta) {
    filtros.push(`mh.creado_en <= $${idx++}`)
    params.push(hasta)
  }

  const result = await query<Record<string, unknown>>(
    `SELECT mh.id, mh.accion, mh.solicitud_id AS "solicitudId", mh.incidente_id AS "incidenteId",
            mh.creado_en AS "creadoEn", u.name AS "monitoristaNombre",
            se.folio_incidente AS "folioIncidente"
     FROM monitorista_historial mh
     LEFT JOIN users u ON mh.monitorista_id = u.id
     LEFT JOIN solicitudes_evidencia se ON mh.solicitud_id = se.id
     WHERE ${filtros.join(' AND ')}
     ORDER BY mh.creado_en DESC
     LIMIT 200`,
    params,
  )

  return NextResponse.json(result.rows)
}
