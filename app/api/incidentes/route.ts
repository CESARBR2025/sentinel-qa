import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'
import { listarIncidentesConFiltros } from '@/lib/incidentes/repository'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const p       = req.nextUrl.searchParams
  const canal   = p.get('canal')
  const estatus = p.get('estatus')
  const desde   = p.get('desde')
  const hasta   = p.get('hasta')
  const folio   = p.get('folio')

  const canalesPermitidos = ['911', 'whatsapp', 'radio']
  const estatusPermitidos = ['sin_despachar', 'en_despacho', 'en_sitio', 'atendido', 'cerrado_detencion']

  if (canal   && !canalesPermitidos.includes(canal))   return NextResponse.json({ error: 'canal inválido' }, { status: 400 })
  if (estatus && !estatusPermitidos.includes(estatus)) return NextResponse.json({ error: 'estatus inválido' }, { status: 400 })

  const lista = await listarIncidentesConFiltros({ canal, estatus, desde, hasta, folio })

  return NextResponse.json(lista)
}
