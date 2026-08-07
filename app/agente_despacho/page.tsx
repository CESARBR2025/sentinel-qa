import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, MapPin, ChevronRight } from 'lucide-react'
import { verificarRolAgenteDespacho } from '@/lib/agente_despacho/service'
import { getStats } from '@/lib/911/service'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { getUserWithRole, obtenerHubRol } from '@/lib/auth/helpers'
import { APP_VERSION } from "@/lib/constants"

export default async function AgenteDespachoDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esDespacho = await verificarRolAgenteDespacho(session.user.id)
  if (!esDespacho) redirect('/dashboard')

  const userWithRole = await getUserWithRole(session.user.id)
  const hub = userWithRole?.esAdmin ? null : obtenerHubRol(userWithRole?.rolNombre)
  const backHref = hub === '/agente_despacho' ? undefined : (hub ?? '/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const hoyISO = hoy.toISOString()
  const stats = await getStats(hoyISO)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--apple-font-display)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <style>{`
        /* Espaciado entre secciones — compacto en móvil para que la vista
           quepa sin scroll en un viewport tipo iPhone (≤720px). */
        .desp-main { display: flex; flex-direction: column; flex: 1; gap: 48px; }
        @media (max-width: 720px) { .desp-main { gap: 20px; } }

        /* Card KPI — Resumen del día */
        .desp-kpi-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 14px 24px; border-bottom: 1px solid #e2e8f0; }
        .desp-kpi-title { font-family: var(--apple-font-display); font-size: 13px; font-weight: 600; color: #1f355a; }
        .desp-kpi-date { font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #94a3b8; }
        .desp-kpi-stats { display: flex; flex-wrap: wrap; }
        @media (max-width: 720px) {
          .desp-kpi-head { padding: 10px 16px; }
          .desp-kpi-title { font-size: 12px; }
          .desp-kpi-date { font-size: 10px; }
          .desp-kpi-stats { flex-wrap: nowrap; }
        }

        .stat-bloque { flex: 1 1 180px; min-width: 0; padding: 20px 24px; }
        .stat-bloque + .stat-bloque { border-left: 1px solid #f1f5f9; }
        .stat-bloque-label { font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 6px; }
        .stat-bloque-value { font-family: var(--apple-font-display); font-size: 36px; font-weight: 600; line-height: 1; color: #0f172a; }
        @media (max-width: 720px) {
          .stat-bloque { flex: 1 1 0; padding: 10px 8px; text-align: center; }
          .stat-bloque-label { font-size: 10px; margin-bottom: 3px; }
          .stat-bloque-value { font-size: 21px; }
        }

        /* Cards de navegación — hero glass en tablet/desktop, fila compacta
           tipo lista nativa (icono · texto · chevron) en móvil. */
        .desp-cards-grid { padding-top: 20px; }
        @media (max-width: 720px) { .desp-cards-grid { padding-top: 0; gap: 10px; } }

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
        /* Feedback de "presionado" — el toque/click se siente respondido de inmediato
           (transición corta .12s), y la vuelta a reposo hereda la .3s de arriba (más
           suave). Reemplaza el highlight azul nativo del navegador en <a>. */
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
        /* affordance de navegación: el chevron se desliza un poco al presionar/hover,
           igual que el botón "disclosure" de una lista nativa iOS/Android. */
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

        .desp-footer {
          margin-top: auto; padding-top: 24px; border-top: 1px solid #e2e8f0;
          font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #94a3b8;
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;
        }
        @media (max-width: 720px) { .desp-footer { padding-top: 16px; font-size: 11px; } }

        /* Motion con propósito (DESIGN.md §1/§9): las micro-animaciones de arriba
           son transform/opacity puros, cortas y disparadas por interacción real
           (hover/active) — no decorativas ni en loop. Se desactivan igual bajo
           prefers-reduced-motion, dejando solo el cambio de color/sombra como feedback. */
        @media (prefers-reduced-motion: reduce) {
          .card-911, .card-911:hover, .card-911:active { transform: none; transition: box-shadow .15s ease, border-color .15s ease; }
          .card-911:hover .co-icon, .card-911:active .co-icon { transform: none; }
          .card-911:hover .card-911-chevron, .card-911:active .card-911-chevron { transform: none; }
        }
      `}</style>

      <DashboardHeader user={user} roleLabel="Agente Despacho" backHref={backHref} variant="apple" />

      <div className="pad-dashboard desp-main" style={{ width: '100%' }}>

        <PageHeader
          title="Panel"
          accent="Despacho"
          subtitle={`${user.name} ${user.apellido ?? ''} · centro de mando y comunicaciones`}
        />

        {/* KPI único: resumen del día */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }}>
          <div className="desp-kpi-head">
            <span className="desp-kpi-title">Resumen del día</span>
            <span className="desp-kpi-date">
              {hoy.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
          <div className="desp-kpi-stats">
            <StatBloque etiqueta="Incidentes Hoy" valor={stats.hoy} />
            <StatBloque etiqueta="Pendientes Despacho" valor={stats.sinDespachar} />
            <StatBloque etiqueta="En Campo" valor={stats.enDespacho} />
          </div>
        </div>

        {/* Cards */}
        <div className="cat-cards-grid desp-cards-grid">

          {/* Card única: tablón unificado — 911, whatsapp y rondín (auto-escalado) convergen aquí, no hay universo separado que consultar */}
          <Link href="/agente_911/despacho" className="card-911">
            <div className="card-911-icon co-icon">
              <Shield size={32} strokeWidth={1.5} />
            </div>
            <span className="card-911-chip">Reportes</span>
            <div className="card-911-body">
              <h3 className="card-911-title">Reportes de Despacho</h3>
              <p className="card-911-desc">
                Tablón de incidentes pendientes, asignación de unidades y elementos por turno
              </p>
              <div className="card-911-meta">{stats.sinDespachar} pendientes · {stats.enDespacho} en campo</div>
            </div>
            <div className="card-911-stats">
              <div>
                <div className="card-911-stat-label">Pendientes</div>
                <div className="card-911-stat-value">{stats.sinDespachar}</div>
              </div>
              <div>
                <div className="card-911-stat-label">En Campo</div>
                <div className="card-911-stat-value">{stats.enDespacho}</div>
              </div>
            </div>
            <ChevronRight className="card-911-chevron" size={20} />
          </Link>

          {/* KPI geolocalizado: mapa de puntos + mapa de calor por rango de fecha/hora */}
          <Link href="/agente_despacho/kpi-incidencias" className="card-911">
            <div className="card-911-icon co-icon">
              <MapPin size={32} strokeWidth={1.5} />
            </div>
            <span className="card-911-chip">Análisis</span>
            <div className="card-911-body">
              <h3 className="card-911-title">KPI Incidencias</h3>
              <p className="card-911-desc">
                Mapa de ubicación y mapa de calor de las incidencias por rango de fecha y hora, con tabla y detalle
              </p>
              <div className="card-911-meta">{stats.hoy} hoy · {stats.total} histórico</div>
            </div>
            <div className="card-911-stats">
              <div>
                <div className="card-911-stat-label">Hoy</div>
                <div className="card-911-stat-value">{stats.hoy}</div>
              </div>
              <div>
                <div className="card-911-stat-label">Histórico</div>
                <div className="card-911-stat-value">{stats.total}</div>
              </div>
            </div>
            <ChevronRight className="card-911-chevron" size={20} />
          </Link>

        </div>

        {/* Footer */}
        <div className="desp-footer">
          <div>SSPM · San Juan del Río · Qro</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>Centinela {APP_VERSION} · Despacho</span>
          </div>
        </div>

      </div>
    </div>
  )
}

function StatBloque({ etiqueta, valor }: { etiqueta: string; valor: number }) {
  return (
    <div className="stat-bloque">
      <div className="stat-bloque-label">{etiqueta}</div>
      <div className="stat-bloque-value">{valor}</div>
    </div>
  )
}
