import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { tienePermiso } from '@/lib/monitorista/permisos'

export default async function MonitoristaLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tienePermiso(session.user.id, 'solicitudes', 'ver'))) redirect('/dashboard')

  return <>{children}</>
}
