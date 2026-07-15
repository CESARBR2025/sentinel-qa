import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/auth/helpers'
import Link         from 'next/link'
import { DashboardHeader } from '@/components/partials/Header'
import { APP_VERSION } from "@/lib/constants"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const u = await getUserWithRole(session.user.id)

  if (!u?.esAdmin) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader user={user} roleLabel="Administración" backHref="/dashboard">
        <nav style={{ display: 'flex', gap: 32 }}>
          {[
            { label: 'Usuarios', href: '/admin/usuarios' },
            { label: 'Roles',    href: '/admin/roles'    },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.18em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </DashboardHeader>

      <main style={{ padding: '40px 48px' }}>
        {children}
      </main>

      <footer style={{ padding: '24px 48px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
        SSPM · SAN JUAN DEL RÍO · QRO · CENTINELA {APP_VERSION}
      </footer>
    </div>
  )
}
