import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignOutButton } from './sign-out-button'
import { Enable2FA } from './enable-2fa'
import { ModuleCards } from './module-cards'
import { db } from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  // Redirect Oficial de Campo to their dedicated view
  const [userRole] = await db
    .select({ rolNombre: roles.nombre })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .where(eq(users.id, session.user.id))
    .limit(1)

  if (userRole?.rolNombre === 'Oficial de Campo') redirect('/oficial')
  if (userRole?.rolNombre === 'agente_fiscalia') redirect('/fiscalia')
  if (userRole?.rolNombre === 'agente_juzgado') redirect('/agente_juzgado')
  if (userRole?.rolNombre === 'agente_liberaciones') redirect('/agente_liberaciones')
  if (userRole?.rolNombre === 'agente_infracciones') redirect('/agente_infracciones')
  if (userRole?.rolNombre === 'Monitorista') redirect('/monitorista')
  if (userRole?.rolNombre === 'Auxiliar') redirect('/auxiliar')

  const user = session.user as {
    name: string; apellido?: string; email: string; twoFactorEnabled?: boolean
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,system-ui,sans-serif', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        
        /* Tactical Shutters */
        @keyframes openTop { 
          0%, 10% { transform: translateY(0); }
          100% { transform: translateY(-100vh); }
        }
        @keyframes openBottom { 
          0%, 10% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        .shutter {
          position: fixed; left: 0; width: 100%; height: 50vh; background: #f1f5f9; z-index: 9998;
          pointer-events: none;
        }
        .top-shutter { 
          top: 0; border-bottom: 2px solid #3b82f6; 
          box-shadow: 0 10px 40px rgba(212,164,58,0.15);
          animation: openTop 0.5s cubic-bezier(0.8, 0, 0.2, 1) forwards; 
        }
        .bottom-shutter { 
          bottom: 0; border-top: 2px solid #3b82f6; 
          box-shadow: 0 -10px 40px rgba(212,164,58,0.15);
          animation: openBottom 0.5s cubic-bezier(0.8, 0, 0.2, 1) forwards; 
        }
        .shutter-acc { position: absolute; left: 50%; transform: translateX(-50%); width: 140px; height: 4px; background: #3b82f6; }
        .top-shutter .shutter-acc { bottom: 0; }
        .bottom-shutter .shutter-acc { top: 0; }

        /* Sharp Data Reveal */
        @keyframes dataReveal {
          0% { clip-path: inset(0 100% 0 0); opacity: 0; transform: translateX(-10px); }
          100% { clip-path: inset(0 0 0 0); opacity: 1; transform: translateX(0); }
        }
        .cyber-reveal { animation: dataReveal 0.6s cubic-bezier(0.1, 0.9, 0.2, 1) both; }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.4s; }
        .delay-4 { animation-delay: 0.5s; }
        
        /* Grid Flash */
        @keyframes gridFlash {
          0% { opacity: 0; }
          15% { opacity: 0.3; }
          100% { opacity: 0.03; }
        }
        .grid-bg {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridFlash 1.5s ease-out forwards;
        }


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

      {/* Tactical Overlays */}
      <div className="shutter top-shutter"><div className="shutter-acc"></div></div>
      <div className="shutter bottom-shutter"><div className="shutter-acc"></div></div>
      <div className="grid-bg"></div>

      {/* Main Content Container */}
      <div style={{ position: 'relative', zIndex: 1, padding: '40px 64px', maxWidth: 1600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh' }}>

        {/* Header HUD */}
        <div className="cyber-reveal delay-1" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: 24, borderBottom: '1px solid #e2e8f0',
          position: 'relative'
        }}>
          {/* Corner Decorator */}
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 2, background: '#2563eb' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <img src="/logo_sentinel.png" alt="S" style={{ height: 64, objectFit: 'contain', filter: 'drop-shadow(0 0 16px rgba(212,164,58,0.3))' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#3b82f6', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#3b82f6', display: 'inline-block' }}></span>
                Sistema Táctico
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 56, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1}}>
                SENTINEL
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Operador Identificado
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 13, color: '#2563eb', letterSpacing: '0.12em', fontWeight: 600 }}>
                {user.name} {user.apellido ?? ''}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.08em' }}>
                {user.email}
              </div>
            </div>

            <div style={{ width: 1, height: 48, background: '#e2e8f0' }}></div>

            <SignOutButton />
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="dashboard-grid" style={{ flex: 1 }}>

          {/* Principal (ModuleCards) */}
          <div className="cyber-reveal delay-2">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 4, height: 16, background: '#3b82f6' }}></div>
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 24, fontWeight: 700, letterSpacing: '0.08em', color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
                Módulos Operativos
              </h2>
            </div>

            <ModuleCards />
          </div>

          {/* Lateral (Status / Auth) */}
          <div className="cyber-reveal delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Security Panel */}
            <div style={{
              background: '#ffffff', backdropFilter: 'blur(10px)',
              border: '1px solid #e2e8f0', padding: 32, position: 'relative'
            }}>
              {/* Decorators */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: '2px solid rgba(59, 130, 246, 0.3)', borderLeft: '2px solid rgba(59, 130, 246, 0.3)' }}></div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: '2px solid rgba(59, 130, 246, 0.3)', borderRight: '2px solid rgba(59, 130, 246, 0.3)' }}></div>

              <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#475569', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Seguridad de la Cuenta
              </h3>

              <Enable2FA enabled={!!user.twoFactorEnabled} />
            </div>

            {/* System Status Panel */}
            <div style={{
              background: '#ffffff', backdropFilter: 'blur(10px)',
              border: '1px solid #e2e8f0', padding: 32, position: 'relative',
              display: 'flex', flexDirection: 'column', gap: 16
            }}>
              <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#475569', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                Estado del Sistema
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px dashed #e2e8f0' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#5c74a1' }}>NÚCLEO DB</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#4a9e6a', fontWeight: 600 }}>CONECTADO</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px dashed #e2e8f0' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#5c74a1' }}>LATENCIA RED</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#1e293b' }}>12ms</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#5c74a1' }}>ÚLTIMA SINCRONIZACIÓN</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#1e293b' }}>Hace 2 min</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="cyber-reveal delay-4" style={{
          marginTop: 'auto', paddingTop: 24,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#3b82f6' }}></span>
          </div>
        </div>

      </div>
    </main>
  )
}
