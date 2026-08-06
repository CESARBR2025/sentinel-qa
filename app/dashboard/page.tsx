import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Enable2FA } from './enable-2fa'
import { ModuleCards } from './module-cards'
import { SspmGeneral } from './sspm-general'
import { FadeIn } from './fade-in'
import { getUserWithRole, obtenerHubRol } from '@/lib/auth/helpers'
import { DashboardHeader } from '@/components/partials/Header'
import { APP_VERSION } from "@/lib/constants"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const userWithRole = await getUserWithRole(session.user.id)

  // Administrador (esAdmin) nunca tiene hub propio — siempre ve el panel general.
  const hub = userWithRole?.esAdmin ? null : obtenerHubRol(userWithRole?.rolNombre)
  if (hub) redirect(hub)

  const user = session.user as {
    name: string; apellido?: string; email: string; twoFactorEnabled?: boolean
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--apple-font-display)', position: 'relative', overflowX: 'clip' }}>
      <style>{`
        /* Responsive Layout adjustments */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 48px;
          align-items: start;
        }
        @media (max-width: 1200px) {
          .dashboard-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Header — piloto Apple-style (DESIGN.md §10) */}
      <DashboardHeader user={user} variant="apple" />

      {/* Main Content Container */}
      <div className="pad-dashboard" style={{ position: 'relative', zIndex: 1, maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* Sección SSPM General (solo admin) — inicio de la segmentación por secciones */}
        {userWithRole?.esAdmin && <SspmGeneral />}

        {/* Dashboard Content Grid */}
        <div className="dashboard-grid" style={{ flex: 1 }}>

          {/* Principal (ModuleCards) */}
          <FadeIn delay={0.1}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 4, height: 16, background: '#1f355a' }}></div>
              <h2 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 24, fontWeight: 600, letterSpacing: 'normal', color: '#0f172a', margin: 0, textTransform: 'none' }}>
                Módulos operativos
              </h2>
            </div>

            <ModuleCards />
          </FadeIn>

          {/* Lateral (Status / Auth) — fijo al hacer scroll (solo desktop) */}
          <FadeIn delay={0.15}>
          <div className="panel-lateral" style={{
            display: 'flex', flexDirection: 'column', gap: 24,
          }}>

            {/* Security Panel */}
            <div style={{
              background: 'var(--apple-glass-bg)', backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid var(--apple-glass-border)', borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--apple-shadow-glass)', padding: 32, position: 'relative'
            }}>
              <h3 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Seguridad de la Cuenta
              </h3>

              <Enable2FA enabled={!!user.twoFactorEnabled} />
            </div>

            {/* System Status Panel */}
            <div style={{
              background: 'var(--apple-glass-bg)', backdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid var(--apple-glass-border)', borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--apple-shadow-glass)', padding: 32, position: 'relative',
              display: 'flex', flexDirection: 'column', gap: 16
            }}>
              <h3 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 15, fontWeight: 600, color: '#0f172a', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                Estado del Sistema
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px dashed #e2e8f0' }}>
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>Núcleo de base de datos</span>
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#16a34a', fontWeight: 600 }}>Conectado</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px dashed #e2e8f0' }}>
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>Latencia de red</span>
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#0f172a' }}>12 ms</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>Última sincronización</span>
                <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#0f172a' }}>Hace 2 min</span>
              </div>
            </div>

          </div>
          </FadeIn>
        </div>

        {/* Footer */}
        <FadeIn delay={0.2}>
        <div style={{
          marginTop: 'auto', paddingTop: 24,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#64748b',
          letterSpacing: 'normal', textTransform: 'none',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>SSPM · San Juan del Río · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Centinela {APP_VERSION}</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#1f355a' }}></span>
          </div>
        </div>
        </FadeIn>

      </div>
    </main>
  )
}