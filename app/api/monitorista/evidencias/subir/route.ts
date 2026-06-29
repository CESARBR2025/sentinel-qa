import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { obtenerGuestToken, subirArchivoExpediente } from '@/lib/monitorista/expediente'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File
  const p = new URL(req.url).searchParams
  const solicitudId = p.get('solicitudId')!
  const incidenteId = p.get('incidenteId')!
  const tipo = p.get('tipo') ?? 'foto'
  const nombreOriginal = p.get('nombreOriginal') ?? file.name

  if (!solicitudId || !incidenteId || !file || file.size === 0) {
    return NextResponse.json({ error: 'Datos insuficientes' }, { status: 400 })
  }

  const solResult = await query<Record<string, unknown>>(
    `SELECT id, folio_incidente AS "folioIncidente" FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`,
    [solicitudId],
  )
  const sol = solResult.rows[0] as { id: string; folioIncidente: string } | undefined

  if (!sol) return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const folio = sol.folioIncidente ?? incidenteId.substring(0, 8)
  const token = await obtenerGuestToken(session.user.name || 'Monitorista')
  const url = await subirArchivoExpediente(token, { buffer, nombre: nombreOriginal, tipo: file.type }, folio, `EVIDENCIA_${tipo.toUpperCase()}`)

  const evResult = await query<Record<string, unknown>>(
    `INSERT INTO evidencias (solicitud_id, incidente_id, tipo, nombre_original, url_expediente, subido_por)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [solicitudId, incidenteId, tipo, nombreOriginal, url, session.user.id],
  )
  const ev = evResult.rows[0]

  await query(
    `INSERT INTO monitorista_historial (monitorista_id, accion, solicitud_id, incidente_id) VALUES ($1, $2, $3, $4)`,
    [session.user.id, 'evidencia_subida', solicitudId, incidenteId],
  )

  return NextResponse.json(ev, { status: 201 })
}
