import { query } from '@/lib/db'

export async function verificarRolAgente911(userId: string): Promise<boolean> {
  const result = await query<{ nombre: string }>(
    `SELECT r.nombre FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = $1 LIMIT 1`,
    [userId],
  )
  return result.rows[0]?.nombre === 'agente_911'
}
