import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

const FICHA_COLS = `id, tipo, folio, enlace, fecha_activacion AS "fechaActivacion", carpeta_investigacion AS "carpetaInvestigacion", nombre_desaparecida AS "nombreDesaparecida", edad, fecha_aceptacion AS "fechaAceptacion", rt_atiende AS "rtAtiende", elemento_novedades AS "elementoNovedades", status, fecha_cancelacion AS "fechaCancelacion", fiscal_cancela AS "fiscalCancela", motivo_cancelacion AS "motivoCancelacion", creado_por AS "creadoPor", creado_en AS "creadoEn"`

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'ver')
  if (chequeo) return chequeo

  const search = request.nextUrl.searchParams
  const tipo = search.get('tipo')
  const status = search.get('status')

  const conditions: string[] = []
  const params: unknown[] = []
  if (tipo) { conditions.push(`tipo = $${params.length + 1}`); params.push(tipo) }
  if (status) { conditions.push(`status = $${params.length + 1}`); params.push(status) }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = await query(`SELECT ${FICHA_COLS} FROM fichas_busqueda ${where} ORDER BY fecha_activacion`, params.length ? params : undefined)
  return NextResponse.json(rows.rows)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'crear')
  if (chequeo) return chequeo

  const body = await request.json()

  const created = await query(
    `INSERT INTO fichas_busqueda (tipo, folio, enlace, fecha_activacion, carpeta_investigacion, nombre_desaparecida, edad, fecha_aceptacion, rt_atiende, elemento_novedades) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING ${FICHA_COLS}`,
    [body.tipo, body.folio, body.enlace, body.fechaActivacion, body.carpetaInvestigacion, body.nombreDesaparecida, body.edad, body.fechaAceptacion, body.rtAtiende, body.elementoNovedades],
  )
  return NextResponse.json(created.rows[0], { status: 201 })
}
