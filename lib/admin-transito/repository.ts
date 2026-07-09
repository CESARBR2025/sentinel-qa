import { query } from '@/lib/db'
import type { Departamento, OficialLista, UserBasico } from './types'
import { rowToDepartamento, rowToOficialLista, rowToUserBasico } from './mapper'

export async function listarDepartamentosActivos(): Promise<Departamento[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, clave, nombre FROM via.v2_departamentos WHERE activo = true ORDER BY nombre`,
  )
  return result.rows.map(rowToDepartamento)
}

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

export async function obtenerRolOficialCampo(): Promise<number> {
  const result = await query<{ id: number }>(
    `SELECT id FROM roles WHERE nombre = 'Oficial de Campo' LIMIT 1`,
  )
  if (!result.rows[0]) throw new Error('Rol Oficial de Campo no encontrado')
  return result.rows[0].id
}

export async function asignarRolUsuario(userId: string, rolId: number): Promise<void> {
  await query(`UPDATE users SET rol_id = $1 WHERE id = $2`, [rolId, userId])
}

export async function obtenerOficialExistente(userId: string): Promise<{ id: string } | null> {
  const result = await query<{ id: string }>(
    `SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1`,
    [userId],
  )
  return result.rows[0] ?? null
}

export async function upsertOficial(
  userId: string,
  noNomina: string | null,
  numeroEmpleado: string | null,
  telefono: string | null,
  departamentoId: string | null,
  patrullaId: string | null,
): Promise<void> {
  const existing = await obtenerOficialExistente(userId)
  if (existing) {
    await query(
      `UPDATE ofi_oficiales SET
        no_nomina = $1, numero_empleado = $2, telefono = $3,
        departamento_id = $4, patrulla_id = $5,
        ofi_estatus = 'activo', updated_at = NOW()
      WHERE user_id = $6`,
      [noNomina, numeroEmpleado, telefono, departamentoId, patrullaId, userId],
    )
  } else {
    await query(
      `INSERT INTO ofi_oficiales
        (user_id, no_nomina, numero_empleado, telefono,
         departamento_id, patrulla_id, ofi_estatus)
       VALUES ($1, $2, $3, $4, $5, $6, 'activo')`,
      [userId, noNomina, numeroEmpleado, telefono, departamentoId, patrullaId],
    )
  }
}

export async function eliminarSesion(token: string): Promise<void> {
  await query(`DELETE FROM sessions WHERE token = $1`, [token])
}

export async function listarOficiales(): Promise<OficialLista[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT
      o.*,
      u.name AS user_name,
      u.apellido AS user_apellido,
      u.email AS user_email,
      d.nombre AS departamento_nombre,
      p.numero_unidad AS patrulla_unidad
    FROM ofi_oficiales o
    LEFT JOIN users u ON u.id = o.user_id
    LEFT JOIN via.v2_departamentos d ON d.id = o.departamento_id
    LEFT JOIN via.v2_patrullas p ON p.id = o.patrulla_id
    ORDER BY o.created_at DESC`,
  )
  return result.rows.map(rowToOficialLista)
}

export async function destituirOficial(oficialId: string, userId: string): Promise<void> {
  await query(
    `UPDATE ofi_oficiales SET ofi_estatus = 'destituido', updated_at = NOW() WHERE id = $1`,
    [oficialId],
  )
  await query(`UPDATE users SET rol_id = 39 WHERE id = $1`, [userId])
}

export async function reactivarOficial(
  oficialId: string,
  userId: string,
  data: { noNomina: string | null; telefono: string | null; departamentoId: string | null; patrullaId: string | null },
): Promise<void> {
  await query(
    `UPDATE ofi_oficiales SET
      no_nomina = $1, telefono = $2,
      departamento_id = $3, patrulla_id = $4,
      ofi_estatus = 'activo', updated_at = NOW()
    WHERE id = $5`,
    [data.noNomina, data.telefono, data.departamentoId, data.patrullaId, oficialId],
  )
  await query(`UPDATE users SET rol_id = $1 WHERE id = $2`, [userId])
}

export async function obtenerOficialPorId(id: string): Promise<OficialLista | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT
      o.*,
      u.name AS user_name,
      u.apellido AS user_apellido,
      u.email AS user_email,
      d.nombre AS departamento_nombre,
      p.numero_unidad AS patrulla_unidad
    FROM ofi_oficiales o
    LEFT JOIN users u ON u.id = o.user_id
    LEFT JOIN via.v2_departamentos d ON d.id = o.departamento_id
    LEFT JOIN via.v2_patrullas p ON p.id = o.patrulla_id
    WHERE o.id = $1
    LIMIT 1`,
    [id],
  )
  return result.rows.length ? rowToOficialLista(result.rows[0]) : null
}

export async function actualizarUserInfo(
  userId: string,
  data: { userName: string | null; userApellido: string | null; userEmail: string | null },
): Promise<void> {
  await query(
    `UPDATE users
     SET name = CASE WHEN $1::text IS NOT NULL THEN $1 ELSE name END,
         apellido = CASE WHEN $2::text IS NOT NULL THEN $2 ELSE apellido END,
         email = CASE WHEN $3::text IS NOT NULL THEN $3 ELSE email END
     WHERE id = $4`,
    [data.userName, data.userApellido, data.userEmail, userId],
  )
}

export async function actualizarOficialRecord(
  id: string,
  data: { noNomina: string | null; numeroEmpleado: string | null; telefono: string | null; departamentoId: string | null; patrullaId: string | null },
): Promise<void> {
  await query(
    `UPDATE ofi_oficiales SET
      no_nomina = $1, numero_empleado = $2, telefono = $3,
      departamento_id = $4, patrulla_id = $5,
      updated_at = NOW()
    WHERE id = $6`,
    [data.noNomina, data.numeroEmpleado, data.telefono, data.departamentoId, data.patrullaId, id],
  )
}

export async function buscarUsuariosParaReincorporar(queryStr: string): Promise<UserBasico[]> {
  const like = `%${queryStr}%`
  const result = await query<Record<string, unknown>>(
    `SELECT id, name, apellido, email
     FROM users
     WHERE rol_id = 39
       AND (name ILIKE $1 OR apellido ILIKE $1 OR email ILIKE $1)
     ORDER BY name ASC
     LIMIT 10`,
    [like],
  )
  return result.rows.map(rowToUserBasico)
}
