import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileBadge2, Settings, Shield, Radio } from 'lucide-react'
import { ToastExito } from '@/components/oficial/ToastExito'
import { ContadorAsignaciones } from '@/components/oficial/ContadorAsignaciones'
import { verificarRolOficial } from '@/lib/oficial/service'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { getUserWithRole, obtenerHubRol } from '@/lib/auth/helpers'
import { APP_VERSION } from "@/lib/constants"

export default async function OficialDashboardPage({ searchParams }: { searchParams: Promise<{ exito?: string; folio?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const userWithRole = await getUserWithRole(session.user.id)
  const hub = userWithRole?.esAdmin ? null : obtenerHubRol(userWithRole?.rolNombre)
  const backHref = hub === '/oficial' ? undefined : (hub ?? '/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  const params = await searchParams

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>
      <ToastExito show={params.exito === '1'} folio={params.folio} />
      <style>{`
        .card-o {
          background: var(--apple-glass-bg); backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid var(--apple-glass-border); padding: 32px;
          text-decoration: none; transition: all 0.3s ease-out;
          display: flex; flex-direction: column; min-height: 280px; height: 100%;
          box-shadow: var(--apple-shadow-glass); cursor: pointer;
          position: relative; overflow: hidden; width: 100%;
          border-radius: var(--radius-xl);
        }
        .card-o:hover { border-color: rgba(31, 53, 90, 0.25); transform: translateY(-2px); box-shadow: var(--apple-shadow-glass-hover); }
        .card-o:active {
          transform: scale(0.97); box-shadow: var(--apple-shadow-glass); border-color: rgba(31, 53, 90, 0.25);
          transition: transform .12s ease-out, box-shadow .12s ease-out, border-color .12s ease-out;
        }
        .card-o:hover .co-icon { color: #1f355a; transform: scale(1.1); }
        .co-icon { transition: all 0.3s ease; }
        @media (prefers-reduced-motion: reduce) {
          .card-o, .card-o:hover, .card-o:active { transform: none; transition: box-shadow .15s ease, border-color .15s ease; }
          .card-o:hover .co-icon, .card-o:active .co-icon { transform: none; }
        }
      `}</style>

      <DashboardHeader user={user} roleLabel="Oficial en Campo" backHref={backHref} variant="apple" />

      <div className="pad-dashboard" style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

        <PageHeader
          title="Panel"
          accent="Oficial"
          subtitle="Despachos, rondín e infracciones desde un solo lugar"
        />

        {/* Cards */}
        <div className="cat-cards-grid">

          {/* Card: Mis Despachos */}
          <Link href="/oficial/despachos" className="card-o">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b' }}>
                <Shield size={32} strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                Despachos
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 26, fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', margin: '0 0 8px 0', color: '#0f172a' }}>
                Reportes y Despachos
              </h3>
              <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Atiende tus despachos activos, revisa reportes cerrados y gestiona denuncias desde un solo lugar
              </p>
            </div>
            <ContadorAsignaciones />
          </Link>

          {/* Card: Rondín */}
          <Link href="/oficial/rondin" className="card-o">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b' }}>
                <Radio size={32} strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                Escala a despacho
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 26, fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', margin: '0 0 8px 0', color: '#0f172a' }}>
                Reporte de Rondín
              </h3>
              <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Registra un avistamiento en rondín — genera solicitud de despacho para asignación de unidades
              </p>
            </div>
          </Link>

          {/* Card: Captura de Infracciones */}
          <Link href="/infracciones/captura" className="card-o">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b' }}>
                <FileBadge2 size={32} strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                Vía · módulo
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 26, fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', margin: '0 0 8px 0', color: '#0f172a' }}>
                Captura de Infracciones
              </h3>
              <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Registra una nueva infracción de tránsito con datos del vehículo, infractor y ubicación
              </p>
            </div>
          </Link>

          {/* Card: Configuración de mi Perfil */}
          <Link href="/oficial/configuracion" className="card-o">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b' }}>
                <Settings size={32} strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                Configuración
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 26, fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', margin: '0 0 8px 0', color: '#0f172a' }}>
                Configuración de mi Perfil
              </h3>
              <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Actualiza tus datos personales, unidad asignada y más
              </p>
            </div>
          </Link>

        </div>

        {/* Footer */}
        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #e2e8f0', fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#94a3b8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>SSPM · San Juan del Río · Qro</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Centinela {APP_VERSION} · Oficial</span>
          </div>
        </div>

      </div>
    </div>
  )
}