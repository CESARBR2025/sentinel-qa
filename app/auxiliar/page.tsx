import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { tienePermiso } from '@/lib/auxiliar/permisos'
import { ClipboardList, CheckSquare } from 'lucide-react'
import { ToastExito } from '@/components/oficial/ToastExito'
import { ProfileDropdownAuxiliar } from '@/components/auxiliar/ProfileDropdownAuxiliar'
import { DashboardHeader } from '@/components/partials/Header'

export default async function AuxiliarPage({ searchParams }: { searchParams: Promise<{ exito?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tienePermiso(session.user.id, 'auxiliar_checklist', 'ver'))) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }
  const params = await searchParams

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <ToastExito show={params.exito === '1'} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .card-a { background:#ffffff; border:1px solid #e2e8f0; padding:32px; text-decoration:none; transition:all 0.4s cubic-bezier(0.2,0.8,0.2,1); display:flex; flex-direction:column; min-height:280px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05); cursor:pointer; position:relative; overflow:hidden; width:100%; max-width:520px; }
        .card-a:hover { border-color:#2563eb; transform:translateY(-5px); box-shadow:0 20px 40px -12px rgba(37,99,235,0.15); }
        .card-a:hover .ca-top  { width:100%; }
        .card-a:hover .ca-left { height:100%; }
        .card-a:hover .ca-icon { color:#2563eb; transform:scale(1.1); }
      `}</style>

      <DashboardHeader user={user} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 64px', display: 'flex', flexDirection: 'column', gap: 48, minHeight: '100vh' }}>

        {/* Title block */}
        <div style={{ position: 'relative', paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ position: 'absolute', bottom: -1, left: 0, width: 64, height: 3, background: '#2563eb' }} />
          <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, background: '#2563eb', display: 'inline-block' }} />
            Auxiliar de Novedades
          </div>
          <h1 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 42, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0, color: '#0f172a', lineHeight: 1 }}>
            SENTINEL · AUXILIAR
          </h1>
        </div>

        {/* Cards */}
        <div style={{ flex: 1, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start', paddingTop: 40 }}>

          <Link href="/auxiliar/cuestionario-robo" className="card-a">
            <div className="ca-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#2563eb', transition: 'width 0.4s ease', width: 32 }} />
            <div className="ca-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#2563eb', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="ca-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}><ClipboardList size={32} /></div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb' }} />
                CONSULTA Y EXPORTAR
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Cuestionario Único de Robo
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Consulta y exporta los reportes clasificados como robo con sus datos completos
              </p>
            </div>
          </Link>

          <Link href="/auxiliar/checklist" className="card-a">
            <div className="ca-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#2563eb', transition: 'width 0.4s ease', width: 32 }} />
            <div className="ca-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#2563eb', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="ca-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}><CheckSquare size={32} /></div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2563eb' }} />
                REGISTRO POR REPORTE
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Checklist de Novedades
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Registra denuncia, detenidos, GPS, cámara y más por cada par reporte-D1
              </p>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>SENTINEL v0.1 · AUXILIAR</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#2563eb' }} />
          </div>
        </div>
      </div>
    </div>
  )
}