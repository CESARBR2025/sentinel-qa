import { query } from '@/lib/db'
import type { RolItem, UsuarioLista } from './types'
import { rowToRol, rowToUsuarioLista } from './mapper'

export async function listarUsuarios(): Promise<UsuarioLista[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT u.id, u.name, u.apellido, u.email, u.email_verified, u.image,
            u.rol_id, u.activo, u.two_factor_enabled, u.created_at, r.nombre AS rol_nombre
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     ORDER BY u.created_at ASC`
  )
  return result.rows.map(rowToUsuarioLista)
}

export async function obtenerUsuario(id: string): Promise<UsuarioLista | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT u.id, u.name, u.apellido, u.email, u.email_verified, u.image,
            u.rol_id, u.activo, u.two_factor_enabled, u.created_at, r.nombre AS rol_nombre
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [id],
  )
  return result.rows.length ? rowToUsuarioLista(result.rows[0]) : null
}

export async function listarRolesActivos(): Promise<RolItem[]> {
  const result = await query<Record<string, unknown>>(
    'SELECT * FROM roles WHERE activo = $1 ORDER BY id ASC',
    [true],
  )
  return result.rows.map(rowToRol)
}

export async function listarRoles(): Promise<RolItem[]> {
  const result = await query<Record<string, unknown>>(
    'SELECT * FROM roles ORDER BY id ASC',
  )
  return result.rows.map(rowToRol)
}

export async function obtenerRol(id: number): Promise<RolItem | null> {
  const result = await query<Record<string, unknown>>(
    'SELECT * FROM roles WHERE id = $1 LIMIT 1',
    [id],
  )
  return result.rows.length ? rowToRol(result.rows[0]) : null
}
