'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verificarRolLiberaciones, listarLiberaciones } from './service'
import { queryVia, viaPool } from '@/lib/db'
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

    const updateResult = await viaPool.query(
      `UPDATE public.v2_infracciones
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

    const conceptoResult = await viaPool.query(
      `SELECT ccs.concept_id
       FROM v2_fracciones_ley fl
       JOIN v2_catalogo_conceptos_sa7 ccs ON ccs.clasificacion_type = fl.clasificacion
       WHERE fl.id = $1`,
      [infraccion.fraccion_id],
    )

    const concepto_id = conceptoResult.rows[0]?.concept_id ?? null

    const nombreUsuario = `${nombre || ''} ${apellidoP || ''}`.trim()
    if (correo) {
      try {
        const emailModule: Record<string, unknown> = await import('@/lib/emails/server')
        if (typeof emailModule.enviarCorreoCapturaInfractor === 'function') {
          ;(emailModule.enviarCorreoCapturaInfractor as (...args: unknown[]) => Promise<unknown>)({
            idInfraccion: infraccion.id,
            correoInfractor: correo,
            nombreInfractor: nombreUsuario,
            folio: infraccion.folio,
          }).catch((e: unknown) => console.error('Error enviando correo captura infractor:', e))
        }
      } catch {
        console.warn('enviarCorreoCapturaInfractor no disponible')
      }
    }

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

    await viaPool.query(
      `INSERT INTO v2_ordenes_pago_sa7 (
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

    if (correoInfractor) {
      try {
        const emailModule: Record<string, unknown> = await import('@/lib/emails/server')
        if (typeof emailModule.enviarCorreoInfraccion === 'function') {
          ;(emailModule.enviarCorreoInfraccion as (...args: unknown[]) => Promise<unknown>)({
            idInfraccion: infraccion_id,
            correoInfractor: correoInfractor,
            nombreInfractor: nombre_usuario,
            folio: folio,
          }).catch((e: unknown) => console.error('Error enviando correo orden pago:', e))
        }
      } catch {
        console.warn('enviarCorreoInfraccion no disponible')
      }
    }

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
