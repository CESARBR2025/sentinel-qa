'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db }             from '@/lib/db/index'
import { users, roles, sessions } from '@/lib/db/schema'
import { eq, sql }             from 'drizzle-orm'
import { aplicarPlantillaRol } from '@/lib/monitorista/permisos'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const [u] = await db
    .select({ rolNombre: roles.nombre })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (u?.rolNombre !== 'Administrador') redirect('/dashboard')
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
      await db.update(users)
        .set({ rolId })
        .where(eq(users.id, result.user.id))
      await aplicarPlantillaRol(result.user.id, rolId)
    }

    // Clean up auto-created session (admin creating user ≠ logging in as that user)
    if (result?.token) {
      await db.delete(sessions).where(eq(sessions.token, result.token))
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

  const [antes] = await db.select({ rolId: users.rolId }).from(users).where(eq(users.id, userId)).limit(1)

  await db.update(users)
    .set({ name: nombre, apellido, rolId, activo, updatedAt: sql`now()` })
    .where(eq(users.id, userId))

  if (rolId && rolId !== antes?.rolId) {
    await aplicarPlantillaRol(userId, rolId)
  }

  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios?exito=actualizado')
}
