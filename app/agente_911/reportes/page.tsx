import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Phone, ChevronRight, PhoneOff } from 'lucide-react'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { tieneAccesoSeccion } from '@/lib/911/permisos'

export default async function Agente911ReportesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esAgente911 = await tieneAccesoSeccion(session.user.id, '911_ciudadano')
  if (!esAgente911) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--apple-font-display)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <style>{`
        .rep-main { display: flex; flex-direction: column; flex: 1; gap: 48px; width: 100%; }
        @media (max-width: 720px) { .rep-main { gap: 20px; } }

        .card-911 {
          background: var(--apple-glass-bg); backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid var(--apple-glass-border); padding: 32px;
          text-decoration: none; transition: all 0.3s ease-out;
          display: flex; flex-direction: column; min-height: 280px;
          box-shadow: var(--apple-shadow-glass); cursor: pointer;
          position: relative; overflow: hidden; width: 100%;
          border-radius: var(--radius-xl);
        }
        .card-911:hover { border-color: rgba(31, 53, 90, 0.25); transform: translateY(-2px); box-shadow: var(--apple-shadow-glass-hover); }
        .card-911:hover .co-icon { color: #1f355a; transform: scale(1.1); }
        .card-911:active {
          transform: scale(0.97); box-shadow: var(--apple-shadow-glass); border-color: rgba(31, 53, 90, 0.25);
          transition: transform .12s ease-out, box-shadow .12s ease-out, border-color .12s ease-out;
        }

        .card-911-icon { color: #64748b; margin-bottom: 32px; display: inline-flex; transition: all 0.3s ease; }
        .card-911-chip { position: absolute; top: 32px; right: 32px; font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #64748b; }
        .card-911-body { flex-grow: 1; min-width: 0; }
        .card-911-title { font-family: var(--apple-font-display); font-size: 26px; font-weight: 600; margin: 0 0 8px; color: #0f172a; }
        .card-911-desc { font-family: var(--apple-font-display); font-size: 13px; color: #64748b; line-height: 1.5; margin: 0; }
        .card-911-meta { display: none; }
        .card-911-stats { margin-top: 16px; display: flex; gap: 16px; padding-top: 12px; border-top: 1px solid #e2e8f0; }
        .card-911-stat-label { font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #64748b; }
        .card-911-stat-value { font-family: var(--apple-font-display); font-size: 22px; font-weight: 600; color: #0f172a; }
        .card-911-chevron { display: none; transition: transform .2s ease; }
        .card-911:hover .card-911-chevron, .card-911:active .card-911-chevron { transform: translateX(3px); }

        @media (max-width: 720px) {
          .card-911 {
            flex-direction: row; align-items: center; gap: 14px;
            padding: 14px 16px; min-height: unset; border-radius: var(--radius-lg);
          }
          .card-911-icon {
            margin-bottom: 0; width: 44px; height: 44px; flex-shrink: 0;
            border-radius: var(--radius-lg); background: rgba(31, 53, 90, 0.08);
            align-items: center; justify-content: center;
          }
          .card-911-icon svg { width: 20px; height: 20px; }
          .card-911-chip { display: none; }
          .card-911-title { font-size: 16px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
          .card-911-desc { display: none; }
          .card-911-meta {
            display: block; margin-top: 2px; font-family: var(--apple-font-display);
            font-size: 12px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          }
          .card-911-stats { display: none; }
          .card-911-chevron { display: block; color: #94a3b8; flex-shrink: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .card-911, .card-911:hover, .card-911:active { transform: none; transition: box-shadow .15s ease, border-color .15s ease; }
          .card-911:hover .co-icon, .card-911:active .co-icon { transform: none; }
          .card-911:hover .card-911-chevron, .card-911:active .card-911-chevron { transform: none; }
        }
      `}</style>

      <DashboardHeader user={user} roleLabel="Agente 911" backHref="/agente_911" backLabel="Panel 911" variant="apple" />

      <div className="pad-dashboard rep-main">
        <PageHeader
          title="Reportes"
          accent="911"
          subtitle="Concentrados estadísticos del canal 911 y números telefónicos reportados"
        />

        <div className="cat-cards-grid">
          <Link href="/agente_911/reportes/numeros" className="card-911">
            <div className="card-911-icon co-icon">
              <Phone size={32} strokeWidth={1.5} />
            </div>
            <span className="card-911-chip">Canal 911</span>
            <div className="card-911-body">
              <h3 className="card-911-title">Reporte de Números Telefónicos</h3>
              <p className="card-911-desc">
                Concentrado de números telefónicos reportados al 911 por la ciudadanía,
                con filtro por rango de fechas y exportación a Excel
              </p>
              <div className="card-911-meta">Números reportados · Export a Excel</div>
            </div>
            <div className="card-911-stats">
              <div>
                <div className="card-911-stat-label">Datos</div>
                <div className="card-911-stat-value">Teléfono</div>
              </div>
              <div>
                <div className="card-911-stat-label">Salida</div>
                <div className="card-911-stat-value">Excel</div>
              </div>
            </div>
            <ChevronRight className="card-911-chevron" size={20} />
          </Link>

          <Link href="/agente_911/reportes/extorsion" className="card-911">
            <div className="card-911-icon co-icon">
              <PhoneOff size={32} strokeWidth={1.5} />
            </div>
            <span className="card-911-chip">Extorsión</span>
            <div className="card-911-body">
              <h3 className="card-911-title">Reporte de Llamadas de Extorsión</h3>
              <p className="card-911-desc">
                Concentrado de llamadas de extorsión reportadas al 911 en formato C4
                (fecha, hora, lugar, grupo delictivo, modus operandi, unidad, resultado),
                con filtro por rango de fechas y exportación a Excel
              </p>
              <div className="card-911-meta">Formato C4 · Export a Excel</div>
            </div>
            <div className="card-911-stats">
              <div>
                <div className="card-911-stat-label">Datos</div>
                <div className="card-911-stat-value">9 campos</div>
              </div>
              <div>
                <div className="card-911-stat-label">Salida</div>
                <div className="card-911-stat-value">Excel</div>
              </div>
            </div>
            <ChevronRight className="card-911-chevron" size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}