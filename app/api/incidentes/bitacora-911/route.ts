import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { verificarAccesoIncidentesApi } from '@/lib/incidentes/permisos'
import { getIncidentesPaginados, getConteoCanalizacion } from '@/lib/911/service'

// Endpoint de polling de la bitácora 911: devuelve el listado paginado del canal
// + los conteos por canalización para refrescar el segment y la tabla sin recargar.
// Mismo patrón de los endpoints de despacho (TablonDespacho).
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const chequeo = await verificarAccesoIncidentesApi(session.user.id, 'ver')
  if (chequeo) return chequeo

  const p = req.nextUrl.searchParams
  const canal = p.get('canal') ?? '911'
  const canalizacion = p.get('canalizacion') ?? ''
  const page = Math.max(1, Number(p.get('page')) || 1)
  const pageSize = 10

  const canalesPermitidos = ['911', 'whatsapp', 'radio']
  const filtrosPermitidos = ['canalizados', 'sin_canalizacion']

  if (!canalesPermitidos.includes(canal)) return NextResponse.json({ error: 'canal inválido' }, { status: 400 })
  if (canalizacion && !filtrosPermitidos.includes(canalizacion)) return NextResponse.json({ error: 'canalizacion inválido' }, { status: 400 })

  const { rows, total } = await getIncidentesPaginados(canal, page, pageSize, (canalizacion || null) as 'canalizados' | 'sin_canalizacion' | null)
  const totalPages = Math.ceil(total / pageSize)

  const conteosArr = await getConteoCanalizacion(canal)
  const conteos = Object.fromEntries(conteosArr.map(c => [c.clave, c.count]))
  const totalGeneral = conteosArr.reduce((s, c) => s + c.count, 0)

  return NextResponse.json({ rows, total, totalPages, conteos, totalGeneral })
}
