'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import {
  verificarRolJuzgado,
  listarSolicitudesRecepcionadas,
  listarSolicitudesEnRevision,
  listarSolicitudesConMonitorista,
  listarSolicitudesCompletadas,
  tomarCaso,
  pedirEvidencias,
  cerrarCaso,
  obtenerDatosAsegurado,
  guardarDetallesAsegurado,
} from './service'
import type { UserInfo, SolicitudEvidencia, DetalleAsegurado, DatosAseguradoInput } from './types'

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

export interface SolicitudesData {
  recepcionadas: SolicitudEvidencia[]
  enRevision: SolicitudEvidencia[]
  conMonitorista: SolicitudEvidencia[]
  completadas: SolicitudEvidencia[]
}

export async function obtenerSolicitudes(): Promise<SolicitudesData> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolJuzgado(session.user.id)
  if (!esValido) redirect('/dashboard')

  const [recepcionadas, enRevision, conMonitorista, completadas] = await Promise.all([
    listarSolicitudesRecepcionadas(),
    listarSolicitudesEnRevision(),
    listarSolicitudesConMonitorista(),
    listarSolicitudesCompletadas(),
  ])

  return { recepcionadas, enRevision, conMonitorista, completadas }
}

export async function accionTomarCaso(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }

    const esValido = await verificarRolJuzgado(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    const id = formData.get('id')
    if (typeof id !== 'string' || !id.trim()) return { success: false, error: 'ID de solicitud inválido' }

    await tomarCaso(id)

    revalidatePath('/agente_juzgado/solicitudes')
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

    const esValido = await verificarRolJuzgado(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    const id = formData.get('id')
    if (typeof id !== 'string' || !id.trim()) return { success: false, error: 'ID de solicitud inválido' }

    const evidencias = formData.get('evidencias')
    if (typeof evidencias !== 'string' || !evidencias.trim()) return { success: false, error: 'Debe agregar al menos una ubicación' }

    await pedirEvidencias(id, evidencias)

    revalidatePath('/agente_juzgado/solicitudes')
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado al pedir evidencias'
    console.error('[accionPedirEvidencias]', msg)
    return { success: false, error: msg }
  }
}

export async function accionCerrarCaso(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }

    const esValido = await verificarRolJuzgado(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    const id = formData.get('id')
    if (typeof id !== 'string' || !id.trim()) return { success: false, error: 'ID de solicitud inválido' }

    await cerrarCaso(id)

    revalidatePath('/agente_juzgado/solicitudes')
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado al cerrar el caso'
    console.error('[accionCerrarCaso]', msg)
    return { success: false, error: msg }
  }
}

export async function obtenerDatosAseguradoAction(solicitudId: string): Promise<{ data: DetalleAsegurado | null; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { data: null, error: 'Sesión no válida' }

    const esValido = await verificarRolJuzgado(session.user.id)
    if (!esValido) return { data: null, error: 'Acceso no autorizado' }

    const data = await obtenerDatosAsegurado(solicitudId)
    return { data }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado al obtener datos del asegurado'
    console.error('[obtenerDatosAseguradoAction]', msg)
    return { data: null, error: msg }
  }
}

export async function guardarDetallesAseguradoAction(
  solicitudId: string,
  datos: DatosAseguradoInput,
  evidencias?: { colonia: string; calle: string; numero: string; horaInicio: string; horaFin: string }[],
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }

    const esValido = await verificarRolJuzgado(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    let evidenciasJson: string | null = null
    if (evidencias && evidencias.length > 0) {
      const validos = evidencias.filter(it => it.colonia.trim() && it.calle.trim() && it.numero.trim() && it.horaInicio.trim() && it.horaFin.trim())
      if (validos.length > 0) {
        const ahora = new Date().toISOString()
        const nuevas = validos.map((it, idx) => ({
          solicitud_id: idx + 1,
          fecha_peticion: ahora,
          colonia: it.colonia.trim(),
          calle: it.calle.trim(),
          numero: it.numero.trim(),
          hora_inicio: it.horaInicio.trim(),
          hora_fin: it.horaFin.trim(),
          atendida: false,
        }))
        evidenciasJson = JSON.stringify(nuevas)
      }
    }

    await guardarDetallesAsegurado(solicitudId, datos, evidenciasJson)

    revalidatePath('/agente_juzgado/solicitudes')
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado al guardar detalles'
    console.error('[guardarDetallesAseguradoAction]', msg)
    return { success: false, error: msg }
  }
}
