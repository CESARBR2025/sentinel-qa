'use server'

import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole } from '@/lib/auth/helpers'
import { tryActionRaw } from '@/lib/error-handler'
import { marcarLeidaParaUsuario, marcarTodasLeidasParaUsuario } from './repository'

/**
 * Usuario en sesión junto con su rol. El rol es la audiencia: una notificación
 * dirigida a un rol la ven todos sus integrantes, cada uno con su propio
 * estado de lectura.
 */
export async function sesionConRol(): Promise<{ userId: string; rolId: number | null } | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  const usuario = await getUserWithRole(session.user.id)
  return { userId: session.user.id, rolId: usuario?.rolId ?? null }
}

export async function marcarLeida(notifId: string) {
  const ctx = await sesionConRol()
  if (!ctx) return
  await tryActionRaw(async () => {
    await marcarLeidaParaUsuario(notifId, ctx.userId, ctx.rolId)
  })
}

export async function marcarTodasLeidas() {
  const ctx = await sesionConRol()
  if (!ctx) return
  await tryActionRaw(async () => {
    await marcarTodasLeidasParaUsuario(ctx.userId, ctx.rolId)
  })
}
