import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

const SOL_COLS = `id, enlace, oficio, fecha_activacion AS "fechaActivacion", autoridad, fiscal_solicita AS "fiscalSolicita", delito, carpeta_investigacion AS "carpetaInvestigacion", solicitud_texto AS "solicitudTexto", fecha_aceptacion AS "fechaAceptacion", status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn"`

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'ver')
  if (chequeo) return chequeo

  const search = request.nextUrl.searchParams
  const status = search.get('status')
  const autoridad = search.get('autoridad')

  const conditions: string[] = []
  const params: unknown[] = []
  if (status) { conditions.push(`status = $${params.length + 1}`); params.push(status) }
  if (autoridad) { conditions.push(`autoridad = $${params.length + 1}`); params.push(autoridad) }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = await query(`SELECT ${SOL_COLS} FROM solicitudes_informacion ${where} ORDER BY fecha_activacion`, params.length ? params : undefined)
  return NextResponse.json(rows.rows)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'solicitudes', 'crear')
  if (chequeo) return chequeo

  const body = await request.json()

  const created = await query(
    `INSERT INTO solicitudes_informacion (enlace, oficio, fecha_activacion, autoridad, fiscal_solicita, delito, carpeta_investigacion, solicitud_texto, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING ${SOL_COLS}`,
    [body.enlace, body.oficio, body.fechaActivacion ?? new Date(), body.autoridad, body.fiscalSolicita, body.delito, body.carpetaInvestigacion, body.solicitudTexto, body.status ?? 'en_juridico'],
  )
  return NextResponse.json(created.rows[0], { status: 201 })
}
