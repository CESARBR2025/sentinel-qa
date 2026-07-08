'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { tienePermiso } from '@/lib/permisos/core'
import { listarSolicitudesPendientes } from './service'
import type { UserInfo, SolicitudesResponse } from './types'

export async function obtenerDashboardCorralon(): Promise<UserInfo> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const puedeAcceder = await tienePermiso(session.user.id, 'corralon_solicitudes', 'ver')
  if (!puedeAcceder) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return {
    name: user.name,
    apellido: user.apellido,
    email: user.email,
  }
}

export async function obtenerSolicitudes(): Promise<SolicitudesResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const puedeAcceder = await tienePermiso(session.user.id, 'corralon_solicitudes', 'ver')
  if (!puedeAcceder) redirect('/dashboard')

  const data = await listarSolicitudesPendientes()
  return { data, total: data.length }
}
