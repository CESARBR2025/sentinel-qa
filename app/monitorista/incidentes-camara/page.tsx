import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { listarRegistros, TURNOS } from '@/lib/monitorista/incidentes-camara-service'
import React from 'react'
import { FilaIncidenteCamara } from '@/components/monitorista/FilaIncidenteCamara'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { ToastAuto } from '@/components/ui/ToastAuto'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { SegmentPage } from '@/components/partials/SegmentPage'

export default async function IncidentesCamaraPage({
  searchParams,
}: {
  searchParams: Promise<{ turno?: string; exito?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'incidentes_camara', 'ver'))) redirect('/monitorista')

  const { turno: turnoFilter, exito } = await searchParams
  const turnoValido = turnoFilter && TURNOS.includes(turnoFilter as typeof TURNOS[number])
    ? turnoFilter as typeof TURNOS[number]
    : undefined

  const registros = await listarRegistros(turnoValido)

  const totalPersonas = registros.reduce((s, r) => s + r.totalPersonasRevisadas, 0)
  const totalVehiculos = registros.reduce((s, r) => s + r.vehiculosRevisar, 0)
  const totalMotos = registros.reduce((s, r) => s + r.motosRevisadas, 0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--color-background)', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>
      <style>{`
        .kpi-panel { background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
        .kpi-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 14px 24px; border-bottom: 1px solid #e2e8f0; }
        .kpi-title { font-family: var(--apple-font-display); font-size: 13px; font-weight: 600; color: #1f355a; }
        .kpi-stats { display: flex; flex-wrap: wrap; }
        .stat-bloque { flex: 1 1 180px; min-width: 0; padding: 20px 24px; }
        .stat-bloque + .stat-bloque { border-left: 1px solid #f1f5f9; }
        .stat-bloque-label { font-family: var(--apple-font-display); font-size: 12px; font-weight: 500; color: #64748b; margin-bottom: 6px; }
        .stat-bloque-value { font-family: var(--apple-font-display); font-size: 32px; font-weight: 600; line-height: 1; color: #0f172a; }
        @media (max-width: 720px) {
          .kpi-head { padding: 10px 16px; }
          .kpi-stats { flex-wrap: nowrap; }
          .stat-bloque { flex: 1 1 0; padding: 10px 6px; text-align: center; }
          .stat-bloque-label { font-size: 9px; margin-bottom: 3px; }
          .stat-bloque-value { font-size: 20px; }
        }
        .tabla-wrap { background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
      `}</style>
      <ToastAuto show={exito === 'creado'} mensaje="Registro creado exitosamente" />
      <ToastAuto show={exito === 'actualizado'} mensaje="Registro actualizado exitosamente" />
      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        roleLabel="Monitorista"
        backHref="/monitorista"
        backLabel="Panel"
      />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Incidentes por"
          accent="Cámara"
          subtitle="Cámaras de vigilancia · registro de novedades por turno"
          actions={<PageHeaderLink href="/monitorista/incidentes-camara/nuevo">+ Nuevo registro</PageHeaderLink>}
        />

        <div className="kpi-panel">
          <div className="kpi-head">
            <span className="kpi-title">Resumen por turno</span>
          </div>
          <div className="kpi-stats">
            <div className="stat-bloque">
              <div className="stat-bloque-label">Total registros</div>
              <div className="stat-bloque-value">{registros.length}</div>
            </div>
            <div className="stat-bloque">
              <div className="stat-bloque-label">Personas revisadas</div>
              <div className="stat-bloque-value">{totalPersonas}</div>
            </div>
            <div className="stat-bloque">
              <div className="stat-bloque-label">Vehículos revisados</div>
              <div className="stat-bloque-value">{totalVehiculos}</div>
            </div>
            <div className="stat-bloque">
              <div className="stat-bloque-label">Motos revisadas</div>
              <div className="stat-bloque-value">{totalMotos}</div>
            </div>
          </div>
        </div>

        <SegmentPage
          tabs={[
            { key: '', label: 'Todos', href: '/monitorista/incidentes-camara' },
            { key: 'MATUTINO', label: '07-15 hrs', href: '/monitorista/incidentes-camara?turno=MATUTINO' },
            { key: 'VESPERTINO', label: '15-22 hrs', href: '/monitorista/incidentes-camara?turno=VESPERTINO' },
            { key: 'NOCTURNO', label: '22-07 hrs', href: '/monitorista/incidentes-camara?turno=NOCTURNO' },
          ]}
          activeKey={turnoValido ?? ''}
        />

        <div className="tabla-wrap">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
                <Th>Fecha</Th>
                <Th>Turno</Th>
                <Th>Sin novedad</Th>
                <Th>Con antecedentes</Th>
                <Th>Veh. revisar</Th>
                <Th>Veh. REPUVE</Th>
                <Th>Motos</Th>
                <Th>Persecuciones</Th>
                <Th>Asegurados</Th>
                <Th>Recuperados</Th>
                <Th>Incendios</Th>
                <Th>Tránsito</Th>
                <Th>Total personas</Th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 && (
                <tr><td colSpan={13} style={{ padding: 32, textAlign: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>No hay registros</td></tr>
              )}
              {registros.map(r => (
                <FilaIncidenteCamara key={r.id} registro={r} />
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, letterSpacing: 'normal', color: '#64748b', textTransform: 'none', textAlign: 'left', padding: '10px 12px', fontWeight: 600 }}>{children}</th>
}
