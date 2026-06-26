'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verificarRolJuzgado } from './service'
import type { UserInfo } from './types'

export async function obtenerDashboardJuzgado(): Promise<UserInfo> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolJuzgado(session.user.id)
  if (!esValido) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return {
    name: user.name,
    apellido: user.apellido,
    email: user.email,
  }
}
