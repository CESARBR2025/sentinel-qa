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

export async function existeRolPorNombre(nombre: string): Promise<boolean> {
  const result = await query<{ count: number }>(
    `SELECT COUNT(*)::int AS count FROM roles WHERE LOWER(nombre) = LOWER($1) LIMIT 1`,
    [nombre],
  )
  return Number(result.rows[0]?.count ?? 0) > 0
}

export async function crearRol(nombre: string, descripcion: string, activo: boolean): Promise<number> {
  const result = await query<{ id: number }>(
    `INSERT INTO roles (nombre, descripcion, activo)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [nombre, descripcion, activo],
  )
  return result.rows[0].id
}

export async function obtenerRolUsuario(userId: string): Promise<number | null> {
  const result = await query<{ rolid: number }>(
    `SELECT rol_id AS rolid FROM users WHERE id = $1 LIMIT 1`,
    [userId],
  )
  return result.rows[0]?.rolid ?? null
}

export async function actualizarUsuario(
  userId: string,
  data: { name: string; apellido: string; rolId: number | null; activo: boolean },
): Promise<void> {
  await query(
    `UPDATE users SET name = $1, apellido = $2, rol_id = $3, activo = $4, updated_at = now() WHERE id = $5`,
    [data.name, data.apellido, data.rolId, data.activo, userId],
  )
}

export async function asignarRolUsuario(userId: string, rolId: number): Promise<void> {
  await query(`UPDATE users SET rol_id = $1 WHERE id = $2`, [rolId, userId])
}

export async function eliminarSesion(token: string): Promise<void> {
  await query(`DELETE FROM sessions WHERE token = $1`, [token])
}
