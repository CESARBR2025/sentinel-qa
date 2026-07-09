import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

const SOL_COLS = `id, enlace, oficio, fecha_activacion AS "fechaActivacion", autoridad, fiscal_solicita AS "fiscalSolicita", delito, carpeta_investigacion AS "carpetaInvestigacion", solicitud_texto AS "solicitudTexto", fecha_aceptacion AS "fechaAceptacion", status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn"`
const C4_COLS = `id, solicitud_id AS "solicitudId", descripcion_evidencias AS "descripcionEvidencias", status, creado_por AS "creadoPor", creado_en AS "creadoEn"`
const CONT_COLS = `id, solicitud_id AS "solicitudId", fecha_contestacion AS "fechaContestacion", archivo_pdf_url AS "archivoPdfUrl", fecha_entrega AS "fechaEntrega", hora_entrega AS "horaEntrega", nombre_quien_recibio AS "nombreQuienRecibio", creado_por AS "creadoPor", creado_en AS "creadoEn"`

const CAMPO_MAP: Record<string, string> = {
  enlace: 'enlace', oficio: 'oficio', fechaActivacion: 'fecha_activacion',
  autoridad: 'autoridad', fiscalSolicita: 'fiscal_solicita', delito: 'delito',
  carpetaInvestigacion: 'carpeta_investigacion', solicitudTexto: 'solicitud_texto',
  fechaAceptacion: 'fecha_aceptacion', status: 'status',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'ver')
  if (chequeo) return chequeo

  const { id } = await params

  const [solicitud, solicitudesC4, contestacion] = await Promise.all([
    query(`SELECT ${SOL_COLS} FROM solicitudes_informacion WHERE id = $1 LIMIT 1`, [id]).then(r => r.rows[0]),
    query(`SELECT ${C4_COLS} FROM solicitudes_c4_internas WHERE solicitud_id = $1 ORDER BY creado_en`, [id]).then(r => r.rows),
    query(`SELECT ${CONT_COLS} FROM contestaciones WHERE solicitud_id = $1 LIMIT 1`, [id]).then(r => r.rows[0]),
  ])

  if (!solicitud) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json({ solicitud, solicitudesC4, contestacion })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'editar')
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
  sets.push('actualizado_en = NOW()')

  const updated = await query(
    `UPDATE solicitudes_informacion SET ${sets.join(', ')} WHERE id = $1 RETURNING ${SOL_COLS}`,
    vals,
  )
  return NextResponse.json(updated.rows[0])
}
