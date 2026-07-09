import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { query } from '@/lib/db'
import { verificarAccesoPrevencionApi } from '@/lib/prevencion/permisos'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'ver')
  if (chequeo) return chequeo

  const search = request.nextUrl.searchParams
  const autoridad = search.get('autoridad')
  const status = search.get('status')

  const conditions: string[] = []
  const params: unknown[] = []
  if (autoridad) { conditions.push(`autoridad = $${params.length + 1}`); params.push(autoridad) }
  if (status) { conditions.push(`status = $${params.length + 1}`); params.push(status) }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = await query(
    `SELECT id, expediente, n_oficio AS "nOficio", fecha_oficio AS "fechaOficio", fecha_recepcion AS "fechaRecepcion", persona_recepciona AS "personaRecepciona", autoridad, nombre_autoridad AS "nombreAutoridad", delitos, victima, demandado, tipo_medida AS "tipoMedida", domicilio_proteccion AS "domicilioProteccion", colonia, telefono, tiempo_medida AS "tiempoMedida", fecha_vencimiento AS "fechaVencimiento", tipo_apercibimiento AS "tipoApercibimiento", enlace, observaciones, status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn", prorrogada, archivo_prorroga_url AS "archivoProrrogaUrl" FROM medidas_proteccion ${where} ORDER BY fecha_vencimiento`,
    params.length ? params : undefined,
  )
  return NextResponse.json(rows.rows)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoPrevencionApi(session.user.id, 'medidas', 'crear')
  if (chequeo) return chequeo

  const body = await request.json()

  const created = await query(
    `INSERT INTO medidas_proteccion (expediente, n_oficio, fecha_oficio, fecha_recepcion, persona_recepciona, autoridad, nombre_autoridad, delitos, victima, demandado, tipo_medida, domicilio_proteccion, colonia, telefono, tiempo_medida, fecha_vencimiento, tipo_apercibimiento, enlace, observaciones) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING id, expediente, n_oficio AS "nOficio", fecha_oficio AS "fechaOficio", fecha_recepcion AS "fechaRecepcion", persona_recepciona AS "personaRecepciona", autoridad, nombre_autoridad AS "nombreAutoridad", delitos, victima, demandado, tipo_medida AS "tipoMedida", domicilio_proteccion AS "domicilioProteccion", colonia, telefono, tiempo_medida AS "tiempoMedida", fecha_vencimiento AS "fechaVencimiento", tipo_apercibimiento AS "tipoApercibimiento", enlace, observaciones`,
    [body.expediente, body.nOficio, body.fechaOficio, body.fechaRecepcion, body.personaRecepciona, body.autoridad, body.nombreAutoridad, body.delitos, body.victima, body.demandado, body.tipoMedida, body.domicilioProteccion, body.colonia, body.telefono, body.tiempoMedida, body.fechaVencimiento, body.tipoApercibimiento, body.enlace, body.observaciones],
  )

  return NextResponse.json(created.rows[0], { status: 201 })
}