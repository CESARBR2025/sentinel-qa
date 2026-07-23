'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verificarRolLiberaciones, listarLiberaciones } from './service'
import { query } from '@/lib/db'
import { obtenerDetalleInfraccionVia, obtenerTokenGuest } from '@/lib/shared/infracciones'
import type { UserInfo, LiberacionesResponse, ViaInfraccionDetalle } from './types'

export async function obtenerDashboardLiberaciones(): Promise<UserInfo> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolLiberaciones(session.user.id)
  if (!esValido) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return {
    name: user.name,
    apellido: user.apellido,
    email: user.email,
  }
}

export async function obtenerLiberaciones(): Promise<LiberacionesResponse> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolLiberaciones(session.user.id)
  if (!esValido) redirect('/dashboard')

  const data = await listarLiberaciones()
  return { data, total: data.length }
}

export async function capturarInfractorAction(body: {
  id: string;
  nombre_infractor: string;
  apellido_paterno_infractor: string;
  apellido_materno_infractor: string;
  correo_infractor: string;
  es_titular: boolean;
}): Promise<{ success: boolean; error?: string; data?: { id: string; folio: string; concepto_id: string | null; descuento_aplicado: unknown } }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { success: false, error: 'Sesión no válida' }

    const esValido = await verificarRolLiberaciones(session.user.id)
    if (!esValido) return { success: false, error: 'Acceso no autorizado' }

    const { id, nombre_infractor: nombre, apellido_paterno_infractor: apellidoP, apellido_materno_infractor: apellidoM, correo_infractor: correo, es_titular: esTitular } = body

    if (!id) return { success: false, error: 'El campo id es requerido' }

    const updateResult = await query<any>(
      `UPDATE via.v2_infracciones
       SET nombre_infractor = COALESCE($2, nombre_infractor),
           apellido_paterno_infractor = COALESCE($3, apellido_paterno_infractor),
           apellido_materno_infractor = COALESCE($4, apellido_materno_infractor),
           correo_infractor = COALESCE($5, correo_infractor),
           es_titular = $6,
           nombre_titular_liberacion = CASE WHEN $6 = true THEN $2 ELSE 'NO_DATA' END,
           appaterno_titular_liberacion = CASE WHEN $6 = true THEN $3 ELSE 'NO_DATA' END,
           apmaterno_titular_liberacion = CASE WHEN $6 = true THEN $4 ELSE 'NO_DATA' END,
           correo_titular_liberacion = CASE WHEN $6 = true THEN $5 ELSE 'NO_DATA' END,
           estatus = 'REGISTRADA',
           estatus_dependencia = 'MESA_DE_CONTROL_PENDIENTE_DOCS',
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, folio, descuento_aplicado, fraccion_id`,
      [id, nombre || null, apellidoP || null, apellidoM || null, correo || null, esTitular],
    )

    if (updateResult.rows.length === 0) {
      return { success: false, error: 'No se encontró la infracción' }
    }

    const infraccion = updateResult.rows[0]

    const conceptoResult = await query<any>(
      `SELECT ccs.concept_id
       FROM via.v2_fracciones_ley fl
       JOIN via.v2_catalogo_conceptos_sa7 ccs ON ccs.clasificacion_type = fl.clasificacion
       WHERE fl.id = $1`,
      [infraccion.fraccion_id],
    )

    const concepto_id = conceptoResult.rows[0]?.concept_id ?? null

    const nombreUsuario = `${nombre || ''} ${apellidoP || ''}`.trim()

    return {
      success: true,
      data: {
        id: infraccion.id,
        folio: infraccion.folio,
        concepto_id,
        descuento_aplicado: infraccion.descuento_aplicado,
      },
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error al capturar infractor'
    console.error('[capturarInfractorAction]', msg)
    return { success: false, error: msg }
  }
}

