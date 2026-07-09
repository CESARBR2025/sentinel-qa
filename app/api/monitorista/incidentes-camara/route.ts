import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarRegistros, crearRegistro, Turno, obtenerRegistroPorFechaTurno } from '@/lib/monitorista/incidentes-camara-service'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { insertHistorial } from '@/lib/monitorista/repository'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'incidentes_camara', 'ver'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const turno = searchParams.get('turno') as Turno | null

  const registros = await listarRegistros(turno || undefined)
  return NextResponse.json(registros)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'incidentes_camara', 'crear'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const body = await req.json()

  if (!body.fecha) {
    return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  }
  if (!body.turno) {
    return NextResponse.json({ error: 'Turno requerido' }, { status: 400 })
  }

  try {
    const id = await crearRegistro({
      fecha: body.fecha,
      turno: body.turno,
      registradoPor: session.user.id,
      personasSinNovedad: body.personas_sin_novedad,
      personasConAntecedentes: body.personas_con_antecedentes,
      totalPersonasRevisadas: body.total_personas_revisadas,
      vehiculosRevisar: body.vehiculos_revisar,
      vehiculosRepuve: body.vehiculos_repuve,
      motosRevisadas: body.motos_revisadas,
      persecuciones: body.persecuciones,
      aseguradosCamara: body.asegurados_camara,
      vehiculosRecuperados: body.vehiculos_recuperados,
      incendios: body.incendios,
      hechosTransito: body.hechos_transito,
    })

    await insertHistorial(session.user.id, 'incidente_creado', id)

    return NextResponse.json({ id }, { status: 201 })
  } catch (err: unknown) {
    const pgErr = err as { code?: string; message?: string }
    const isDuplicate = pgErr?.code === '23505'
      || (pgErr?.message || '').includes('duplicate key')
      || (pgErr?.message || '').includes('unicidad')
    if (isDuplicate) {
      const existente = await obtenerRegistroPorFechaTurno(body.fecha, body.turno)
      return NextResponse.json({
        error: 'Ya existe un registro para esta fecha y turno.',
        existenteId: existente?.id || null,
      }, { status: 409 })
    }
    return NextResponse.json({ error: pgErr?.message || 'Error desconocido' }, { status: 500 })
  }
}
