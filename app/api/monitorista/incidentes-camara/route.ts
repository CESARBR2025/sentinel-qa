import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarRegistros, crearRegistro } from '@/lib/monitorista/incidentes-camara-service'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const registros = await listarRegistros()
  return NextResponse.json(registros)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()

  if (!body.fecha) {
    return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  }

  const id = await crearRegistro({
    fecha: body.fecha,
    registrado_por: session.user.id,
    personas_sin_novedad: body.personas_sin_novedad,
    personas_con_antecedentes: body.personas_con_antecedentes,
    total_personas_revisadas: body.total_personas_revisadas,
    vehiculos_revisar: body.vehiculos_revisar,
    vehiculos_repuve: body.vehiculos_repuve,
    motos_revisadas: body.motos_revisadas,
    persecuciones: body.persecuciones,
    asegurados_camara: body.asegurados_camara,
    vehiculos_recuperados: body.vehiculos_recuperados,
    incendios: body.incendios,
    hechos_transito: body.hechos_transito,
  })

  return NextResponse.json({ id }, { status: 201 })
}
