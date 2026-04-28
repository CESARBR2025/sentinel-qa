import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignOutButton } from './sign-out-button'
import { Enable2FA } from './enable-2fa'
import { ModuleCards } from './module-cards'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = session.user as {
    name: string; apellido?: string; email: string; twoFactorEnabled?: boolean
  }

  return (
    <main style={{ minHeight: '100vh', background: '#070b16', color: '#d8e0f0', fontFamily: 'Inter,system-ui,sans-serif', padding: '48px 56px', position: 'relative', overflow: 'hidden' }}>
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
          position: fixed; left: 0; width: 100%; height: 50vh; background: #050810; z-index: 9998;
          pointer-events: none;
        }
        .top-shutter { 
          top: 0; border-bottom: 2px solid #d4a43a; 
          box-shadow: 0 10px 40px rgba(212,164,58,0.15);
          animation: openTop 0.5s cubic-bezier(0.8, 0, 0.2, 1) forwards; 
        }
        .bottom-shutter { 
          bottom: 0; border-top: 2px solid #d4a43a; 
          box-shadow: 0 -10px 40px rgba(212,164,58,0.15);
          animation: openBottom 0.5s cubic-bezier(0.8, 0, 0.2, 1) forwards; 
        }
        .shutter-acc { position: absolute; left: 50%; transform: translateX(-50%); width: 140px; height: 4px; background: #d4a43a; }
        .top-shutter .shutter-acc { bottom: 0; }
        .bottom-shutter .shutter-acc { top: 0; }

        /* Sharp Data Reveal */
        @keyframes dataReveal {
          0% { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0 0 0); }
        }
        .cyber-reveal { animation: dataReveal 0.4s cubic-bezier(0.1, 0.9, 0.2, 1) both; }
        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.3s; }
        .delay-3 { animation-delay: 0.4s; }
        .delay-4 { animation-delay: 0.5s; }
        
        /* Grid Flash */
        @keyframes gridFlash {
          0% { opacity: 0; }
          15% { opacity: 0.3; }
          100% { opacity: 0.04; }
        }
        .grid-bg {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image: linear-gradient(rgba(212,164,58,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,164,58,1) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: gridFlash 1.2s ease-out forwards;
        }
      `}</style>
      
      {/* Tactical Shutters */}
      <div className="shutter top-shutter"><div className="shutter-acc"></div></div>
      <div className="shutter bottom-shutter"><div className="shutter-acc"></div></div>

      <div className="grid-bg"></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="cyber-reveal delay-1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, paddingBottom: 24, borderBottom: '1px solid #1b2742' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#c0223a', textTransform: 'uppercase', marginBottom: 8 }}>
              Tablero
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <img src="/logo_sentinel.png" alt="S" style={{ height: 56, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(212,164,58,0.4))' }} />
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 48, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#d8e0f0', lineHeight: 1 }}>
                ENTINEL
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#d4a43a', letterSpacing: '0.12em' }}>
                {user.name} {user.apellido ?? ''}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.1em', marginTop: 2 }}>
                {user.email}
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>

        {/* Módulos */}
        <div className="cyber-reveal delay-2">
          <ModuleCards />
        </div>

        {/* Seguridad de cuenta */}
        <div className="cyber-reveal delay-3" style={{ borderTop: '1px solid #1b2742', paddingTop: 32, marginTop: 16 }}>
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.28em', color: '#4a5878', textTransform: 'uppercase', marginBottom: 16 }}>
            › Seguridad de la cuenta
          </div>
          <div style={{ maxWidth: 420 }}>
            <Enable2FA enabled={!!user.twoFactorEnabled} />
          </div>
        </div>

        <div className="cyber-reveal delay-4" style={{ marginTop: 48, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#2a3a5e', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center' }}>
          SSPM · SAN JUAN DEL RÍO · QRO · SENTINEL v0.1
        </div>
      </div>
    </main>
  )
}
