'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { tienePermiso } from '@/lib/permisos/core'
import { listarSolicitudesPendientes, listarSolicitudesFinalizadas } from './service'
import type { UserInfo, SolicitudRow } from './types'

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

export interface TabSolicitudes {
  pendientes: SolicitudRow[]
  finalizadas: SolicitudRow[]
}

export async function obtenerSolicitudes(): Promise<TabSolicitudes> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const puedeAcceder = await tienePermiso(session.user.id, 'corralon_solicitudes', 'ver')
  if (!puedeAcceder) redirect('/dashboard')

  const [pendientes, finalizadas] = await Promise.all([
    listarSolicitudesPendientes(),
    listarSolicitudesFinalizadas(),
  ])

  return { pendientes, finalizadas }
}
