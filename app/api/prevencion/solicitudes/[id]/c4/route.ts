import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

const C4_COLS = `id, solicitud_id AS "solicitudId", descripcion_evidencias AS "descripcionEvidencias", status, creado_por AS "creadoPor", creado_en AS "creadoEn"`

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
    `INSERT INTO solicitudes_c4_internas (solicitud_id, descripcion_evidencias, status) VALUES ($1, $2, 'pendiente') RETURNING ${C4_COLS}`,
    [id, body.descripcionEvidencias],
  )
  return NextResponse.json(created.rows[0], { status: 201 })
}
