import { query } from '@/lib/db'

export interface UserWithRole {
  id: string
  name: string
  apellido: string
  email: string
  rolId: number | null
  rolNombre: string | null
  activo: boolean
}

export function rowToUserWithRole(row: Record<string, unknown>): UserWithRole {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    apellido: String(row.apellido ?? ''),
    email: String(row.email ?? ''),
    rolId: row.rol_id ? Number(row.rol_id) : null,
    rolNombre: row.rol_nombre ? String(row.rol_nombre) : null,
    activo: Boolean(row.activo),
  }
}

export async function getUserWithRole(userId: string): Promise<UserWithRole | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT u.*, r.nombre AS rol_nombre
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [userId],
  )
  return result.rows.length ? rowToUserWithRole(result.rows[0]) : null
}
