import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { BandejaSolicitudes } from '@/components/monitorista/BandejaSolicitudes'
import type { SolicitudRow } from '@/components/monitorista/BandejaSolicitudes'
import { obtenerDenunciasPendientes, obtenerDenunciasAtendidas } from '@/lib/monitorista/denuncia-service'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { listarSolicitudesEvidencia, getHistorialCount } from '@/lib/monitorista/repository'
import { obtenerOCrearToken } from '@/lib/recursos/token-recurso'
import type { SolicitudEvidencia } from '@/lib/monitorista/types'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader } from '@/components/partials/PageHeader'

export default async function SolicitudesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'solicitudes', 'ver'))) redirect('/monitorista')

  const hoy = new Date(); hoy.setHours(0, 0, 0, 0)

  const [gralPend, gralComp, histCount, d1Pend, d1Comp] = await Promise.all([
    listarSolicitudesEvidencia('pendiente'),
    listarSolicitudesEvidencia('completada'),
    getHistorialCount(session.user.id, hoy.toISOString()),
    obtenerDenunciasPendientes(),
    obtenerDenunciasAtendidas(),
  ])

  const mapGral = async (rows: SolicitudEvidencia[], origen: 'pendiente' | 'completada'): Promise<SolicitudRow[]> =>
    Promise.all(rows.map(async r => ({
      id: String(r.id),
      token: await obtenerOCrearToken('solicitud', String(r.id)),
      origen: 'general' as const, entidadId: String(r.incidenteId), solicitudId: null as number | null,
      folio: String(r.folioIncidente ?? ''), solicitadoNombre: String(r.solicitadoNombre ?? ''),
      descripcion: String(r.descripcion ?? ''), status: origen, creadoEn: String(r.creadoEn ?? ''),
      completadoEn: r.completadoEn ? String(r.completadoEn) : null, totalEvidencias: Number(r.totalEvidencias ?? 0),
    })))

  const denunciaItemsPend: SolicitudRow[] = []
  for (const d of d1Pend) {
    const denunciaToken = await obtenerOCrearToken('denuncia', d.id)
    for (const s of d.monitoristaFechasRequeridas) {
      denunciaItemsPend.push({
        id: `${d.id}_${s.solicitudId}`, origen: 'denuncia' as const, entidadId: d.id, denunciaToken,
        solicitudId: s.solicitudId,
        folio: d.folioDenuncia, solicitadoNombre: 'Fiscalía',
        descripcion: `${s.calle} ${s.numero}, Col. ${s.colonia} (${s.horaInicio} - ${s.horaFin})`,
        status: s.atendida ? 'completada' as const : 'pendiente' as const,
        creadoEn: s.fechaPeticion, completadoEn: null, totalEvidencias: 0,
      })
    }
  }

  const denunciaItemsAtend: SolicitudRow[] = []
  for (const d of d1Comp) {
    const denunciaToken = await obtenerOCrearToken('denuncia', d.id)
    const total = d.monitoristaFechasRequeridas.length
    const atendidas = d.monitoristaFechasRequeridas.filter(s => s.atendida).length
    const calles = [...new Set(d.monitoristaFechasRequeridas.map(s => `${s.calle} ${s.numero}, Col. ${s.colonia}`))]
    denunciaItemsAtend.push({ id: d.id, origen: 'denuncia' as const, entidadId: d.id, denunciaToken, solicitudId: null, folio: d.folioDenuncia,
      solicitadoNombre: 'Fiscalía', descripcion: `${total} solicitud${total > 1 ? 'es' : ''} · ${atendidas}/${total} atendidas · ${calles.join(' | ')}`,
      status: 'completada' as const, creadoEn: d.createdAt, completadoEn: d.createdAt, totalEvidencias: total })
  }

  const pendientes = [...denunciaItemsPend, ...(await mapGral(gralPend, 'pendiente'))]
  const completadas = [...denunciaItemsAtend, ...(await mapGral(gralComp, 'completada'))]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>
      <style>{`
        .kpi-panel { background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
        .kpi-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 14px 24px; border-bottom: 1px solid #e2e8f0; }
        .kpi-title { font-family: var(--apple-font-display); font-size: 13px; font-weight: 600; color: #1f355a; }
        .kpi-date { font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #94a3b8; }
        .kpi-stats { display: flex; flex-wrap: wrap; }
        .stat-bloque { flex: 1 1 180px; min-width: 0; padding: 20px 24px; }
        .stat-bloque + .stat-bloque { border-left: 1px solid #f1f5f9; }
        .stat-bloque-label { font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 6px; }
        .stat-bloque-value { font-family: var(--apple-font-display); font-size: 36px; font-weight: 600; line-height: 1; color: #0f172a; }
        @media (max-width: 720px) {
          .kpi-head { padding: 10px 16px; }
          .kpi-title { font-size: 12px; }
          .kpi-date { font-size: 10px; }
          .kpi-stats { flex-wrap: nowrap; }
          .stat-bloque { flex: 1 1 0; padding: 10px 8px; text-align: center; }
          .stat-bloque-label { font-size: 10px; margin-bottom: 3px; }
          .stat-bloque-value { font-size: 21px; }
        }
      `}</style>
      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        roleLabel="Monitorista"
        backHref="/monitorista"
        backLabel="Panel"
      />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Solicitudes de"
          accent="Evidencia"
          subtitle="Panel de solicitudes · denuncias D1 y solicitudes generales"
        />

        <div className="kpi-panel">
          <div className="kpi-head">
            <span className="kpi-title">Solicitudes</span>
            <span className="kpi-date">
              {hoy.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
          <div className="kpi-stats">
            <div className="stat-bloque">
              <div className="stat-bloque-label">Pendientes</div>
              <div className="stat-bloque-value">{pendientes.length}</div>
            </div>
            <div className="stat-bloque">
              <div className="stat-bloque-label">Completadas</div>
              <div className="stat-bloque-value">{completadas.length}</div>
            </div>
            <div className="stat-bloque">
              <div className="stat-bloque-label">Acciones hoy</div>
              <div className="stat-bloque-value">{histCount}</div>
            </div>
          </div>
        </div>

        <BandejaSolicitudes pendientes={pendientes} completadas={completadas} />

        <DashboardFooter />
      </main>
    </div>
  )
}
