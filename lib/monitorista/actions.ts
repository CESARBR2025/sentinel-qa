'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq, desc, sql } from 'drizzle-orm'
import { db } from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import {
  solicitudesEvidencia,
  evidencias,
  monitoristaHistorial,
} from '@/lib/db/schema'
import { obtenerGuestToken, subirArchivoExpediente } from './expediente'

async function requireMonitorista() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const [u] = await db
    .select({ rolNombre: roles.nombre, userName: users.name })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .where(eq(users.id, session.user.id))
    .limit(1)
  if (u?.rolNombre !== 'Monitorista') redirect('/dashboard')
  return { id: session.user.id, name: u?.userName ?? '' }
}

const str = (fd: FormData, k: string): string | null =>
  (fd.get(k) as string | null)?.trim() || null
const req = (fd: FormData, k: string): string => (fd.get(k) as string).trim()

export async function solicitarEvidencia(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autenticado')

  const incidenteId = req(formData, 'incidenteId')
  const folioIncidente = str(formData, 'folioIncidente')
  const descripcion = req(formData, 'descripcion')

  const userName = session.user.name || 'Usuario'

  await db.insert(solicitudesEvidencia).values({
    incidenteId,
    folioIncidente,
    solicitadoPor: session.user.id,
    solicitadoNombre: userName,
    descripcion,
  })

  revalidatePath('/monitorista')
}

export async function subirEvidencia(formData: FormData) {
  const monitorista = await requireMonitorista()

  const solicitudId = req(formData, 'solicitudId')
  const incidenteId = req(formData, 'incidenteId')
  const archivo = formData.get('archivo') as File

  if (!archivo || archivo.size === 0) throw new Error('Archivo requerido')

  const tipo = (str(formData, 'tipo') ?? 'foto') as 'foto' | 'video' | 'documento'
  const nombreOriginal = archivo.name

  const [sol] = await db
    .select({ id: solicitudesEvidencia.id, folioIncidente: solicitudesEvidencia.folioIncidente })
    .from(solicitudesEvidencia)
    .where(eq(solicitudesEvidencia.id, solicitudId))
    .limit(1)

  if (!sol) throw new Error('Solicitud no encontrada')

  const token = await obtenerGuestToken(monitorista.name)
  const folio = sol.folioIncidente ?? incidenteId.substring(0, 8)

  const tipoDoc = `EVIDENCIA_${tipo.toUpperCase()}`
  const url = await subirArchivoExpediente(
    token,
    {
      buffer: Buffer.from(await archivo.arrayBuffer()),
      nombre: nombreOriginal,
      tipo: archivo.type,
    },
    folio,
    tipoDoc,
  )

  await db.insert(evidencias).values({
    solicitudId,
    incidenteId,
    tipo,
    nombreOriginal,
    urlExpediente: url,
    subidoPor: monitorista.id,
  })

  await db.insert(monitoristaHistorial).values({
    monitoristaId: monitorista.id,
    accion: 'evidencia_subida',
    solicitudId,
    incidenteId,
  })

  revalidatePath('/monitorista')
}

export async function completarSolicitud(formData: FormData) {
  const monitorista = await requireMonitorista()

  const solicitudId = req(formData, 'solicitudId')
  const incidenteId = req(formData, 'incidenteId')

  const [sol] = await db
    .select({ id: solicitudesEvidencia.id, status: solicitudesEvidencia.status })
    .from(solicitudesEvidencia)
    .where(eq(solicitudesEvidencia.id, solicitudId))
    .limit(1)

  if (!sol) throw new Error('Solicitud no encontrada')
  if (sol.status !== 'pendiente') throw new Error('La solicitud no está pendiente')

  await db.update(solicitudesEvidencia)
    .set({ status: 'completada', completadoEn: sql`now()` })
    .where(eq(solicitudesEvidencia.id, solicitudId))

  await db.insert(monitoristaHistorial).values({
    monitoristaId: monitorista.id,
    accion: 'solicitud_completada',
    solicitudId,
    incidenteId,
  })

  revalidatePath('/monitorista')
}

export async function cancelarSolicitud(formData: FormData) {
  const monitorista = await requireMonitorista()

  const solicitudId = req(formData, 'solicitudId')
  const incidenteId = req(formData, 'incidenteId')

  const [sol] = await db
    .select({ id: solicitudesEvidencia.id, status: solicitudesEvidencia.status })
    .from(solicitudesEvidencia)
    .where(eq(solicitudesEvidencia.id, solicitudId))
    .limit(1)

  if (!sol) throw new Error('Solicitud no encontrada')
  if (sol.status !== 'pendiente') throw new Error('La solicitud no está pendiente')

  await db.update(solicitudesEvidencia)
    .set({ status: 'cancelada' })
    .where(eq(solicitudesEvidencia.id, solicitudId))

  await db.insert(monitoristaHistorial).values({
    monitoristaId: monitorista.id,
    accion: 'solicitud_cancelada',
    solicitudId,
    incidenteId,
  })

  revalidatePath('/monitorista')
}
