import Link from 'next/link'
import { ClipboardList } from 'lucide-react'
import { ProfileDropdown } from '@/components/agente_juzgado/ProfileDropdown'
import { ToastExito } from '@/components/agente_juzgado/ToastExito'
import { obtenerDashboardJuzgado } from '@/lib/agente_juzgado/actions'

export default async function JuzgadoDashboardPage({ searchParams }: { searchParams: Promise<{ exito?: string }> }) {
  const user = await obtenerDashboardJuzgado()

  const params = await searchParams

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <ToastExito show={params.exito === '1'} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .card-j {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 32px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          display: flex;
          flex-direction: column;
          min-height: 280px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          cursor: pointer;
          position: relative;
          overflow: hidden;
          width: 100%;
          max-width: 520px;
        }
        .card-j:hover {
          border-color: #059669;
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -12px rgba(5,150,105,0.15);
        }
        .card-j:hover .cj-top { width: 100%; }
        .card-j:hover .cj-left { height: 100%; }
        .card-j:hover .cj-icon { color: #059669; transform: scale(1.1); }
        .card-j:hover .cj-arrow { transform: translateX(5px); }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 64px', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          paddingBottom: 24, borderBottom: '1px solid #e2e8f0',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#059669' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <img src="/logo_sentinel.png" alt="S" style={{ height: 56, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#059669', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#059669', display: 'inline-block' }}></span>
                Agente Juzgado
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 42, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                SENTINEL · JUZGADO
              </h1>
            </div>
          </div>

          <ProfileDropdown name={user.name} apellido={user.apellido} email={user.email} />

        </div>

        {/* Content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40 }}>

          {/* Card */}
          <Link href="/agente_juzgado/solicitudes" className="card-j" style={{ textDecoration: 'none' }}>
            <div className="cj-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#059669', transition: 'width 0.4s ease', width: 32 }}></div>
            <div className="cj-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#059669', transition: 'height 0.4s ease', height: 32 }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="cj-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <ClipboardList size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }}></span>
                ACCIÓN RÁPIDA
              </div>
            </div>

            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '0.02em', color: '#0f172a' }}>
                Reportes de Denuncias
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Solicitudes de reportes de denuncias
              </p>
            </div>

          </Link>

        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'auto', paddingTop: 24,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1 · JUZGADO</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#059669' }}></span>
          </div>
        </div>

      </div>
    </div>
  )
}
