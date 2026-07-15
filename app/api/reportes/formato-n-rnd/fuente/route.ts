import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { buscarDetencionesPorRango } from '@/lib/reportes/formato-n-rnd-service'
import { verificarAccesoFormatoNApi } from '@/lib/reportes/permisos'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoFormatoNApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const { searchParams } = new URL(req.url)
  const fechaInicio = searchParams.get('fecha_inicio')
  const fechaFin = searchParams.get('fecha_fin')
  if (!fechaInicio || !fechaFin) return NextResponse.json({ error: 'Rango de fechas requerido' }, { status: 400 })
  if (fechaInicio > fechaFin) return NextResponse.json({ error: 'La fecha inicial debe ser anterior a la final' }, { status: 400 })

  const candidatos = await buscarDetencionesPorRango(fechaInicio, fechaFin)
  return NextResponse.json(candidatos)
}
