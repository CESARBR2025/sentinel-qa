'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { tryActionRaw } from '@/lib/error-handler'
import { actualizarActividadDespachador } from './repository'

export async function reportarActividadDespachador() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return // heartbeat silencioso: no interrumpe la navegación si la sesión venció

  await tryActionRaw(async () => {
    await actualizarActividadDespachador(session.user.id)
  })
}
