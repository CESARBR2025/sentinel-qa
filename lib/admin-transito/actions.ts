'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db/index'
import { users, roles, sessions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { query } from '@/lib/db'

async function requireAdminTransito() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const [u] = await db
    .select({ rolNombre: roles.nombre })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (u?.rolNombre !== 'admin_transito') redirect('/dashboard')
  return session
}

export async function crearOficial(formData: FormData) {
  await requireAdminTransito()

  const userId = formData.get('userId') as string | null
  const noNomina = (formData.get('noNomina') as string) || null
  const numeroEmpleado = (formData.get('numeroEmpleado') as string) || null
  const telefono = (formData.get('telefono') as string) || null
  const departamentoId = (formData.get('departamentoId') as string) || null
  const patrullaId = (formData.get('patrullaId') as string) || null

  const [rolOficial] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.nombre, 'Oficial de Campo'))
    .limit(1)

  if (!rolOficial) throw new Error('Rol Oficial de Campo no encontrado')

  if (userId) {
    await db.update(users).set({ rolId: rolOficial.id }).where(eq(users.id, userId))

    const existing = await query<{ id: string }>(
      `SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1`,
      [userId],
    )

    if (existing.rows.length) {
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

    revalidatePath('/admin-transito/oficiales')
    redirect('/admin-transito/oficiales?exito=reincorporado')
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const userName = (formData.get('userName') as string)?.toUpperCase() ?? ''
  const userApellido = (formData.get('userApellido') as string)?.toUpperCase() ?? ''

  if (!userName) {
    redirect('/admin-transito/oficiales/nuevo?error=nombre_requerido')
  }

  try {
    const result = await auth.api.signUpEmail({
      body: { email, password, name: userName, apellido: userApellido },
    })

    if (!result?.user?.id) throw new Error('Error al crear usuario')

    await db
      .update(users)
      .set({ rolId: rolOficial.id })
      .where(eq(users.id, result.user.id))

    await query(
      `INSERT INTO ofi_oficiales
        (user_id, no_nomina, numero_empleado, telefono,
         departamento_id, patrulla_id, ofi_estatus)
       VALUES ($1, $2, $3, $4, $5, $6, 'activo')`,
      [result.user.id, noNomina, numeroEmpleado, telefono, departamentoId, patrullaId],
    )

    if (result?.token) {
      await db.delete(sessions).where(eq(sessions.token, result.token))
    }
  } catch (e) {
    if (e && typeof e === 'object' && 'digest' in e) throw e
    redirect('/admin-transito/oficiales/nuevo?error=email_en_uso')
  }

  revalidatePath('/admin-transito/oficiales')
  redirect('/admin-transito/oficiales/nuevo?exito=creado')
}

export async function obtenerOficialesLista() {
  await requireAdminTransito()

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

  return result.rows.map((row) => ({
    id: row.id as string,
    userName: (row.user_name as string) ?? '',
    userApellido: (row.user_apellido as string) ?? '',
    userEmail: (row.user_email as string) ?? '',
    noNomina: (row.no_nomina as string) ?? null,
    numeroEmpleado: (row.numero_empleado as string) ?? null,
    telefono: (row.telefono as string) ?? null,
    departamentoId: (row.departamento_id as string) ?? null,
    departamentoNombre: (row.departamento_nombre as string) ?? null,
    patrullaId: (row.patrulla_id as string) ?? null,
    patrullaUnidad: (row.patrulla_unidad as string) ?? null,
    userId: (row.user_id as string) ?? null,
    ofiEstatus: (row.ofi_estatus as string) ?? 'activo',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }))
}

export async function destituirOficial(formData: FormData) {
  await requireAdminTransito()

  const oficialId = formData.get('oficialId') as string
  const userId = formData.get('userId') as string

  if (!oficialId || !userId) {
    redirect('/admin-transito/oficiales?error=datos_invalidos')
  }

  await query(`UPDATE ofi_oficiales SET ofi_estatus = 'destituido', updated_at = NOW() WHERE id = $1`, [oficialId])
  await db.update(users).set({ rolId: 39 }).where(eq(users.id, userId))

  revalidatePath('/admin-transito/oficiales')
  redirect('/admin-transito/oficiales?exito=destituido')
}

export async function reactivarOficialConDatos(formData: FormData) {
  await requireAdminTransito()

  const oficialId = formData.get('oficialId') as string
  const userId = formData.get('userId') as string
  const noNomina = (formData.get('noNomina') as string) || null
  const telefono = (formData.get('telefono') as string) || null
  const departamentoId = (formData.get('departamentoId') as string) || null
  const patrullaId = (formData.get('patrullaId') as string) || null

  if (!oficialId || !userId) {
    redirect('/admin-transito/oficiales?error=datos_invalidos')
  }

  const [rolOficial] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.nombre, 'Oficial de Campo'))
    .limit(1)

  if (!rolOficial) throw new Error('Rol Oficial de Campo no encontrado')

  await query(
    `UPDATE ofi_oficiales SET
      no_nomina = $1, telefono = $2,
      departamento_id = $3, patrulla_id = $4,
      ofi_estatus = 'activo', updated_at = NOW()
    WHERE id = $5`,
    [noNomina, telefono, departamentoId, patrullaId, oficialId],
  )
  await db.update(users).set({ rolId: rolOficial.id }).where(eq(users.id, userId))

  revalidatePath('/admin-transito/oficiales')
  redirect('/admin-transito/oficiales?exito=reactivado')
}

