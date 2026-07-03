import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { buscarIncidentesPorFecha } from '@/lib/reportes/formato-n-eventos-service'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const fecha = searchParams.get('fecha')
  if (!fecha) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })

  const candidatos = await buscarIncidentesPorFecha(fecha)
  return NextResponse.json(candidatos)
}