export async function obtenerDocumentosLiberacion(infraccionId: string): Promise<{
  solicitud?: Record<string, unknown>;
  documentos: { id: string; tipo: string; url: string; estatusRevision: string | null; observaciones: string | null }[];
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { documentos: [], error: 'Sesión no válida' }

    const esValido = await verificarRolLiberaciones(session.user.id)
    if (!esValido) return { documentos: [], error: 'Acceso no autorizado' }

    const solicitudRes = await query<any>(
      `SELECT id, tipo_liberacion, es_empresa, nombre_empresa, rfc_empresa, estatus
       FROM via.v2_solicitudes_liberacion
       WHERE infraccion_id = $1`,
      [infraccionId],
    )

    if (solicitudRes.rows.length === 0) {
      return { documentos: [], error: 'No se encontró solicitud de liberación para esta infracción' }
    }

    const solicitud = solicitudRes.rows[0]

    const docsRes = await query<any>(
      `SELECT DISTINCT ON (dl.tipo_documento)
              dl.id, dl.tipo_documento, dl.url_documento, dl.estatus_revision, dl.observaciones, dl.created_at
       FROM via.v2_documentos_liberacion dl
       WHERE dl.solicitud_id = $1
       ORDER BY dl.tipo_documento, dl.created_at DESC`,
      [solicitud.id],
    )

    return {
      solicitud: {
        id: solicitud.id,
        tipoLiberacion: solicitud.tipo_liberacion,
        esEmpresa: solicitud.es_empresa,
        nombreEmpresa: solicitud.nombre_empresa,
        rfcEmpresa: solicitud.rfc_empresa,
        estatus: solicitud.estatus,
      },
      documentos: docsRes.rows.map((d) => ({
        id: d.id,
        tipo: d.tipo_documento,
        url: d.url_documento,
        estatusRevision: d.estatus_revision,
        observaciones: d.observaciones,
      })),
    }
  } catch (error) {
    console.error('[obtenerDocumentosLiberacion]', error)
    return { documentos: [], error: 'Error interno del servidor' }
  }
}

export async function revisarDocumentoAction(body: {
  documentoId: string;
  accion: 'ACEPTADO' | 'RECHAZADO';
  observaciones?: string;
}): Promise<{ message?: string; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Sesión no válida' }

    const esValido = await verificarRolLiberaciones(session.user.id)
    if (!esValido) return { error: 'Acceso no autorizado' }

    const { documentoId, accion, observaciones } = body

    if (!documentoId) return { error: 'documentoId es requerido' }
    if (accion !== 'ACEPTADO' && accion !== 'RECHAZADO') return { error: 'accion debe ser ACEPTADO o RECHAZADO' }
    if (accion === 'RECHAZADO' && !observaciones?.trim()) return { error: 'Se requieren observaciones para rechazar un documento' }

    const result = await query<any>(
      `UPDATE via.v2_documentos_liberacion
       SET estatus_revision = $1, observaciones = $2, fecha_revision = NOW()
       WHERE id = $3
       RETURNING id, estatus_revision, observaciones`,
      [accion, observaciones?.trim() || null, documentoId],
    )

    if (result.rows.length === 0) return { error: 'No se encontró el documento' }

    return { message: `Documento ${accion === 'ACEPTADO' ? 'aceptado' : 'rechazado'} correctamente` }
  } catch (error) {
    console.error('[revisarDocumentoAction]', error)
    return { error: 'Error interno del servidor' }
  }
}

