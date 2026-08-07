import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { obtenerDenunciasPendientes, obtenerDenunciasAtendidas } from '@/lib/monitorista/denuncia-service'
import { Camera, History, Video } from 'lucide-react'
import { obtenerPermisosUsuario } from '@/lib/monitorista/permisos'
import { getMonitoristaStats } from '@/lib/monitorista/repository'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader } from '@/components/partials/PageHeader'
import { getUserWithRole, obtenerHubRol } from '@/lib/auth/helpers'
import Link from 'next/link'

export default async function MonitoristaHubPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const userWithRole = await getUserWithRole(session.user.id)
  const hub = userWithRole?.esAdmin ? null : obtenerHubRol(userWithRole?.rolNombre)
  const backHref = hub === '/monitorista' ? undefined : (hub ?? '/dashboard')

  const permisos = await obtenerPermisosUsuario(session.user.id)

  const stats = await getMonitoristaStats(session.user.id)
  const [d1Pend, d1Comp] = await Promise.all([
    obtenerDenunciasPendientes(),
    obtenerDenunciasAtendidas(),
  ])

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>
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
        .co-footer { display: flex; gap: 24; padding-top: 16px; border-top: 1px solid #e2e8f0; }
        .co-stat-label { font-family: var(--apple-font-display); font-size: 11px; font-weight: 500; color: #64748b; text-transform: none; letter-spacing: normal; margin-bottom: 4px; }
        .co-link {
          margin-top: 20px; font-family: var(--apple-font-display); font-size: 13px; font-weight: 600;
          color: #64748b; display: flex; align-items: center; gap: 8px; letter-spacing: normal; text-transform: none;
        }
        .card-o:hover .co-link { color: #1f355a; }
        .co-link-arrow { transition: transform 0.3s ease; }
        .card-o:hover .co-link-arrow { transform: translateX(4px); }
        @media (prefers-reduced-motion: reduce) {
          .card-o, .card-o:hover, .card-o:active { transform: none; transition: box-shadow .15s ease, border-color .15s ease; }
          .card-o:hover .co-icon, .card-o:active .co-icon { transform: none; }
          .co-link-arrow { transition: none; }
          .card-o:hover .co-link-arrow { transform: none; }
        }
      `}</style>

      <DashboardHeader user={user as { name: string; apellido?: string; email: string }} roleLabel="Monitorista" backHref={backHref} />

      <main className="pad-dashboard" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Panel"
          accent="Monitorista"
          subtitle={`${user.name} ${user.apellido ?? ''} · centro de monitoreo: solicitudes de evidencia e incidentes de cámara`}
        />

        <div className="cat-cards-grid">
          {permisos.solicitudes.puede_ver && <Link href="/monitorista/solicitudes" className="card-o">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b' }}>
                <Camera size={32} strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                Evidencia
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 26, fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', margin: '0 0 8px 0', color: '#0f172a' }}>
                Solicitudes de Evidencia
              </h3>
              <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Denuncias D1 e incidentes solicitados por Fiscalía y Juzgado
              </p>
            </div>
            <div className="co-footer">
              <div><div className="co-stat-label">Pendientes</div><div style={{ ...coStatValue, color: '#b45309' }}>{d1Pend.length + stats.solsPend}</div></div>
              <div><div className="co-stat-label">Completadas</div><div style={{ ...coStatValue, color: '#16a34a' }}>{d1Comp.length + stats.solsComp}</div></div>
            </div>
            <div className="co-link">Acceder <span className="co-link-arrow">→</span></div>
          </Link>}

          {permisos.incidentes_camara.puede_ver && <Link href="/monitorista/incidentes-camara" className="card-o">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b' }}>
                <Video size={32} strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                Cámara
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 26, fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', margin: '0 0 8px 0', color: '#0f172a' }}>
                Reporte de Incidente en Cámara
              </h3>
              <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Registro de incidentes captados en cámara durante el turno
              </p>
            </div>
            <div className="co-footer">
              <div><div className="co-stat-label">Personas</div><div style={{ ...coStatValue, color: '#1f355a' }}>{stats.icStats?.personas ?? 0}</div></div>
              <div><div className="co-stat-label">Vehículos</div><div style={{ ...coStatValue, color: '#1f355a' }}>{stats.icStats?.vehiculos ?? 0}</div></div>
            </div>
            <div className="co-link">Acceder <span className="co-link-arrow">→</span></div>
          </Link>}

          {permisos.historial.puede_ver && <Link href="/monitorista/historial" className="card-o">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
              <div className="co-icon" style={{ color: '#64748b' }}>
                <History size={32} strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                Historial
              </div>
            </div>
            <div style={{ flexGrow: 1 }}>
              <h3 style={{ fontFamily: 'var(--apple-font-display)', fontSize: 26, fontWeight: 600, textTransform: 'none', letterSpacing: 'normal', margin: '0 0 8px 0', color: '#0f172a' }}>
                Historial
              </h3>
              <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                Actividad registrada por el centro de monitoreo
              </p>
            </div>
            <div className="co-footer">
              <div><div className="co-stat-label">Registros</div><div style={coStatValue}>{stats.histCount}</div></div>
            </div>
            <div className="co-link">Ver <span className="co-link-arrow">→</span></div>
          </Link>}
        </div>

        <DashboardFooter />
      </main>
    </div>
  )
}

const coStatValue: import('react').CSSProperties = {
  fontFamily: 'var(--apple-font-display)',
  fontSize: 24,
  fontWeight: 600,
  color: '#0f172a',
  lineHeight: 1.1,
}
