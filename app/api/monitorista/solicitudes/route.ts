import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const status = req.nextUrl.searchParams.get('status')
  const statuses = ['pendiente', 'completada', 'cancelada']
  const filtro = status && statuses.includes(status) ? `WHERE status = '${status}'` : ''

  const lista = await query<Record<string, unknown>>(
    `SELECT id, incidente_id, folio_incidente, solicitado_nombre, descripcion, status, creado_en, completado_en,
     (SELECT count(*)::int FROM evidencias WHERE evidencias.solicitud_id = solicitudes_evidencia.id) as total_evidencias
     FROM solicitudes_evidencia ${filtro} ORDER BY creado_en DESC LIMIT 100`,
  )
  return NextResponse.json(lista.rows)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const r = await query<{ id: string }>(
    `INSERT INTO solicitudes_evidencia (incidente_id, folio_incidente, solicitado_por, solicitado_nombre, descripcion)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [body.incidenteId, body.folioIncidente || null, session.user.id, session.user.name || 'Usuario', body.descripcion],
  )
  return NextResponse.json({ id: r.rows[0].id }, { status: 201 })
}
