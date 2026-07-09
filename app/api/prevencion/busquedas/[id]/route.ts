import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

const FICHA_COLS = `id, tipo, folio, enlace, fecha_activacion AS "fechaActivacion", carpeta_investigacion AS "carpetaInvestigacion", nombre_desaparecida AS "nombreDesaparecida", edad, fecha_aceptacion AS "fechaAceptacion", rt_atiende AS "rtAtiende", elemento_novedades AS "elementoNovedades", status, fecha_cancelacion AS "fechaCancelacion", fiscal_cancela AS "fiscalCancela", motivo_cancelacion AS "motivoCancelacion", creado_por AS "creadoPor", creado_en AS "creadoEn"`

const SEG_COLS = `id, ficha_id AS "fichaId", tipo, fecha_hora_envio AS "fechaHoraEnvio", registrado_por AS "registradoPor", creado_en AS "creadoEn", archivo_url AS "archivoUrl"`

const CAMPO_MAP: Record<string, string> = {
  tipo: 'tipo', folio: 'folio', enlace: 'enlace',
  fechaActivacion: 'fecha_activacion', carpetaInvestigacion: 'carpeta_investigacion',
  nombreDesaparecida: 'nombre_desaparecida', edad: 'edad',
  fechaAceptacion: 'fecha_aceptacion', rtAtiende: 'rt_atiende',
  elementoNovedades: 'elemento_novedades', status: 'status',
  fechaCancelacion: 'fecha_cancelacion', fiscalCancela: 'fiscal_cancela',
  motivoCancelacion: 'motivo_cancelacion',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'ver')
  if (chequeo) return chequeo

  const { id } = await params

  const [ficha, seguimientos] = await Promise.all([
    query(`SELECT ${FICHA_COLS} FROM fichas_busqueda WHERE id = $1 LIMIT 1`, [id]).then(r => r.rows[0]),
    query(`SELECT ${SEG_COLS} FROM seguimientos_busqueda WHERE ficha_id = $1 ORDER BY fecha_hora_envio`, [id]).then(r => r.rows),
  ])

  if (!ficha) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json({ ficha, seguimientos })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'busquedas', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()

  const sets: string[] = []
  const vals: unknown[] = [id]
  for (const [key, val] of Object.entries(body)) {
    const col = CAMPO_MAP[key]
    if (!col) continue
    sets.push(`${col} = $${vals.length + 1}`)
    vals.push(val)
  }

  const updated = await query(
    `UPDATE fichas_busqueda SET ${sets.join(', ')} WHERE id = $1 RETURNING ${FICHA_COLS}`,
    vals,
  )
  return NextResponse.json(updated.rows[0])
}