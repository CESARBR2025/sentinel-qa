import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

const MEDIDA_COLS = `id, expediente, n_oficio AS "nOficio", fecha_oficio AS "fechaOficio", fecha_recepcion AS "fechaRecepcion", persona_recepciona AS "personaRecepciona", autoridad, nombre_autoridad AS "nombreAutoridad", delitos, victima, demandado, tipo_medida AS "tipoMedida", domicilio_proteccion AS "domicilioProteccion", colonia, telefono, tiempo_medida AS "tiempoMedida", fecha_vencimiento AS "fechaVencimiento", tipo_apercibimiento AS "tipoApercibimiento", enlace, observaciones, status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn", prorrogada, archivo_prorroga_url AS "archivoProrrogaUrl"`

const VISITA_COLS = `id, medida_id AS "medidaId", fecha_visita AS "fechaVisita", hora_visita AS "horaVisita", resultado, apercibimiento_aplicado AS "apercibimientoAplicado", registrado_por AS "registradoPor", creado_en AS "creadoEn"`

const CAMPO_MAP: Record<string, string> = {
  expediente: 'expediente', nOficio: 'n_oficio', fechaOficio: 'fecha_oficio',
  fechaRecepcion: 'fecha_recepcion', personaRecepciona: 'persona_recepciona',
  autoridad: 'autoridad', nombreAutoridad: 'nombre_autoridad', delitos: 'delitos',
  victima: 'victima', demandado: 'demandado', tipoMedida: 'tipo_medida',
  domicilioProteccion: 'domicilio_proteccion', colonia: 'colonia', telefono: 'telefono',
  tiempoMedida: 'tiempo_medida', fechaVencimiento: 'fecha_vencimiento',
  tipoApercibimiento: 'tipo_apercibimiento', enlace: 'enlace', observaciones: 'observaciones',
  status: 'status', prorrogada: 'prorrogada', archivoProrrogaUrl: 'archivo_prorroga_url',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'ver')
  if (chequeo) return chequeo

  const { id } = await params

  const [medida, visitas] = await Promise.all([
    query(`SELECT ${MEDIDA_COLS} FROM medidas_proteccion WHERE id = $1 LIMIT 1`, [id]).then(r => r.rows[0]),
    query(`SELECT ${VISITA_COLS} FROM visitas_domiciliarias WHERE medida_id = $1 ORDER BY fecha_visita`, [id]).then(r => r.rows),
  ])

  if (!medida) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  return NextResponse.json({ medida, visitas })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'editar')
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
    `UPDATE medidas_proteccion SET ${sets.join(', ')} WHERE id = $1 RETURNING ${MEDIDA_COLS}`,
    vals,
  )

  return NextResponse.json(updated.rows[0])
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'editar')
  if (chequeo) return chequeo

  const { id } = await params
  const body = await request.json()

  const updated = await query(
    `UPDATE medidas_proteccion SET status = $2, actualizado_en = $3 WHERE id = $1 RETURNING ${MEDIDA_COLS}`,
    [id, body.status, new Date().toISOString()],
  )

  return NextResponse.json(updated.rows[0])
}