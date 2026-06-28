'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { verificarRolFiscalia, listarSolicitudesPendientes, listarSolicitudesEnProceso, listarSolicitudesConMonitorista, listarSolicitudesCompletadas, tomarCaso, pedirEvidencias } from './service'
import type { UserInfo, SolicitudEvidencia } from './types'

export async function obtenerDashboardFiscalia(): Promise<UserInfo> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolFiscalia(session.user.id)
  if (!esValido) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return {
    name: user.name,
    apellido: user.apellido,
    email: user.email,
  }
}

export interface SolicitudesData {
  pendientes: SolicitudEvidencia[]
  enProceso: SolicitudEvidencia[]
  conMonitorista: SolicitudEvidencia[]
  completadas: SolicitudEvidencia[]
}

export async function obtenerSolicitudes(): Promise<SolicitudesData> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolFiscalia(session.user.id)
  if (!esValido) redirect('/dashboard')

  const [pendientes, enProceso, conMonitorista, completadas] = await Promise.all([
    listarSolicitudesPendientes(),
    listarSolicitudesEnProceso(),
    listarSolicitudesConMonitorista(),
    listarSolicitudesCompletadas(),
  ])

  return { pendientes, enProceso, conMonitorista, completadas }
}

export async function accionTomarCaso(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }

    const esValido = await verificarRolFiscalia(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    const id = formData.get('id')
    if (typeof id !== 'string' || !id.trim()) return { success: false, error: 'ID de solicitud inválido' }

    await tomarCaso(id)

    revalidatePath('/fiscalia/solicitudes')
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado al tomar el caso'
    console.error('[accionTomarCaso]', msg)
    return { success: false, error: msg }
  }
}

export async function accionPedirEvidencias(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }

    const esValido = await verificarRolFiscalia(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    const id = formData.get('id')
    if (typeof id !== 'string' || !id.trim()) return { success: false, error: 'ID de solicitud inválido' }

    const evidencias = formData.get('evidencias')
    if (typeof evidencias !== 'string' || !evidencias.trim()) return { success: false, error: 'Debe agregar al menos una ubicación' }

    await pedirEvidencias(id, evidencias)

    revalidatePath('/fiscalia/solicitudes')
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado al pedir evidencias'
    console.error('[accionPedirEvidencias]', msg)
    return { success: false, error: msg }
  }
}
