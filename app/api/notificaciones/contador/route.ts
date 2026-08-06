import { NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { contarNoLeidas, criticaMasRecienteSinLeer } from '@/lib/notificaciones/repository'

// Endpoint del polling: devuelve el conteo y la crítica no leída más reciente
// (si hay una nueva). Sigue siendo barato — dos queries indexadas, sin
// escrituras — a propósito, porque es lo único que se ejecuta en cada
// intervalo. La lista completa se pide aparte, al abrir la campanita.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const usuario = await getUserWithRole(session.user.id)
  const rolId = usuario?.rolId ?? null

  const [noLeidas, critica] = await Promise.all([
    contarNoLeidas(session.user.id, rolId),
    criticaMasRecienteSinLeer(session.user.id, rolId),
  ])

  return NextResponse.json({ noLeidas, critica })
}
