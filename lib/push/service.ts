import webpush from 'web-push'
import { suscripcionesParaAudiencia, eliminarSuscripcion } from './repository'
import type { PayloadPush } from './types'

let vapidConfigurado = false

// Lazy, no a nivel de módulo: Next.js importa este archivo al "coleccionar"
// datos de cada ruta durante el build (incluida /api/cron/notificaciones, que
// no llega a ejecutar nada), así que un setVapidDetails() en el top-level
// tumbaba el build entero si la env var no estaba disponible en ese paso,
// en vez de fallar en runtime dentro del try/catch de abajo.
function asegurarVapid(): void {
  if (vapidConfigurado) return
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  )
  vapidConfigurado = true
}

/**
 * Manda el push a todos los dispositivos de la audiencia de un evento (mismo
 * rol/usuario que ya resolvió `emisor.ts` para la notificación in-app).
 *
 * Nunca lanza — mismo contrato que `emitir()`. Un push que falla no puede
 * tumbar el flujo de negocio que lo originó (se llama sin await desde ahí).
 * Suscripciones muertas (410 Gone / 404 Not Found — el usuario revocó el
 * permiso o desinstaló) se borran en el momento.
 */
export async function enviarPush(
  rolId: number | null,
  userId: string | null,
  payload: PayloadPush,
): Promise<void> {
  try {
    asegurarVapid()
    const suscripciones = await suscripcionesParaAudiencia(rolId, userId)
    if (suscripciones.length === 0) return

    const body = JSON.stringify(payload)

    await Promise.all(
      suscripciones.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            body,
          )
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode
          if (status === 404 || status === 410) {
            await eliminarSuscripcion(sub.endpoint)
          } else {
            console.error('[push] fallo al enviar a', sub.endpoint, err)
          }
        }
      }),
    )
  } catch (e) {
    console.error('[push] fallo al resolver audiencia:', e)
  }
}
