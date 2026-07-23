'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { crearReporte }   from './service'
import { revalidatePath } from 'next/cache'
import { tryAction, tryActionRaw, AppError, ValidationError, NotFoundError, ForbiddenError, UnauthorizedError } from '@/lib/error-handler'
import { actualizarPatrullaOficial, actualizarTelefonoOficial, telefonoExiste } from './repository'

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

// Despacho solo asigna unidades y recibe reportes — nunca captura hora_salida/hora_llegada
// a mano, porque sin AVL/GPS real no tiene forma confiable de saberlo (el despachador solo
// podría adivinar o esperar que alguien le avise por radio, el mismo problema de "transcribir
// por otro" que ya se descartó para rondín). Es el propio oficial quien reporta sus dos
// momentos reales: "voy en camino" (sale) y "marcar en sitio" (llega).
export async function marcarEnCaminoOficial(incidenteId: string) {
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
      throw new ValidationError('El incidente debe estar en_despacho para marcar en camino')

    // Solo registra hora_salida — el estatus del incidente sigue en_despacho hasta "Marcar en Sitio"
    await query(
      `UPDATE incidente_despacho_unidades du
       SET hora_salida = COALESCE(du.hora_salida, NOW())
       FROM incidente_despacho d
       WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
      [incidenteId],
    )
  })

  revalidatePath('/oficial/despachos')
  revalidatePath(`/oficial/despachos/${incidenteId}`)
  revalidatePath('/incidentes')
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

    // Si el oficial nunca marcó "voy en camino" (ej. trayecto muy corto), hora_salida se infiere
    // aquí como respaldo — nunca pisa lo que ya haya quedado registrado.
    await query(
      `UPDATE incidente_despacho_unidades du
       SET hora_salida = COALESCE(du.hora_salida, d.fecha_hora_despacho),
           hora_llegada = COALESCE(du.hora_llegada, NOW())
       FROM incidente_despacho d
       WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
      [incidenteId],
    )
  })

  revalidatePath('/oficial/despachos')
  revalidatePath(`/oficial/despachos/${incidenteId}`)
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

export async function actualizarTelefono(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const telefono = formData.get('telefono') as string | null
  if (!telefono) throw new ValidationError('El teléfono es requerido')

  await tryActionRaw(async () => {
    const duplicado = await telefonoExiste(telefono, session.user.id)
    if (duplicado) {
      throw new ValidationError('Este número de teléfono ya está registrado por otro oficial')
    }
    await actualizarTelefonoOficial(session.user.id, telefono)
  })

  revalidatePath('/oficial/configuracion')
}
