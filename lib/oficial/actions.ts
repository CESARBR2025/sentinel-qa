'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { crearReporte }   from './service'
import { revalidatePath } from 'next/cache'
import { tryAction, tryActionRaw, AppError, ValidationError, NotFoundError, ForbiddenError, UnauthorizedError } from '@/lib/error-handler'
import { actualizarPatrullaOficial } from './repository'

export async function crearReporteCampoOficial(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const { reporteId, quiereDenuncia, calle, colonia, latitud, longitud, oficialId, hayDetenidos, destino } =
    await tryActionRaw(async () => crearReporte(session.user.id, formData))

  revalidatePath('/oficial')
  // Si el reporte cerró una solicitud de despacho, refrescar vistas de despacho
  if (formData.get('incidente_id')) {
    revalidatePath('/oficial/despachos')
    revalidatePath('/incidentes')
  }

  if (quiereDenuncia) {
    const params = new URLSearchParams({
      reporteCampoId: reporteId,
      calle:    calle    ?? '',
      colonia:  colonia  ?? '',
      lat:      latitud  ?? '',
      lng:      longitud ?? '',
      oficialId: oficialId,
      destino:  destino  ?? '',
    })
    redirect(`/denuncia/nuevo?${params}`)
  }

  if (hayDetenidos) {
    redirect(`/oficial/reportes/${reporteId}/fotos`)
  }

  redirect('/oficial?exito=1')
}

export async function marcarEnSitioOficial(incidenteId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  await tryActionRaw(async () => {
    const { query } = await import('@/lib/db')
    const inc = await query<{ estatus: string }>(
      `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
      [incidenteId],
    )
    if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
    if (inc.rows[0].estatus !== 'en_despacho')
      throw new ValidationError('El incidente debe estar en_despacho para marcar en sitio')

    await query(
      `UPDATE incidentes SET estatus = 'en_sitio', actualizado_en = NOW() WHERE id = $1`,
      [incidenteId],
    )
  })

  revalidatePath('/oficial/despachos')
  revalidatePath('/incidentes')
}

export async function asignarPatrulla(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const patrullaId = formData.get('patrullaId') as string | null

  await tryActionRaw(async () => {
    await actualizarPatrullaOficial(session.user.id, patrullaId || null)
  })

  revalidatePath('/oficial/configuracion')
  revalidatePath('/oficial')
}
