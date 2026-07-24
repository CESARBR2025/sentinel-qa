import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'
import { buscarOficialesPorNominaONombre } from '@/lib/oficial/repository'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const termino = new URL(req.url).searchParams.get('q')?.trim() ?? ''
  if (termino.length < 2) return NextResponse.json([])

  const resultados = await buscarOficialesPorNominaONombre(termino)
  return NextResponse.json(resultados)
}