export async function finalizarRevisionAction(infraccionId: string): Promise<{
  message?: string;
  error?: string;
  estatus?: string;
  estatusDependencia?: string;
  folio?: string | null;
  concepto_id?: number | null;
  descuento_aplicado?: number | null;
  nombre_usuario?: string;
  apellidos_usuario?: string;
  correo_infractor?: string;
}> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { error: 'Sesión no válida' }

    const esValido = await verificarRolLiberaciones(session.user.id)
    if (!esValido) return { error: 'Acceso no autorizado' }

    if (!infraccionId) return { error: 'infraccionId es requerido' }

    const solicitudRes = await query<any>(
      `SELECT id FROM via.v2_solicitudes_liberacion
       WHERE infraccion_id = $1
       ORDER BY created_at DESC LIMIT 1`,
      [infraccionId],
    )

    if (solicitudRes.rows.length === 0) return { error: 'No se encontró solicitud de liberación' }

    const solicitudId = solicitudRes.rows[0].id

    const docsRes = await query(
      `SELECT DISTINCT ON (dl.tipo_documento) dl.estatus_revision
       FROM via.v2_documentos_liberacion dl
       WHERE dl.solicitud_id = $1
       ORDER BY dl.tipo_documento, dl.created_at DESC`,
      [solicitudId],
    )

    if (docsRes.rows.length === 0) return { error: 'No hay documentos asociados a la solicitud' }

    const tienePendientes = docsRes.rows.some(
      (d: Record<string, unknown>) => !d.estatus_revision || d.estatus_revision === 'PENDIENTE',
    )
    if (tienePendientes) return { error: 'No se puede finalizar: hay documentos pendientes de revisión' }

    const tieneRechazados = docsRes.rows.some(
      (d: Record<string, unknown>) => d.estatus_revision === 'RECHAZADO',
    )

    const nuevoEstatusDep = tieneRechazados ? 'MESA_DE_CONTROL_RECHAZADA' : 'PENDIENTE_PAGO_LIBERACION'
    const nuevoEstatus = tieneRechazados ? 'REGISTRADA' : 'PENDIENTE_PAGO'

    let folio: string | null = null
    let concepto_id: number | null = null
    let descuento_aplicado: number | null = null
    let nombre_usuario = ''
    let apellidos_usuario = ''
    let correo_infractor = ''

    if (nuevoEstatus === 'PENDIENTE_PAGO') {
      const infraRes = await query(
        `SELECT i.folio, i.descuento_aplicado, i.fraccion_id,
                i.nombre_infractor, i.apellido_paterno_infractor, i.apellido_materno_infractor,
                i.nombre_titular_liberacion, i.appaterno_titular_liberacion, i.apmaterno_titular_liberacion,
                i.correo_titular_liberacion, i.correo_infractor
         FROM via.v2_infracciones i WHERE i.id = $1`,
        [infraccionId],
      )

      if (infraRes.rows.length > 0) {
        const row = infraRes.rows[0] as Record<string, unknown>
        folio = row.folio as string | null
        descuento_aplicado = row.descuento_aplicado as number | null

        nombre_usuario = (row.nombre_titular_liberacion || row.nombre_infractor || '') as string
        apellidos_usuario = [row.appaterno_titular_liberacion || row.apellido_paterno_infractor || '', row.apmaterno_titular_liberacion || row.apellido_materno_infractor || ''].filter(Boolean).join(' ').trim() || 'SIN APELLIDO'
        correo_infractor = (row.correo_titular_liberacion || row.correo_infractor || '') as string

        const conceptoRes = await query<any>(
          `SELECT ccs.concept_id
           FROM via.v2_fracciones_ley fl
           JOIN via.v2_catalogo_conceptos_sa7 ccs ON ccs.clasificacion_type = fl.clasificacion
           WHERE fl.id = $1`,
          [row.fraccion_id],
        )
        concepto_id = (conceptoRes.rows[0]?.concept_id as number) ?? null
      }
    }

    await query(
      `UPDATE via.v2_infracciones SET estatus = $1, estatus_dependencia = $2, updated_at = NOW() WHERE id = $3`,
      [nuevoEstatus, nuevoEstatusDep, infraccionId],
    )

    await query(
      `UPDATE via.v2_solicitudes_liberacion SET estatus = $1, updated_at = NOW() WHERE id = $2`,
      [nuevoEstatusDep, solicitudId],
    )

    return {
      message: nuevoEstatus === 'PENDIENTE_PAGO'
        ? 'Documentos aprobados, pendiente de pago'
        : 'Documentos rechazados, se notificará al ciudadano',
      estatus: nuevoEstatus,
      estatusDependencia: nuevoEstatusDep,
      folio,
      concepto_id,
      descuento_aplicado,
      nombre_usuario,
      apellidos_usuario,
      correo_infractor,
    }
  } catch (error) {
    console.error('[finalizarRevisionAction]', error)
    return { error: 'Error interno del servidor' }
  }
}

