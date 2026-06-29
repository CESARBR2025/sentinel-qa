import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const action: string = body.action ?? 'completar'

  if (!['completar', 'cancelar'].includes(action)) {
    return NextResponse.json({ error: 'Acción inválida' }, { status: 400 })
  }

  const solResult = await query<Record<string, unknown>>(
    `SELECT id, status, incidente_id AS "incidenteId" FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`,
    [id],
  )
  const sol = solResult.rows[0] as { id: string; status: string; incidenteId: string } | undefined

  if (!sol) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
  if (sol.status !== 'pendiente') return NextResponse.json({ error: 'La solicitud no está pendiente' }, { status: 400 })

  const newStatus = action === 'completar' ? 'completada' : 'cancelada'
  const historialAccion = action === 'completar' ? 'solicitud_completada' : 'solicitud_cancelada'

  if (action === 'completar') {
    await query(
      `UPDATE solicitudes_evidencia SET status = $1, completado_en = NOW() WHERE id = $2`,
      [newStatus, id],
    )
  } else {
    await query(
      `UPDATE solicitudes_evidencia SET status = $1, completado_en = NULL WHERE id = $2`,
      [newStatus, id],
    )
  }

  await query(
    `INSERT INTO monitorista_historial (monitorista_id, accion, solicitud_id, incidente_id) VALUES ($1, $2, $3, $4)`,
    [session.user.id, historialAccion, id, sol.incidenteId],
  )

  return NextResponse.json({ status: newStatus })
}
