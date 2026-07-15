import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { tienePermiso } from '@/lib/permisos/core'

export default async function CorralonLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const puedeAcceder = await tienePermiso(session.user.id, 'corralon_solicitudes', 'ver')
  if (!puedeAcceder) redirect('/dashboard')

  return <>{children}</>
}
