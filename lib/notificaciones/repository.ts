import { query } from '@/lib/db'
import type { Notificacion } from './types'
import { rowToNotificacion } from './mapper'

export async function listarNotificacionesNoLeidas(userId: string): Promise<Notificacion[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, user_id AS "userId", tipo, titulo, mensaje, href, leida, ficha_id AS "fichaId", hito, creado_en AS "creadoEn" FROM notificaciones WHERE user_id = $1 AND leida = $2 ORDER BY creado_en DESC`,
    [userId, false],
  )
  return result.rows.map(rowToNotificacion)
}

export async function marcarNotificacionLeida(notifId: string, userId: string) {
  await query(
    `UPDATE notificaciones SET leida = true WHERE id = $1 AND user_id = $2`,
    [notifId, userId],
  )
}

export async function marcarTodasNotificacionesLeidas(userId: string) {
  await query(
    `UPDATE notificaciones SET leida = true WHERE user_id = $1`,
    [userId],
  )
}

export async function eliminarAlertasBusqueda(userId: string) {
  await query(
    `DELETE FROM notificaciones WHERE user_id = $1 AND tipo = 'busqueda_plazo'`,
    [userId],
  )
}
