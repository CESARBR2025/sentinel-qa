import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'
import { getKpiGeo } from '@/lib/incidentes/service'

function aEntero(valor: string | null): number | null {
  if (!valor) return null
  const n = Number(valor)
  return Number.isFinite(n) ? n : null
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const p       = req.nextUrl.searchParams
  const desde   = p.get('desde')
  const hasta   = p.get('hasta')
  const canal   = p.get('canal')
  const estatus = p.get('estatus')

  const canalesPermitidos = ['911', 'whatsapp', 'radio']
  const estatusPermitidos = ['sin_despachar', 'en_despacho', 'en_sitio', 'atendido', 'cerrado_detencion']

  if (canal   && !canalesPermitidos.includes(canal))   return NextResponse.json({ error: 'canal inválido' }, { status: 400 })
  if (estatus && !estatusPermitidos.includes(estatus)) return NextResponse.json({ error: 'estatus inválido' }, { status: 400 })

  const data = await getKpiGeo({
    desde: desde ?? undefined,
    hasta: hasta ?? undefined,
    canal,
    estatus,
    prioridadId: aEntero(p.get('prioridadId')),
    tipoIncidenteId: aEntero(p.get('tipoIncidenteId')),
  })

  return NextResponse.json(data)
}
