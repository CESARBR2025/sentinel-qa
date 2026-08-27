import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { obtenerEstatusRango } from '@/lib/novedades/estatus'
import { verificarAccesoNovedadesApi } from '@/lib/reportes/permisos'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoNovedadesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const desde = req.nextUrl.searchParams.get('desde')
  const hasta = req.nextUrl.searchParams.get('hasta')
  if (!desde || !hasta) return NextResponse.json({ error: 'desde y hasta requeridos' }, { status: 400 })

  const rows = await obtenerEstatusRango(desde, hasta)
  return NextResponse.json(rows)
}
