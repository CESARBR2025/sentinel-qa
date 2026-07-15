import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'
import { obtenerIncidenteBasico, obtenerDespachoDeIncidente, obtenerUnidadesDeDespacho, obtenerElementosDeDespacho } from '@/lib/incidentes/repository'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const { id } = await params

  const incidente = await obtenerIncidenteBasico(id)
  if (!incidente) return NextResponse.json({ error: 'Incidente no encontrado' }, { status: 404 })

  const despacho = await obtenerDespachoDeIncidente(id)
  if (!despacho) return NextResponse.json({ error: 'Este incidente no tiene despacho asignado' }, { status: 404 })

  const [unidades, elementos] = await Promise.all([
    obtenerUnidadesDeDespacho(despacho.id),
    obtenerElementosDeDespacho(despacho.id),
  ])

  return NextResponse.json({
    incidente,
    despacho: { ...despacho, unidades, elementos },
  })
}
