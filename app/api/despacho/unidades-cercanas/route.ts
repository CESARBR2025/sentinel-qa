import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'
import { listarUnidadesParaDespacho } from '@/lib/flota/service'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const prioritarioPatrullaId = searchParams.get('prioritarioPatrullaId')

  const lista = await listarUnidadesParaDespacho(
    lat !== null ? Number(lat) : null,
    lng !== null ? Number(lng) : null,
    prioritarioPatrullaId,
  )

  return NextResponse.json(lista)
}
