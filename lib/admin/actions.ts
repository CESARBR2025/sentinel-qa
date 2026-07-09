'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getUserWithRole } from '@/lib/auth/helpers'
import { tryAction, tryActionRaw, AppError, ValidationError, NotFoundError, ForbiddenError, UnauthorizedError } from '@/lib/error-handler'
import { obtenerRolUsuario, actualizarUsuario, asignarRolUsuario, eliminarSesion } from './repository'
import { aplicarPlantillaRol } from '@/lib/monitorista/permisos'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = await getUserWithRole(session.user.id)
  if (user?.rolNombre !== 'Administrador') redirect('/dashboard')
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
      await asignarRolUsuario(result.user.id, rolId)
      await aplicarPlantillaRol(result.user.id, rolId)
    }

    // Clean up auto-created session (admin creating user ≠ logging in as that user)
    if (result?.token) {
      await eliminarSesion(result.token)
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

  const antes = await obtenerRolUsuario(userId)

  await tryActionRaw(async () => {
    await actualizarUsuario(userId, { name: nombre, apellido, rolId, activo })
    if (rolId && rolId !== antes) {
      await aplicarPlantillaRol(userId, rolId)
    }
  })

  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios?exito=actualizado')
}
