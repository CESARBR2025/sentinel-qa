import { NextRequest, NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { marcarLeidaParaUsuario, marcarTodasLeidasParaUsuario } from '@/lib/notificaciones/repository'

// POST { id } → marca una; POST { todas: true } → marca todas.
// El repositorio valida que la notificación sea del usuario o de su rol, así
// que nadie puede marcar como leídas las de otros.
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const usuario = await getUserWithRole(session.user.id)
  const rolId = usuario?.rolId ?? null

  const body = await req.json().catch(() => ({})) as { id?: string; todas?: boolean }

  if (body.todas) {
    await marcarTodasLeidasParaUsuario(session.user.id, rolId)
    return NextResponse.json({ ok: true })
  }

  if (!body.id) return NextResponse.json({ error: 'Falta id' }, { status: 400 })

  await marcarLeidaParaUsuario(body.id, session.user.id, rolId)
  return NextResponse.json({ ok: true })
}
