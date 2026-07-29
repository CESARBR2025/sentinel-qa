'use server'

import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getUserWithRole } from '@/lib/auth/helpers'
import { CLAVES_EVENTO } from './catalogo'
import { emitir } from './emisor'
import {
  guardarSuscripcion, guardarRetencionDias, purgarAntiguas, obtenerRetencionDias,
} from './repository'

/** Todas las acciones de esta pantalla son exclusivas de administradores. */
async function requerirAdmin(): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const u = await getUserWithRole(session.user.id)
  if (!u?.esAdmin) redirect('/dashboard')
  return session.user.id
}

/**
 * Guarda la matriz evento × rol.
 *
 * El formulario manda un checkbox por celda con nombre `sub__<evento>__<rolId>`.
 * Los checkbox desmarcados no viajan en el FormData, así que se recorre el
 * producto completo (eventos × roles enviados en el hidden `roles`) y se guarda
 * explícitamente el estado de cada celda — si sólo se guardaran las presentes,
 * desmarcar una nunca tendría efecto.
 */
export async function guardarMatrizAction(formData: FormData) {
  await requerirAdmin()

  const rolesCsv = String(formData.get('roles') ?? '')
  const rolIds = rolesCsv.split(',').map(Number).filter(n => Number.isFinite(n) && n > 0)

  for (const evento of CLAVES_EVENTO) {
    for (const rolId of rolIds) {
      const activo = formData.get(`sub__${evento}__${rolId}`) === 'on'
      await guardarSuscripcion(evento, rolId, activo)
    }
  }

  revalidatePath('/admin/notificaciones/matriz')
  redirect('/admin/notificaciones/matriz?exito=1')
}

export async function enviarAvisoAction(formData: FormData) {
  const adminId = await requerirAdmin()

  const titulo = String(formData.get('titulo') ?? '').trim()
  const mensaje = String(formData.get('mensaje') ?? '').trim()
  const href = String(formData.get('href') ?? '').trim()
  const roles = formData.getAll('roles').map(String).filter(Boolean)

  if (!titulo || !mensaje || roles.length === 0) {
    redirect('/admin/notificaciones/enviar?error=faltan-datos')
  }

  await emitir('admin.aviso', {
    titulo,
    mensaje,
    href: href || undefined,
    roles,
    emitidaPor: adminId,
  })

  revalidatePath('/admin/notificaciones')
  redirect('/admin/notificaciones?exito=aviso')
}

export async function guardarRetencionAction(formData: FormData) {
  await requerirAdmin()
  const dias = Number(formData.get('dias'))
  if (Number.isFinite(dias) && dias >= 1) await guardarRetencionDias(Math.floor(dias))
  revalidatePath('/admin/notificaciones/mantenimiento')
  redirect('/admin/notificaciones/mantenimiento?exito=retencion')
}

export async function purgarAction() {
  await requerirAdmin()
  const dias = await obtenerRetencionDias()
  const borradas = await purgarAntiguas(dias)
  revalidatePath('/admin/notificaciones/mantenimiento')
  redirect(`/admin/notificaciones/mantenimiento?exito=purga&n=${borradas}`)
}
