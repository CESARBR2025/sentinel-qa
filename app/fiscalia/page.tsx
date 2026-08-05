import Link from 'next/link'
import { Car, ClipboardList, Camera, Shield } from 'lucide-react'
import { ToastExito } from '@/components/fiscalia/ToastExito'
import { obtenerDashboardFiscalia } from '@/lib/fiscalia/actions'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader } from '@/components/partials/PageHeader'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole, obtenerHubRol } from '@/lib/auth/helpers'

export default async function FiscaliaDashboardPage({ searchParams }: { searchParams: Promise<{ exito?: string }> }) {
  const user = await obtenerDashboardFiscalia()

  const session = await auth.api.getSession({ headers: await headers() })
  const userWithRole = session ? await getUserWithRole(session.user.id) : null
  const hub = userWithRole?.esAdmin ? null : obtenerHubRol(userWithRole?.rolNombre)
  const backHref = hub === '/fiscalia' ? undefined : (hub ?? '/dashboard')

  const params = await searchParams

  const nombre = user?.name ?? ''

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .card-f {
          background: #ffffff; border: 1px solid #e2e8f0; padding: 32px;
          text-decoration: none; transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          display: flex; flex-direction: column; min-height: 280px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); cursor: pointer;
          position: relative; overflow: hidden; width: 100%; max-width: 520px;
        }
        .card-f:hover { border-color: #7c3aed; transform: translateY(-5px); box-shadow: 0 20px 40px -12px rgba(124, 58, 237,0.15); }
        .card-f:hover .cf-top { width: 100%; }
        .card-f:hover .cf-left { height: 100%; }
        .card-f:hover .cf-icon { color: #7c3aed; transform: scale(1.1); }
      `}</style>

      <ToastExito show={params.exito === '1'} />
      <DashboardHeader user={user} roleLabel="Agente Fiscalía" backHref={backHref} />

      <main className="pad-dashboard" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 48 }}>
        <PageHeader
          title="Panel"
          accent="Fiscalía"
          subtitle={`${nombre} · solicitudes de evidencia, liberaciones, detenidos y asegurados`}
        />

        {/* Cards */}
        <div style={{ flex: 1, display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start', paddingTop: 40 }}>

          {/* Card: Reportes de Denuncias */}
          <Link href="/fiscalia/solicitudes" className="card-f" style={{ textDecoration: 'none' }}>
            <div className="cf-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#7c3aed', transition: 'width 0.4s ease', width: 32 }} />
            <div className="cf-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#7c3aed', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="cf-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <ClipboardList size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }} />
                SOLICITUDES
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Reportes de Denuncias
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Solicitudes de reportes de denuncias con evidencia del monitorista
              </p>
            </div>
          </Link>

          {/* Card: Liberaciones de Vehículos */}
          <Link href="/fiscalia/liberaciones" className="card-f" style={{ textDecoration: 'none' }}>
            <div className="cf-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#7c3aed', transition: 'width 0.4s ease', width: 32 }} />
            <div className="cf-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#7c3aed', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="cf-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <Car size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }} />
                LIBERACIONES
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Liberaciones de Vehículos
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Gestiona las liberaciones de vehículos asegurados remitidas por Policía Vial
              </p>
            </div>
          </Link>

          {/* Card: Fotos de Detenidos */}
          <Link href="/fiscalia/detenidos" className="card-f" style={{ textDecoration: 'none' }}>
            <div className="cf-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#7c3aed', transition: 'width 0.4s ease', width: 32 }} />
            <div className="cf-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#7c3aed', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="cf-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <Camera size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }} />
                DETENIDOS
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Fotos de Detenidos
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Sube las fotografías de detenidos solicitadas por el Monitorista
              </p>
            </div>
          </Link>

          {/* Card: Asegurados */}
          <Link href="/fiscalia/asegurados" className="card-f" style={{ textDecoration: 'none' }}>
            <div className="cf-top" style={{ position: 'absolute', top: 0, left: 0, height: 2, background: '#7c3aed', transition: 'width 0.4s ease', width: 32 }} />
            <div className="cf-left" style={{ position: 'absolute', top: 0, left: 0, width: 2, background: '#7c3aed', transition: 'height 0.4s ease', height: 32 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="cf-icon" style={{ color: '#64748b', transition: 'all 0.3s ease' }}>
                <Shield size={32} />
              </div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed' }} />
                ASEGURADOS
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 28, fontWeight: 800, textTransform: 'uppercase', margin: '0 0 8px 0', color: '#0f172a' }}>
                Asegurados
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Gestiona asegurados, captura direcciones y registra la puesta a disposición
              </p>
            </div>
          </Link>

        </div>

        <DashboardFooter />
      </main>
    </div>
  )
}
