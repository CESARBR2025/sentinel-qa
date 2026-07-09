import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { listarHistorialConFiltros } from '@/lib/monitorista/repository'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  if (!(await tienePermiso(session.user.id, 'historial', 'ver'))) return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })

  const p = req.nextUrl.searchParams
  const monitoristaId = p.get('monitoristaId') ?? session.user.id
  const rows = await listarHistorialConFiltros({
    monitoristaId,
    desde: p.get('desde'),
    hasta: p.get('hasta'),
  })
  return NextResponse.json(rows)
}
