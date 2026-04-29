import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { db }       from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import { eq }       from 'drizzle-orm'
import Link         from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const [u] = await db
    .select({ rolNombre: roles.nombre })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (u?.rolNombre !== 'Administrador') redirect('/dashboard')

  return (
    <div style={{ minHeight: '100vh', background: '#070b16', color: '#d8e0f0', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <header style={{ borderBottom: '1px solid #1b2742', padding: '16px 48px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link
          href="/dashboard"
          style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.25em', color: '#4a5878', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          ← Dashboard
        </Link>
        <div style={{ width: 1, height: 16, background: '#1b2742' }} />
        <div>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#c0223a', textTransform: 'uppercase' }}>
            Sistema
          </span>
          <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: 12, color: '#d8e0f0' }}>
            ADMINISTRACIÓN
          </span>
        </div>

        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 32 }}>
          {[
            { label: 'Usuarios', href: '/admin/usuarios' },
            { label: 'Roles',    href: '/admin/roles'    },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.18em', color: '#8a9bc0', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <main style={{ padding: '40px 48px' }}>
        {children}
      </main>

      <footer style={{ padding: '24px 48px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#2a3a5e', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center', borderTop: '1px solid #1b2742' }}>
        SSPM · SAN JUAN DEL RÍO · QRO · SENTINEL v0.1
      </footer>
    </div>
  )
}
