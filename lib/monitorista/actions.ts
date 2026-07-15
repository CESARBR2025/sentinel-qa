'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { obtenerGuestToken, subirArchivoExpediente } from '@/lib/expediente/client'
import { getRolUsuario, obtenerSolicitudFolioIncidente, crearSolicitudEvidencia, insertarEvidencia, actualizarEstadoSolicitud, insertHistorial } from '@/lib/monitorista/repository'
import { tryAction, tryActionRaw, AppError, ValidationError, NotFoundError, ForbiddenError, UnauthorizedError } from '@/lib/error-handler'

async function requireMonitorista() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const rol = await getRolUsuario(session.user.id)
  if (rol !== 'Monitorista') redirect('/dashboard')
  return session
}

export async function solicitarEvidencia(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new UnauthorizedError()

  await tryActionRaw(async () => {
    await crearSolicitudEvidencia({
      incidenteId: formData.get('incidenteId') as string,
      folioIncidente: (formData.get('folioIncidente') as string) || null,
      solicitadoPor: session.user.id,
      solicitadoNombre: session.user.name || 'Usuario',
      descripcion: formData.get('descripcion') as string,
    })
  })
  revalidatePath('/monitorista')
}

export async function subirEvidencia(formData: FormData) {
  const session = await requireMonitorista()

  const solicitudId = formData.get('solicitudId') as string
  const incidenteId = formData.get('incidenteId') as string
  const archivo = formData.get('archivo') as File
  const tipo = (formData.get('tipo') as string) ?? 'foto'

  if (!archivo || archivo.size === 0) throw new ValidationError('Archivo requerido')

  const folioRow = await obtenerSolicitudFolioIncidente(solicitudId)
  if (!folioRow) throw new NotFoundError('Solicitud no encontrada')

  const buffer = Buffer.from(await archivo.arrayBuffer())
  const token = await obtenerGuestToken(session.user.name || 'Monitorista')
  const url = await tryActionRaw(async () => subirArchivoExpediente(
    token, { buffer, nombre: archivo.name, tipo: archivo.type },
    folioRow.folioIncidente ?? incidenteId.substring(0, 8),
    `EVIDENCIA_${tipo.toUpperCase()}`,
  ))

  await tryActionRaw(async () => {
    await insertarEvidencia(solicitudId, incidenteId, tipo, archivo.name, url, session.user.id)
    await insertHistorial(session.user.id, 'evidencia_subida', incidenteId)
  })

  revalidatePath('/monitorista')
}

export async function completarSolicitud(formData: FormData) {
  const session = await requireMonitorista()
  const solicitudId = formData.get('solicitudId') as string
  const incidenteId = formData.get('incidenteId') as string

  await tryActionRaw(async () => {
    await actualizarEstadoSolicitud(solicitudId, 'completada')
    await insertHistorial(session.user.id, 'solicitud_completada', incidenteId)
  })

  revalidatePath('/monitorista')
}

export async function cancelarSolicitud(formData: FormData) {
  const session = await requireMonitorista()
  const solicitudId = formData.get('solicitudId') as string
  const incidenteId = formData.get('incidenteId') as string

  await tryActionRaw(async () => {
    await actualizarEstadoSolicitud(solicitudId, 'cancelada')
    await insertHistorial(session.user.id, 'solicitud_cancelada', incidenteId)
  })

  revalidatePath('/monitorista')
}
