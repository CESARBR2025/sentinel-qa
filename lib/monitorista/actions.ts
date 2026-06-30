'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { query } from '@/lib/db'
import { obtenerGuestToken, subirArchivoExpediente } from '@/lib/expediente/client'

async function requireMonitorista() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const r = await query<{ nombre: string }>(
    `SELECT r.nombre FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = $1 LIMIT 1`, [session.user.id],
  )
  if (!r.rows[0] || r.rows[0].nombre !== 'Monitorista') redirect('/dashboard')
  return session
}

export async function solicitarEvidencia(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autenticado')

  await query(
    `INSERT INTO solicitudes_evidencia (incidente_id, folio_incidente, solicitado_por, solicitado_nombre, descripcion)
     VALUES ($1,$2,$3,$4,$5)`,
    [
      formData.get('incidenteId') as string,
      (formData.get('folioIncidente') as string) || null,
      session.user.id,
      session.user.name || 'Usuario',
      formData.get('descripcion') as string,
    ],
  )
  revalidatePath('/monitorista')
}

export async function subirEvidencia(formData: FormData) {
  const session = await requireMonitorista()

  const solicitudId = formData.get('solicitudId') as string
  const incidenteId = formData.get('incidenteId') as string
  const archivo = formData.get('archivo') as File
  const tipo = (formData.get('tipo') as string) ?? 'foto'

  if (!archivo || archivo.size === 0) throw new Error('Archivo requerido')

  const r = await query<{ folio_incidente: string | null }>(
    `SELECT folio_incidente FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`, [solicitudId],
  )
  if (!r.rows[0]) throw new Error('Solicitud no encontrada')

  const buffer = Buffer.from(await archivo.arrayBuffer())
  const token = await obtenerGuestToken(session.user.name || 'Monitorista')
  const url = await subirArchivoExpediente(
    token, { buffer, nombre: archivo.name, tipo: archivo.type },
    r.rows[0].folio_incidente ?? incidenteId.substring(0, 8),
    `EVIDENCIA_${tipo.toUpperCase()}`,
  )

  await query(
    `INSERT INTO evidencias (solicitud_id, incidente_id, tipo, nombre_original, url_expediente, subido_por)
     VALUES ($1,$2,$3,$4,$5,$6)`,
    [solicitudId, incidenteId, tipo, archivo.name, url, session.user.id],
  )

  await query(
    `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id) VALUES ($1,'evidencia_subida',$2)`,
    [session.user.id, incidenteId],
  )

  revalidatePath('/monitorista')
}

export async function completarSolicitud(formData: FormData) {
  const session = await requireMonitorista()
  const solicitudId = formData.get('solicitudId') as string
  const incidenteId = formData.get('incidenteId') as string

  await query(
    `UPDATE solicitudes_evidencia SET status = 'completada', completado_en = NOW() WHERE id = $1 AND status = 'pendiente'`,
    [solicitudId],
  )

  await query(
    `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id) VALUES ($1,'solicitud_completada',$2)`,
    [session.user.id, incidenteId],
  )

  revalidatePath('/monitorista')
}

export async function cancelarSolicitud(formData: FormData) {
  const session = await requireMonitorista()
  const solicitudId = formData.get('solicitudId') as string
  const incidenteId = formData.get('incidenteId') as string

  await query(
    `UPDATE solicitudes_evidencia SET status = 'cancelada' WHERE id = $1 AND status = 'pendiente'`,
    [solicitudId],
  )

  await query(
    `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id) VALUES ($1,'solicitud_cancelada',$2)`,
    [session.user.id, incidenteId],
  )

  revalidatePath('/monitorista')
}
