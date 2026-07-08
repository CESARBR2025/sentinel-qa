'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { query }          from '@/lib/db'
import { aplicarPlantillaRol } from '@/lib/monitorista/permisos'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const u = await query<{ rolnombre: string }>(
    `SELECT r.nombre AS rolnombre
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [session.user.id],
  )

  if (u.rows[0]?.rolnombre !== 'Administrador') redirect('/dashboard')
  return session
}

export async function createUser(formData: FormData) {
  await requireAdmin()

  const nombre   = formData.get('nombre')   as string
  const apellido = (formData.get('apellido') as string) || ''
  const email    = formData.get('email')    as string
  const password = formData.get('password') as string
  const rolIdStr = formData.get('rolId')    as string
  const rolId    = rolIdStr ? Number(rolIdStr) : null

  try {
    const result = await auth.api.signUpEmail({
      body: { email, password, name: nombre, apellido },
    })

    if (rolId && result?.user?.id) {
      await query(
        `UPDATE users SET rol_id = $1 WHERE id = $2`,
        [rolId, result.user.id],
      )
      await aplicarPlantillaRol(result.user.id, rolId)
    }

    // Clean up auto-created session (admin creating user ≠ logging in as that user)
    if (result?.token) {
      await query(
        `DELETE FROM sessions WHERE token = $1`,
        [result.token],
      )
    }
  } catch (e) {
    // Rethrow Next.js internal redirect/notFound errors
    if (e && typeof e === 'object' && 'digest' in e) throw e
    redirect('/admin/usuarios/nuevo?error=email_en_uso')
  }

  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios?exito=creado')
}

export async function updateUser(formData: FormData) {
  await requireAdmin()

  const userId   = formData.get('userId')   as string
  const nombre   = formData.get('nombre')   as string
  const apellido = (formData.get('apellido') as string) || ''
  const rolIdStr = formData.get('rolId')    as string
  const rolId    = rolIdStr ? Number(rolIdStr) : null
  const activo   = formData.get('activo') === 'true'

  const antes = await query<{ rolid: number }>(
    `SELECT rol_id AS rolid FROM users WHERE id = $1 LIMIT 1`,
    [userId],
  )

  await query(
    `UPDATE users SET name = $1, apellido = $2, rol_id = $3, activo = $4, updated_at = now() WHERE id = $5`,
    [nombre, apellido, rolId, activo, userId],
  )

  if (rolId && rolId !== antes.rows[0]?.rolid) {
    await aplicarPlantillaRol(userId, rolId)
  }

  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios?exito=actualizado')
}
