import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { crearSolicitud, listarPendientes, listarCompletadas } from '@/lib/monitorista/detenido-service'
import { query } from '@/lib/db'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const [pendientes, completadas] = await Promise.all([listarPendientes(), listarCompletadas()])
  return NextResponse.json({ pendientes, completadas })
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  if (!body.nombre_detenido || !body.folio) {
    return NextResponse.json({ error: 'nombre_detenido y folio requeridos' }, { status: 400 })
  }

  const id = await crearSolicitud({
    nombre_detenido: body.nombre_detenido,
    folio: body.folio,
    tipo_evento: body.tipo_evento || null,
    delitos: body.delitos || null,
    falta_admin: body.falta_admin || null,
    modus_operandi: body.modus_operandi || null,
    solicitado_por: session.user.id,
  })

  await query(
    `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id) VALUES ($1,'evidencia_subida',$2)`,
    [session.user.id, id],
  )

  return NextResponse.json({ id }, { status: 201 })
}
