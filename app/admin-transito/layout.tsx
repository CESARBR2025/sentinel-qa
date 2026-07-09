import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '@/lib/db'
import { ProfileDropdown } from '@/components/oficial/ProfileDropdown'

export default async function AdminTransitoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const uResult = await query<any>(
    `SELECT r.nombre AS rol_nombre
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [session.user.id]
  )
  const u = uResult.rows[0]

  if (u?.rol_nombre !== 'admin_transito') redirect('/dashboard')

  const user = session.user as {
    name: string
    apellido?: string
    email: string
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#1e293b',
        fontFamily: 'Inter,sans-serif',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '40px 64px',
          display: 'flex',
          flexDirection: 'column',
          gap: 48,
          minHeight: '100vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingBottom: 24,
            borderBottom: '1px solid #e2e8f0',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: -1,
              left: 0,
              width: 64,
              height: 3,
              background: '#2563eb',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <img
              src="/logo_sentinel.png"
              alt="S"
              style={{ height: 56, objectFit: 'contain' }}
            />
            <div>
              <div
                style={{
                  fontFamily: 'JetBrains Mono,monospace',
                  fontSize: 10,
                  letterSpacing: '0.3em',
                  color: '#2563eb',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    background: '#2563eb',
                    display: 'inline-block',
                  }}
                />
                Admin Tránsito
              </div>
              <h1
                style={{
                  fontFamily: 'Barlow Condensed,sans-serif',
                  fontWeight: 800,
                  fontSize: 42,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  margin: 0,
                  color: '#0f172a',
                  lineHeight: 1,
                }}
              >
                SENTINEL · ADMIN TRÁNSITO
              </h1>
            </div>
          </div>
          <ProfileDropdown
            name={user.name}
            apellido={user.apellido}
            email={user.email}
            mostrarPerfil={false}
            rolLabel="Admin Tránsito"
          />
        </div>

        {children}

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: 24,
            borderTop: '1px solid #e2e8f0',
            fontFamily: 'JetBrains Mono,monospace',
            fontSize: 10,
            color: '#94a3b8',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1 · ADMIN TRÁNSITO</span>
            <span
              style={{
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: '#2563eb',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}