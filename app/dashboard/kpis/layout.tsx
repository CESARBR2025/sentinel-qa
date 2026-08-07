import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/auth/helpers'
import { DashboardHeader } from '@/components/partials/Header'

export default async function KpisLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const u = await getUserWithRole(session.user.id)
  if (!u?.esAdmin) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-background)',
      color: '#1e293b',
      fontFamily: 'var(--apple-font-display)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      <DashboardHeader user={user} variant="apple" backHref="/dashboard" roleLabel="KPIs Generales" />
      <div className="pad-dashboard" style={{ flex: 1, width: '100%' }}>
        {children}
      </div>
    </main>
  )
}
