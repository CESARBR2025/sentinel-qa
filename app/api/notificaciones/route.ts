import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { generarAlertasBusquedas } from '@/lib/notificaciones/checker'
import { listarNotificacionesNoLeidas } from '@/lib/notificaciones/repository'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  await generarAlertasBusquedas(session.user.id)

  const notifs = await listarNotificacionesNoLeidas(session.user.id)
  return NextResponse.json(notifs)
}