export async function obtenerOficialPorId(id: string) {
  await requireAdminTransito()

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

  if (!result.rows.length) return null

  const row = result.rows[0]
  return {
    id: row.id as string,
    userName: (row.user_name as string) ?? '',
    userApellido: (row.user_apellido as string) ?? '',
    userEmail: (row.user_email as string) ?? '',
    noNomina: (row.no_nomina as string) ?? null,
    numeroEmpleado: (row.numero_empleado as string) ?? null,
    telefono: (row.telefono as string) ?? null,
    departamentoId: (row.departamento_id as string) ?? null,
    departamentoNombre: (row.departamento_nombre as string) ?? null,
    patrullaId: (row.patrulla_id as string) ?? null,
    patrullaUnidad: (row.patrulla_unidad as string) ?? null,
    userId: (row.user_id as string) ?? null,
    ofiEstatus: (row.ofi_estatus as string) ?? 'activo',
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

export async function actualizarOficial(formData: FormData) {
  await requireAdminTransito()

  const id = formData.get('id') as string
  const userId = formData.get('userId') as string | null
  const userName = (formData.get('userName') as string)?.toUpperCase() || null
  const userApellido = (formData.get('userApellido') as string)?.toUpperCase() || null
  const userEmail = (formData.get('userEmail') as string) || null
  const noNomina = (formData.get('noNomina') as string) || null
  const numeroEmpleado = (formData.get('numeroEmpleado') as string) || null
  const telefono = (formData.get('telefono') as string) || null
  const departamentoId = (formData.get('departamentoId') as string) || null
  const patrullaId = (formData.get('patrullaId') as string) || null

  if (!id) {
    redirect(`/admin-transito/oficiales?error=datos_invalidos`)
  }

  if (userId) {
    const updateData: Record<string, string> = {}
    if (userName) updateData.name = userName
    if (userApellido) updateData.apellido = userApellido
    if (userEmail) updateData.email = userEmail
    if (Object.keys(updateData).length) {
      await db.update(users).set(updateData).where(eq(users.id, userId))
    }
  }

  await query(
    `UPDATE ofi_oficiales SET
      no_nomina = $1, numero_empleado = $2, telefono = $3,
      departamento_id = $4, patrulla_id = $5,
      updated_at = NOW()
    WHERE id = $6`,
    [noNomina, numeroEmpleado, telefono, departamentoId, patrullaId, id],
  )

  revalidatePath('/admin-transito/oficiales')
  redirect('/admin-transito/oficiales?exito=actualizado')
}

export async function buscarUsuariosReincorporar(queryStr: string) {
  await requireAdminTransito()

  if (!queryStr || queryStr.length < 2) return []

  const like = `%${queryStr}%`
  const result = await query<{ id: string; name: string; apellido: string; email: string }>(
    `SELECT id, name, apellido, email
     FROM users
     WHERE rol_id = 39
       AND (name ILIKE $1 OR apellido ILIKE $1 OR email ILIKE $1)
     ORDER BY name ASC
     LIMIT 10`,
    [like],
  )

  return result.rows.map((r) => ({
    id: r.id,
    name: r.name,
    apellido: r.apellido,
    email: r.email,
  }))
}
