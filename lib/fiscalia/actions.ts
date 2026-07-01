'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { viaPool } from '@/lib/db'
import { subirArchivoFiscalia } from './expediente'
import { enviarCorreoAsignacionFiscalia } from '@/lib/emails/server'
import { verificarRolFiscalia, listarSolicitudesPendientes, listarSolicitudesEnProceso, listarSolicitudesConMonitorista, listarSolicitudesCompletadas, tomarCaso, pedirEvidencias, obtenerDatosAsegurado, guardarDetallesAsegurado, obtenerLiberaciones, obtenerDetalleInfraccionViaService } from './service'
import { rowToInfraccionDetalle } from './mapper'
import type { ViaInfraccionDetalle } from './types'
import type { UserInfo, SolicitudEvidencia, DetalleAsegurado, DatosAseguradoInput, LiberacionRow } from './types'

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

export async function obtenerDatosAseguradoAction(solicitudId: string): Promise<{ data: DetalleAsegurado | null; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { data: null, error: 'Sesión no válida' }

    const esValido = await verificarRolFiscalia(session.user.id)
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

    const esValido = await verificarRolFiscalia(session.user.id)
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

    revalidatePath('/fiscalia/solicitudes')
    return { success: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado al guardar detalles'
    console.error('[guardarDetallesAseguradoAction]', msg)
    return { success: false, error: msg }
  }
}

export interface LiberacionesData {
  data: LiberacionRow[]
  total: number
}

export async function obtenerLiberacionesAction(): Promise<LiberacionesData> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolFiscalia(session.user.id)
  if (!esValido) redirect('/dashboard')

  const data = await obtenerLiberaciones()

  return { data, total: data.length }
}

export async function obtenerDetalleInfraccionViaAction(id: string): Promise<{ data: ViaInfraccionDetalle | null; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { data: null, error: 'Sesión no válida' }

    const esValido = await verificarRolFiscalia(session.user.id)
    if (!esValido) return { data: null, error: 'Acceso no autorizado' }

    const raw = await obtenerDetalleInfraccionViaService(id)
    if (!raw) return { data: null, error: 'No se encontró la infracción' }

    const data = rowToInfraccionDetalle(raw)
    return { data }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado al obtener detalle de infracción'
    console.error('[obtenerDetalleInfraccionViaAction]', msg)
    return { data: null, error: msg }
  }
}

export async function guardarOficioAction(
  formData: FormData,
): Promise<{ success: boolean; error?: string; data?: { url_oficio_fiscalia: string | null } }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }

    const esValido = await verificarRolFiscalia(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    const folio = formData.get('folio') as string | null
    const numero_oficio = formData.get('numero_oficio') as string | null
    const no_carpeta_investigacion = formData.get('no_carpeta_investigacion') as string | null
    const archivo_oficio = formData.get('archivoIne') as File | null

    const nombre_titular_liberacion = formData.get('nombre_titular_liberacion') as string | null
    const appaterno_titular_liberacion = formData.get('appaterno_titular_liberacion') as string | null
    const apmaterno_titular_liberacion = formData.get('apmaterno_titular_liberacion') as string | null
    const correo_titular_liberacion = formData.get('correo_titular_liberacion') as string | null
    const curp_titular_liberacion = formData.get('curp_titular_liberacion') as string | null

    const nombre_infractor = formData.get('nombre_infractor') as string | null
    const apellido_paterno_infractor = formData.get('apellido_paterno_infractor') as string | null
    const apellido_materno_infractor = formData.get('apellido_materno_infractor') as string | null
    const correo_infractor = formData.get('correo_infractor') as string | null
    const curp_infractor = formData.get('curp_infractor') as string | null

    if (!folio) return { success: false, error: 'Folio de infracción es requerido' }

    if (!numero_oficio && !archivo_oficio) return { success: false, error: 'No se enviaron documentos' }

    if (archivo_oficio) {
      const esTipoValido = archivo_oficio.type.startsWith('image/') || archivo_oficio.type === 'application/pdf'
      if (!esTipoValido) return { success: false, error: `Tipo de archivo no permitido: ${archivo_oficio.name}` }
    }

    let url_oficio_fiscalia: string | null = null
    if (archivo_oficio) {
      url_oficio_fiscalia = await subirArchivoFiscalia(archivo_oficio, folio)
    }

    const client = await viaPool.connect()
    try {
      await client.query('BEGIN')

      const updateResult = await client.query(
        `
        UPDATE public.v2_infracciones
        SET
          no_oficio_fiscalia = $2,
          url_oficio_fiscalia = COALESCE($3, url_oficio_fiscalia),
          no_carpeta_investigacion = COALESCE($4, no_carpeta_investigacion),
          estatus = 'REGISTRADA',
          estatus_dependencia = 'MESA_DE_CONTROL_PENDIENTE_DOCS',
          nombre_titular_liberacion = COALESCE($5, nombre_titular_liberacion),
          appaterno_titular_liberacion = COALESCE($6, appaterno_titular_liberacion),
          apmaterno_titular_liberacion = COALESCE($7, apmaterno_titular_liberacion),
          correo_titular_liberacion = COALESCE($8, correo_titular_liberacion),
          curp_titular_liberacion = COALESCE($9, curp_titular_liberacion),
          nombre_infractor = COALESCE($10, nombre_infractor),
          apellido_paterno_infractor = COALESCE($11, apellido_paterno_infractor),
          apellido_materno_infractor = COALESCE($12, apellido_materno_infractor),
          correo_infractor = COALESCE($13, correo_infractor),
          curp_infractor = COALESCE($14, curp_infractor),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING
          id,
          folio,
          correo_titular_liberacion,
          nombre_titular_liberacion,
          appaterno_titular_liberacion,
          apmaterno_titular_liberacion
        `,
        [
          folio,
          numero_oficio,
          url_oficio_fiscalia,
          no_carpeta_investigacion || null,
          nombre_titular_liberacion || null,
          appaterno_titular_liberacion || null,
          apmaterno_titular_liberacion || null,
          correo_titular_liberacion || null,
          curp_titular_liberacion || null,
          nombre_infractor || null,
          apellido_paterno_infractor || null,
          apellido_materno_infractor || null,
          correo_infractor || null,
          curp_infractor || null,
        ],
      )

      const updated = updateResult.rows[0]

      if (updated.correo_titular_liberacion) {
        await enviarCorreoAsignacionFiscalia({
          correo_titular_liberacion: updated.correo_titular_liberacion,
          nombreTitular: `${updated.nombre_titular_liberacion} ${updated.appaterno_titular_liberacion} ${updated.apmaterno_titular_liberacion}`.trim(),
          idInfraccion: updated.id,
          folio: updated.folio,
          numero_oficio: numero_oficio ?? '',
        })
      }

      await client.query('COMMIT')

      revalidatePath('/fiscalia/liberaciones')

      return { success: true, data: { url_oficio_fiscalia } }
    } catch (dbError) {
      await client.query('ROLLBACK').catch(() => {})
      throw dbError
    } finally {
      client.release()
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error inesperado al guardar documentos'
    console.error('[guardarOficioAction]', msg)
    return { success: false, error: msg }
  }
}
