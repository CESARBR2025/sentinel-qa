import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/auth/helpers'

export default async function MonitoristaLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const userWithRole = await getUserWithRole(session.user.id)

  const rol = userWithRole?.rolNombre
  if (rol !== 'Monitorista' && rol !== 'Administrador') redirect('/dashboard')

  return <>{children}</>
}
