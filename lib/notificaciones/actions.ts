'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { revalidatePath } from 'next/cache'
import { generarAlertasBusquedas } from './checker'
import { marcarNotificacionLeida, marcarTodasNotificacionesLeidas, eliminarAlertasBusqueda } from './repository'

export async function marcarLeida(notifId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return

  await marcarNotificacionLeida(notifId, session.user.id)

  revalidatePath('/prevencion')
}

export async function marcarTodasLeidas() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return

  await marcarTodasNotificacionesLeidas(session.user.id)

  revalidatePath('/prevencion')
}

export async function generarAlertasDebug() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return

  await eliminarAlertasBusqueda(session.user.id)

  await generarAlertasBusquedas(session.user.id, true)
}
