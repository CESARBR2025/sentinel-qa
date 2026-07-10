import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, MessageSquare } from 'lucide-react'
import { ProfileDropdown } from '@/components/oficial/ProfileDropdown'
import { verificarRolAgente911 } from '@/lib/agente_911/service'
import { getStats } from '@/lib/911/service'

export default async function Agente911DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esAgente911 = await verificarRolAgente911(session.user.id)
  if (!esAgente911) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hoyISO = hoy.toISOString()
  const stats = await getStats(hoyISO)

  const hoy911 = stats.channels.find(c => c.canal === '911')?.count ?? 0
  const hoyWA = stats.channels.find(c => c.canal === 'whatsapp')?.count ?? 0


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
        .card-911:hover { border-color: #2563eb; transform: translateY(-5px); box-shadow: 0 20px 40px -12px rgba(37,99,235,0.15); }
        .card-911:hover .co-top { width: 100%; }
        .card-911:hover .co-left { height: 100%; }
        .card-911:hover .co-icon { color: #2563eb; transform: scale(1.1); }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 64px', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 24, borderBottom: '1px solid #e2e8f0', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#2563eb' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <img src="/logo_sentinel.png" alt="S" style={{ height: 56, objectFit: 'contain' }} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, background: '#2563eb', display: 'inline-block' }} />
                Atención 911
              </div>
              <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 42, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
                SENTINEL · 911
              </h1>
            </div>
          </div>
          <ProfileDropdown name={user.name} apellido={user.apellido} email={user.email} rolLabel="Agente 911" mostrarPerfil={false} />
        </div>

        {/* Stats Bar */}
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', fontFamily: 'JetBrains Mono,monospace', fontSize: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 16px' }}>
            <span style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Incidentes Hoy</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#2563eb' }}>{stats.hoy}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 16px' }}>
            <span style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>911 Hoy</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#2563eb' }}>{hoy911}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#ffffff', border: '1px solid #e2e8f0', padding: '10px 16px' }}>
            <span style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>WhatsApp Hoy</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#2563eb' }}>{hoyWA}</span>
          </div>
        </div>

        {/* Cards */}
        <div style={{ flex: 1, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start', paddingTop: 20 }}>

          {/* Card: Ciudadano */}
          <Link href="/agente_911/ciudadano/incidentes" className="card-911" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#2563eb', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#2563eb', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <Users size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb' }} />
                CANAL 911
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Ciudadano
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Base de datos de atención, registros de identidad y antecedentes de contacto
              </p>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hoy</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{hoy911}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{stats.total}</div>
              </div>
            </div>
          </Link>

          {/* Card: WhatsApp */}
          <Link href="/agente_911/whatsapp/incidentes" className="card-911" style={{ textDecoration: 'none' }}>
            <div className="co-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#2563eb', transition: 'width 0.4s ease', width: 32 }} />
            <div className="co-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#2563eb', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <MessageSquare size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb' }} />
                CANAL WHATSAPP
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                WhatsApp
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Gestión de reportes entrantes vía mensajería instantánea y despacho digital
              </p>
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Hoy</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{hoyWA}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total</div>
                <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{stats.total}</div>
              </div>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1 · 911</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#2563eb' }} />
          </div>
        </div>

      </div>
    </div>
  )
}
