import { obtenerRolUsuario, obtenerLiberaciones, actualizarDatosInfractor, obtenerConceptoId, insertarOrdenPagoSa7, liberarGarantia } from './repository'
import { rowToLiberacion } from './mapper'
import { obtenerTokenGuest } from '@/lib/shared/infracciones'
import type { LiberacionRow, CapturaInfractorInput, CapturaInfractorResult } from './types'

const SA7_URL = 'https://sanjuandelrio.sytes.net:3044/api/sasiete/generar-orden-completa' as const
const CONCEPTO_PRUEBA = '31378'

export async function verificarRolInfracciones(userId: string): Promise<boolean> {
  const rol = await obtenerRolUsuario(userId)
  return rol === 'agente_infracciones'
}

export async function listarLiberaciones(): Promise<LiberacionRow[]> {
  const result = await obtenerLiberaciones()
  return result.rows.map(rowToLiberacion)
}

export async function procesarCapturaInfractor(
  input: CapturaInfractorInput,
): Promise<CapturaInfractorResult> {
  if (!input.id) return { success: false, error: 'El campo id es requerido' }
  if (!input.nombre_infractor.trim()) return { success: false, error: 'El nombre del infractor es requerido' }

  const updateResult = await actualizarDatosInfractor(input)

  if (updateResult.rows.length === 0) {
    return { success: false, error: 'No se encontró la infracción' }
  }

  const infraccion = updateResult.rows[0]

  const conceptoId = await obtenerConceptoId(infraccion.fraccion_id)

  const nombreUsuario = input.nombre_titular || input.nombre_infractor
  const apellidosUsuario = [input.appaterno_titular || input.appaterno_infractor, input.apmaterno_titular || input.apmaterno_infractor].filter(Boolean).join(' ')
  const correo = input.correo_titular || input.correo_infractor
  const folio = infraccion.folio

  let ordenPagoId: string | null = null
  let urlPago: string | null = null

  try {
    const tokenGuest = await obtenerTokenGuest()

    let descuento = 0
    const descuentoNum = Number(infraccion.descuento_aplicado)
    if (descuentoNum === 70) descuento = 0.3
    else if (descuentoNum === 50) descuento = 0.5

    const payloadSA7 = {
      nombreUsuario,
      apellidosUsuario,
      rfc: '',
      conceptosIds: [CONCEPTO_PRUEBA],
      cantidades: { [CONCEPTO_PRUEBA]: descuento },
      referencias: { [CONCEPTO_PRUEBA]: [`${nombreUsuario} ${apellidosUsuario}`] },
      id_usuario_general: '17336',
      tipo_tramite: 'via_v2_cobro_infracciones_online',
      folio,
    }

    const responseSA7 = await fetch(SA7_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenGuest}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payloadSA7),
    })

    ordenPagoId = responseSA7.headers.get('x-orden-pago-id')
    urlPago = responseSA7.headers.get('x-url-pago')

    await insertarOrdenPagoSa7({
      infraccion_id: input.id,
      folio_infraccion: folio,
      nombre_usuario: nombreUsuario,
      apellidos_usuario: apellidosUsuario,
      concepto_id: CONCEPTO_PRUEBA,
      orden_pago_id: ordenPagoId,
      estatus: responseSA7.headers.get('x-estatus'),
      url_pago: urlPago,
      url_guardado: responseSA7.headers.get('x-url-guardado'),
      folio_orden: responseSA7.headers.get('x-folio-orden'),
      fecha_vencimiento: responseSA7.headers.get('x-fecha-vencimiento'),
      total_pesos: responseSA7.headers.get('x-total-pesos'),
      total_umas: responseSA7.headers.get('x-total-umas'),
      request_payload: JSON.stringify(payloadSA7),
    })
  } catch (err) {
    console.error('[procesarCapturaInfractor] Error generando orden de pago:', err)
  }

  if (correo) {
    try {
      const emailModule: Record<string, unknown> = await import('@/lib/emails/server')
      if (typeof emailModule.enviarCorreoInfraccion === 'function') {
        ;(emailModule.enviarCorreoInfraccion as (...args: unknown[]) => Promise<unknown>)({
          idInfraccion: input.id,
          correoInfractor: correo,
          nombreInfractor: `${nombreUsuario} ${apellidosUsuario}`.trim(),
          folio,
        }).catch((e: unknown) => console.error('Error enviando correo orden pago:', e))
      }
    } catch {
      console.warn('enviarCorreoInfraccion no disponible')
    }
  }

  return {
    success: true,
    data: {
      id: input.id,
      folio,
      orden_pago_id: ordenPagoId,
      url_pago: urlPago,
    },
  }
}

export async function procesarLiberarGarantia(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  if (!id) return { success: false, error: 'El id es requerido' }

  const result = await liberarGarantia(id)

  if (result.rows.length === 0) {
    return { success: false, error: 'No se encontró la infracción' }
  }

  return { success: true }
}