export async function obtenerDetalleInfraccionLiberaciones(
  id: string,
): Promise<{ data: ViaInfraccionDetalle | null; error?: string }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { data: null, error: "Sesión no válida" };

    const esValido = await verificarRolLiberaciones(session.user.id);
    if (!esValido) return { data: null, error: "Acceso no autorizado" };

    const data = await obtenerDetalleInfraccionVia(id);
    if (!data) return { data: null, error: "No se encontró la infracción" };

    return { data };
  } catch (err) {
    const msg =
      err instanceof Error
        ? err.message
        : "Error inesperado al obtener detalle de infracción";
    console.error("[obtenerDetalleInfraccionLiberaciones]", msg);
    return { data: null, error: msg };
  }
}

const SA7_URL = "https://sanjuandelrio.sytes.net:3044/api/sasiete/generar-orden-completa";

export async function generarOrdenPagoAction(payload: {
  infraccion_id: string;
  nombre_usuario: string;
  apellidos_usuario: string;
  concepto_id: number;
  folio: string;
  correoInfractor: string;
  descuentoAplicado: string;
  cantidad?: number;
}): Promise<{ ok: boolean; message?: string; data?: Record<string, unknown> }> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return { ok: false, message: 'Sesión no válida' }

    const esValido = await verificarRolLiberaciones(session.user.id)
    if (!esValido) return { ok: false, message: 'Acceso no autorizado' }

    const {
      infraccion_id,
      nombre_usuario,
      apellidos_usuario,
      concepto_id,
      folio,
      correoInfractor,
      descuentoAplicado,
      cantidad,
    } = payload

    if (!infraccion_id || !nombre_usuario || !folio || !apellidos_usuario || !concepto_id || !correoInfractor || !descuentoAplicado) {
      return { ok: false, message: 'Faltan campos obligatorios' }
    }

    let tokenGuest: string
    try {
      tokenGuest = await obtenerTokenGuest()
    } catch {
      return { ok: false, message: 'No se pudo obtener token guest' }
    }

    const CONCEPTO_PRUEBA = '31378'
    let descuento = 0
    const descuentoNum = Number(descuentoAplicado)
    if (descuentoNum) {
      if (descuentoNum === 70) descuento = 0.3
      else if (descuentoNum === 50) descuento = 0.5
      if (cantidad) descuento = cantidad
    }

    const payloadSA7 = {
      nombreUsuario: nombre_usuario,
      apellidosUsuario: apellidos_usuario,
      rfc: '',
      conceptosIds: [CONCEPTO_PRUEBA],
      cantidades: { [CONCEPTO_PRUEBA]: descuento },
      referencias: { [CONCEPTO_PRUEBA]: [`${nombre_usuario} ${apellidos_usuario}`] },
      id_usuario_general: '17336',
      tipo_tramite: 'via_v2_cobro_infracciones_online',
      folio: folio,
    }

    const responseSA7 = await fetch(SA7_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenGuest}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadSA7),
    })

    const orden_pago_id = responseSA7.headers.get('x-orden-pago-id')
    const estatus = responseSA7.headers.get('x-estatus')
    const url_pago = responseSA7.headers.get('x-url-pago')
    const url_guardado = responseSA7.headers.get('x-url-guardado')
    const folio_orden = responseSA7.headers.get('x-folio-orden')
    const fecha_vencimiento = responseSA7.headers.get('x-fecha-vencimiento')
    const total_pesos = responseSA7.headers.get('x-total-pesos')
    const total_umas = responseSA7.headers.get('x-total-umas')

    await query(
      `INSERT INTO via.v2_ordenes_pago_sa7 (
        infraccion_id, folio_infraccion, nombre_usuario, apellidos_usuario, concepto_id,
        orden_pago_id, estatus, url_pago, url_guardado, folio_orden,
        fecha_vencimiento, total_pesos, total_umas, request_payload
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        infraccion_id, folio, nombre_usuario, apellidos_usuario, CONCEPTO_PRUEBA,
        orden_pago_id, estatus, url_pago, url_guardado, folio_orden,
        fecha_vencimiento || null, total_pesos || 0, total_umas || 0,
        JSON.stringify(payloadSA7),
      ],
    )


    return {
      ok: true,
      data: {
        orden_pago_id,
        estatus,
        url_pago,
        url_guardado,
        folio_orden,
        fecha_vencimiento,
        total_pesos,
        total_umas,
      },
    }
  } catch (error) {
    console.error('[generarOrdenPagoAction]', error)
    return { ok: false, message: 'Error interno del servidor' }
  }
}
