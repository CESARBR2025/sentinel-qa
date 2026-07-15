import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Shield } from 'lucide-react'
import { ProfileDropdown } from '@/components/oficial/ProfileDropdown'
import { verificarRolAgenteDespacho } from '@/lib/agente_despacho/service'
import { getStats } from '@/lib/911/service'

export default async function AgenteDespachoDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esDespacho = await verificarRolAgenteDespacho(session.user.id)
  if (!esDespacho) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hoyISO = hoy.toISOString()
  const stats = await getStats(hoyISO)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .card-911 {
          background: #ffffff; border: 1px solid #e2e8f0; padding: 32px;
          text-decoration: none; transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          display: flex; flex-direction: column; min-height: 280px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); cursor: pointer;
          position: relative; overflow: hidden; width: 100%; max-width: 520px;
        }
        .card-911:hover { border-color: #1f355a; transform: translateY(-5px); box-shadow: 0 20px 40px -12px rgba(31, 53, 90,0.15); }
        .card-911:hover .co-top { width: 100%; }
        .card-911:hover .co-left { height: 100%; }
        .card-911:hover .co-icon { color: #1f355a; transform: scale(1.1); }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 64px', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 24, borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#1f355a' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <img src="/chaleco.png" alt="S" style={{ height: 56, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#1f355a', display: 'inline-block' }} />
                Despacho y Rondín
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 42, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                CENTINELA · DESPACHO
              </h1>
            </div>
          </div>
          <ProfileDropdown name={user.name} apellido={user.apellido} email={user.email} rolLabel="Agente Despacho" mostrarPerfil={false} />
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 16px' }}>
            <span style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Incidentes Hoy</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1f355a' }}>{stats.hoy}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 16px' }}>
            <span style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pendientes Despacho</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1f355a' }}>{stats.sinDespachar}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 16px' }}>
            <span style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>En Campo</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1f355a' }}>{stats.enDespacho}</span>
          </div>
        </div>

        {/* Cards */}
        <div style={{ flex: 1, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start', paddingTop: 20 }}>

          {/* Card: Reportes de Rondín */}
          <Link href="/agente_911/rondin/incidentes" className="card-911" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <MapPin size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                REPORTES
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Reportes de Rondín
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Control de patrullaje preventivo, puntos de firma y geolocalización de unidades
              </p>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{stats.total}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hoy</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{stats.hoy}</div>
              </div>
            </div>
          </Link>

          {/* Card: Reportes de Despacho */}
          <Link href="/agente_911/despacho" className="card-911" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#1f355a', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#1f355a', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <Shield size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1f355a' }} />
                REPORTES
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Reportes de Despacho
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Tablón de incidentes pendientes, asignación de unidades y elementos por turno
              </p>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pendientes</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{stats.sinDespachar}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>En Campo</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{stats.enDespacho}</div>
              </div>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>CENTINELA v1.2 · DESPACHO</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#1f355a' }} />
          </div>
        </div>

      </div>
    </div>
  )
}
