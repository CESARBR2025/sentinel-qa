import { query } from '@/lib/db'
import type { RolRow } from './types'

export async function obtenerRolUsuario(userId: string): Promise<string> {
  const result = await query<RolRow>(
    `SELECT r.nombre AS rol
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [userId]
  )
  return result.rows[0]?.rol ?? ''
}
