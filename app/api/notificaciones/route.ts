import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { listarParaUsuario, contarNoLeidas } from '@/lib/notificaciones/repository'

// Sólo lectura. La generación de alertas de plazo vive ahora en
// /api/cron/notificaciones: antes corría aquí en cada GET y, con el polling del
// cliente, escaneaba fichas_busqueda cada 2 minutos por usuario conectado.
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const usuario = await getUserWithRole(session.user.id)
  const rolId = usuario?.rolId ?? null

  const p = req.nextUrl.searchParams
  const limite = Math.min(Math.max(Number(p.get('limite') ?? 20), 1), 100)
  const offset = Math.max(Number(p.get('offset') ?? 0), 0)
  const soloNoLeidas = p.get('soloNoLeidas') === 'true'

  const [notificaciones, noLeidas] = await Promise.all([
    listarParaUsuario(session.user.id, rolId, { limite, offset, soloNoLeidas }),
    contarNoLeidas(session.user.id, rolId),
  ])

  return NextResponse.json({ notificaciones, noLeidas })
}
