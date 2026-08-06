import { query } from '@/lib/db'
import type { PushSubscriptionRow, SuscripcionCliente } from './types'

function rowToSuscripcion(row: Record<string, unknown>): PushSubscriptionRow {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    endpoint: String(row.endpoint),
    p256dh: String(row.p256dh),
    auth: String(row.auth),
  }
}

/** Alta o refresco de una suscripción. `endpoint` es único por dispositivo+navegador. */
export async function guardarSuscripcion(
  userId: string,
  sub: SuscripcionCliente,
  userAgent: string | null,
): Promise<void> {
  await query(
    `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent, ultimo_uso)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (endpoint) DO UPDATE SET
       user_id = EXCLUDED.user_id,
       p256dh = EXCLUDED.p256dh,
       auth = EXCLUDED.auth,
       user_agent = EXCLUDED.user_agent,
       ultimo_uso = NOW()`,
    [userId, sub.endpoint, sub.keys.p256dh, sub.keys.auth, userAgent],
  )
}

export async function eliminarSuscripcion(endpoint: string): Promise<void> {
  await query(`DELETE FROM push_subscriptions WHERE endpoint = $1`, [endpoint])
}

/** ¿Este dispositivo (endpoint) ya está suscrito? Para pintar el estado del toggle. */
export async function tieneSuscripcion(userId: string, endpoint: string): Promise<boolean> {
  const result = await query(
    `SELECT 1 FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2`,
    [userId, endpoint],
  )
  return result.rows.length > 0
}

/**
 * Suscripciones de todos los destinatarios de un evento — mismo criterio de
 * audiencia que `notificaciones_eventos` (rol O usuario directo), pero acá
 * hace falta expandir el rol a personas reales porque el push va por
 * dispositivo, no por rol.
 */
export async function suscripcionesParaAudiencia(
  rolId: number | null,
  userId: string | null,
): Promise<PushSubscriptionRow[]> {
  if (!rolId && !userId) return []
  const result = await query<Record<string, unknown>>(
    `SELECT ps.id, ps.user_id, ps.endpoint, ps.p256dh, ps.auth
       FROM push_subscriptions ps
       JOIN users u ON u.id = ps.user_id
      WHERE (u.rol_id = $1 AND u.activo = true) OR ps.user_id = $2`,
    [rolId, userId],
  )
  return result.rows.map(rowToSuscripcion)
}
