'use server'

import { headers } from 'next/headers'
import { sesionConRol } from '@/lib/notificaciones/actions'
import { tryActionRaw } from '@/lib/error-handler'
import { guardarSuscripcion, eliminarSuscripcion, tieneSuscripcion } from './repository'
import type { SuscripcionCliente } from './types'

export async function suscribirPush(sub: SuscripcionCliente) {
  const ctx = await sesionConRol()
  if (!ctx) return
  const userAgent = (await headers()).get('user-agent')
  await tryActionRaw(async () => {
    await guardarSuscripcion(ctx.userId, sub, userAgent)
  })
}

export async function desuscribirPush(endpoint: string) {
  await tryActionRaw(async () => {
    await eliminarSuscripcion(endpoint)
  })
}

export async function estadoSuscripcion(endpoint: string): Promise<boolean> {
  const ctx = await sesionConRol()
  if (!ctx) return false
  return tieneSuscripcion(ctx.userId, endpoint)
}
