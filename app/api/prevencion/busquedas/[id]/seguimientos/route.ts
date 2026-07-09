import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()

  const created = await query(
    `INSERT INTO seguimientos_busqueda (ficha_id, tipo, fecha_hora_envio) VALUES ($1, $2, $3) RETURNING id, ficha_id AS "fichaId", tipo, fecha_hora_envio AS "fechaHoraEnvio", registrado_por AS "registradoPor", creado_en AS "creadoEn", archivo_url AS "archivoUrl"`,
    [id, body.tipo, body.fechaHoraEnvio ?? new Date()],
  )
  return NextResponse.json(created.rows[0], { status: 201 })
}
