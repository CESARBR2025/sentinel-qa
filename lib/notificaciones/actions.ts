'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { revalidatePath } from 'next/cache'
import { db }             from '@/lib/db/index'
import { notificaciones } from '@/lib/db/schema'
import { eq, and }        from 'drizzle-orm'
import { generarAlertasBusquedas } from './checker'

export async function marcarLeida(notifId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return

  await db.update(notificaciones)
    .set({ leida: true })
    .where(and(eq(notificaciones.id, notifId), eq(notificaciones.userId, session.user.id)))

  revalidatePath('/prevencion')
}

export async function marcarTodasLeidas() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return

  await db.update(notificaciones)
    .set({ leida: true })
    .where(eq(notificaciones.userId, session.user.id))

  revalidatePath('/prevencion')
}

export async function generarAlertasDebug() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return

  // Delete existing unread to re-generate fresh (debug mode)
  await db.delete(notificaciones)
    .where(and(
      eq(notificaciones.userId, session.user.id),
      eq(notificaciones.tipo, 'busqueda_plazo'),
    ))

  await generarAlertasBusquedas(session.user.id, true)
}
