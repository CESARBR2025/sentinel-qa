import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link         from 'next/link'
import PrevencionNav from './PrevencionNav'
import { CampanillaNotificaciones } from '@/components/notificaciones/CampanillaNotificaciones'
import { generarAlertasBusquedas }  from '@/lib/notificaciones/checker'
import { listarNotificacionesNoLeidas } from '@/lib/notificaciones/repository'

export default async function PrevencionLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  // Generate alerts for this user (idempotent)
  await generarAlertasBusquedas(session.user.id)

  // Fetch initial unread notifications to pass as SSR props
  const initialNotifs = await listarNotificacionesNoLeidas(session.user.id)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Barra superior */}
      <header style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: 56, display: 'flex', alignItems: 'center', gap: 24 }}>
        <Link
          href="/dashboard"
          style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          ← Dashboard
        </Link>
        <div style={{ width: 1, height: 16, background: '#e2e8f0' }} />
        <div>
          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase' }}>
            Prevención del Delito
          </span>
          <span style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.08em', textTransform: 'uppercase', marginLeft: 12, color: '#0f172a' }}>
            ATENCIÓN A <span style={{ color: '#1f355a' }}>VÍCTIMAS</span>
          </span>
        </div>

        {/* Campanilla — top right */}
        <div style={{ marginLeft: 'auto' }}>
          <CampanillaNotificaciones initialNotifs={initialNotifs} />
        </div>
      </header>

      {/* Sub-navegación */}
      <PrevencionNav />

      {/* Contenido */}
      <main style={{ padding: '40px 48px' }}>
        {children}
      </main>

      <footer style={{ padding: '24px 48px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
        SSPM · SAN JUAN DEL RÍO · QRO · SENTINEL v0.1
      </footer>
    </div>
  )
}
