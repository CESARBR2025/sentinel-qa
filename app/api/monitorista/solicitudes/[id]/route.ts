import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params

  const sol = await query<Record<string, unknown>>(
    `SELECT * FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`, [id],
  )
  if (!sol.rows[0]) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const evs = await query<Record<string, unknown>>(
    `SELECT e.id, e.tipo, e.nombre_original, e.url_expediente, u.name as subido_por_nombre, e.creado_en
     FROM evidencias e LEFT JOIN users u ON e.subido_por = u.id
     WHERE e.solicitud_id = $1 ORDER BY e.creado_en`, [id],
  )

  return NextResponse.json({ solicitud: sol.rows[0], evidencias: evs.rows })
}
