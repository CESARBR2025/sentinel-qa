import { NextResponse } from 'next/server'
import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { contarNoLeidas } from '@/lib/notificaciones/repository'

// Endpoint del polling: devuelve sólo el conteo. Es una única query indexada,
// sin escrituras — a propósito, porque es lo único que se ejecuta en cada
// intervalo. La lista completa se pide aparte, al abrir la campanita.
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const usuario = await getUserWithRole(session.user.id)
  const noLeidas = await contarNoLeidas(session.user.id, usuario?.rolId ?? null)

  return NextResponse.json({ noLeidas })
}
