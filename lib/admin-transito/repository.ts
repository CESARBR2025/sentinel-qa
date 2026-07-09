import { query } from '@/lib/db'

export async function getUserRole(userId: string): Promise<string | null> {
  const result = await query<{ rol_nombre: string }>(
    `SELECT r.nombre AS rol_nombre
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [userId],
  )
  return result.rows[0]?.rol_nombre ?? null
}
