'use server'

import { headers } from 'next/headers'
import { sesionConRol } from '@/lib/notificaciones/actions'
import { tryActionRaw } from '@/lib/error-handler'
import { guardarSuscripcion, eliminarSuscripcion, tieneSuscripcion } from './repository'
import type { SuscripcionCliente } from './types'

export async function suscribirPush(sub: SuscripcionCliente) {
  const ctx = await sesionConRol()
  console.debug('[push:server] suscribirPush — sesión encontrada =', !!ctx, ctx ? `userId=${ctx.userId}` : '(sin sesión — NO se va a guardar nada)')
  if (!ctx) return
  const userAgent = (await headers()).get('user-agent')
  await tryActionRaw(async () => {
    await guardarSuscripcion(ctx.userId, sub, userAgent)
    console.debug('[push:server] suscribirPush — guardarSuscripcion() OK para endpoint', sub.endpoint)
  })
}

export async function desuscribirPush(endpoint: string) {
  await tryActionRaw(async () => {
    await eliminarSuscripcion(endpoint)
  })
}

export async function estadoSuscripcion(endpoint: string): Promise<boolean> {
  const ctx = await sesionConRol()
  if (!ctx) {
    console.debug('[push:server] estadoSuscripcion — sin sesión, devolviendo false')
    return false
  }
  const activa = await tieneSuscripcion(ctx.userId, endpoint)
  console.debug('[push:server] estadoSuscripcion — userId=', ctx.userId, 'endpoint=', endpoint, '-> activa=', activa)
  return activa
}
