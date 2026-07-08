'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { revalidatePath } from 'next/cache'
import { query }          from '@/lib/db'
import { generarAlertasBusquedas } from './checker'

export async function marcarLeida(notifId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return

  await query(
    `UPDATE notificaciones SET leida = true WHERE id = $1 AND user_id = $2`,
    [notifId, session.user.id],
  )

  revalidatePath('/prevencion')
}

export async function marcarTodasLeidas() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return

  await query(
    `UPDATE notificaciones SET leida = true WHERE user_id = $1`,
    [session.user.id],
  )

  revalidatePath('/prevencion')
}

export async function generarAlertasDebug() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return

  await query(
    `DELETE FROM notificaciones WHERE user_id = $1 AND tipo = 'busqueda_plazo'`,
    [session.user.id],
  )

  await generarAlertasBusquedas(session.user.id, true)
}
