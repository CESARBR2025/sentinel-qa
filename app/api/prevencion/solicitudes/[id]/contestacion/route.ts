import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

const CONT_COLS = `id, solicitud_id AS "solicitudId", fecha_contestacion AS "fechaContestacion", archivo_pdf_url AS "archivoPdfUrl", fecha_entrega AS "fechaEntrega", hora_entrega AS "horaEntrega", nombre_quien_recibio AS "nombreQuienRecibio", creado_por AS "creadoPor", creado_en AS "creadoEn"`

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()

  const created = await query(
    `INSERT INTO contestaciones (solicitud_id, fecha_contestacion, archivo_pdf_url, fecha_entrega, hora_entrega, nombre_quien_recibio) VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${CONT_COLS}`,
    [id, body.fechaContestacion, body.archivoPdfUrl, body.fechaEntrega, body.horaEntrega, body.nombreQuienRecibio],
  )

  await query(
    `UPDATE solicitudes_informacion SET status = 'completado', actualizado_en = $2 WHERE id = $1`,
    [id, new Date().toISOString()],
  )

  return NextResponse.json(created.rows[0], { status: 201 })
}
