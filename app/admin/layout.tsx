import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/auth/helpers'
import Link         from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const u = await getUserWithRole(session.user.id)

  if (u?.rolNombre !== 'Administrador') redirect('/dashboard')

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 48px', display: 'flex', alignItems: 'center', gap: 24, background: '#ffffff' }}>
        <Link
          href="/dashboard"
          style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          ← Dashboard
        </Link>
        <div style={{ width: 1, height: 16, background: '#e2e8f0' }} />
        <div>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase', fontWeight: 600 }}>
            Sistema
          </span>
          <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: 12, color: '#0f172a' }}>
            ADMINISTRACIÓN
          </span>
        </div>

        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 32 }}>
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
      </header>

      <main style={{ padding: '40px 48px' }}>
        {children}
      </main>

      <footer style={{ padding: '24px 48px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
        SSPM · SAN JUAN DEL RÍO · QRO · CENTINELA v0.1
      </footer>
    </div>
  )
}
