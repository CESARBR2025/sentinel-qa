import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

const VISITA_COLS = `id, medida_id AS "medidaId", fecha_visita AS "fechaVisita", hora_visita AS "horaVisita", resultado, apercibimiento_aplicado AS "apercibimientoAplicado", registrado_por AS "registradoPor", creado_en AS "creadoEn"`

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'ver')
  if (chequeo) return chequeo

  const { id } = await params
  const visitas = await query(
    `SELECT ${VISITA_COLS} FROM visitas_domiciliarias WHERE medida_id = $1 ORDER BY fecha_visita`,
    [id],
  )
  return NextResponse.json(visitas.rows)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()

  const created = await query(
    `INSERT INTO visitas_domiciliarias (medida_id, fecha_visita, hora_visita, resultado, apercibimiento_aplicado) VALUES ($1,$2,$3,$4,$5) RETURNING ${VISITA_COLS}`,
    [id, body.fechaVisita, body.horaVisita, body.resultado, body.apercibimientoAplicado ?? false],
  )
  return NextResponse.json(created.rows[0], { status: 201 })
}