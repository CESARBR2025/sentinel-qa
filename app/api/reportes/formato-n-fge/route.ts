import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { listarFge, crearFge, obtenerFgePorFechaPeriodo, Periodo } from '@/lib/reportes/formato-n-fge-service'
import { verificarAccesoFormatoNApi } from '@/lib/reportes/permisos'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const { searchParams } = new URL(req.url)
  const periodo = searchParams.get('periodo') as Periodo | null

  const registros = await listarFge(periodo || undefined)
  return NextResponse.json(registros)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'crear')
  if (chequeo) return chequeo

  const body = await req.json()
  if (!body.fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  if (!body.periodo) return NextResponse.json({ error: 'Periodo requerido' }, { status: 400 })

  try {
    const id = await crearFge({
      fecha: body.fecha,
      periodo: body.periodo,
      capturado_por: session.user.id,
      carpetas_iniciadas: body.carpetas_iniciadas,
      numero_cateos: body.numero_cateos,
      vehiculos_asegurados: body.vehiculos_asegurados,
      domicilios_cateados: body.domicilios_cateados,
      personas_aseguradas: body.personas_aseguradas,
      aprehensiones: body.aprehensiones,
      audiencias_iniciales: body.audiencias_iniciales,
      abreviados: body.abreviados,
      audiencias_intermedias: body.audiencias_intermedias,
    })
    return NextResponse.json({ id }, { status: 201 })
  } catch (err: unknown) {
    const pgErr = err as { code?: string; message?: string }
    const isDuplicate = pgErr?.code === '23505' || (pgErr?.message || '').includes('duplicate key')
    if (isDuplicate) {
      const existente = await obtenerFgePorFechaPeriodo(body.fecha, body.periodo)
      return NextResponse.json({
        error: 'Ya existe un reporte FGE para esta fecha y periodo.',
        existenteId: existente?.id || null,
      }, { status: 409 })
    }
    return NextResponse.json({ error: pgErr?.message || 'Error desconocido' }, { status: 500 })
  }
}
