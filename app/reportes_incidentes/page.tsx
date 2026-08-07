import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { FiltrosIncidencias } from '@/components/reportes/incidentes/FiltrosIncidencias'
import { IncidenteStat } from '@/components/reportes/incidentes/StatIncidencia'
import { TablaIncidentes } from '@/components/reportes/incidentes/TablaIncidentes'
import { styles } from '@/components/reportes/incidentes/styles'
import { listarReporteDiario, listarReporteSemanal } from '@/lib/reportes-incidentes/service'
import { tienePermiso } from '@/lib/reportes/permisos'

export default async function ReportesIncidentesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; tipo?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tienePermiso(session.user.id, 'reportes_ciudadano', 'ver'))) redirect('/dashboard')

  const user = session.user as { name: string; email: string; image?: string }
  const sp   = await searchParams
  const tipo = sp.tipo ?? 'diario'

  const data = tipo === 'semanal'
    ? await listarReporteSemanal(sp.from || undefined, sp.to || undefined)
    : await listarReporteDiario(sp.from  || undefined, sp.to || undefined)

  const totales = data.reduce(
    (acc, r) => ({
      carcel:   acc.carcel   + r.carcel,
      fiscalia: acc.fiscalia + r.fiscalia,
      fgr:      acc.fgr      + r.fgr,
    }),
    { carcel: 0, fiscalia: 0, fgr: 0 }
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', color: '#0f172a', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <DashboardHeader user={user} roleLabel="Reporte de Incidentes" backHref="/agente_reportes" backLabel="Panel de Reportes" />
      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Reporte de"
          accent="Incidentes"
          subtitle={`${tipo.toUpperCase()} · SSPM Reportes de Incidentes`}
          actions={
            <a
              href={`/api/reportes-incidentes/exportar?from=${sp.from ?? ''}&to=${sp.to ?? ''}&tipo=${tipo}`}
              style={{ ...styles.primaryButton, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#16a34a' }}
            >
              EXCEL
            </a>
          }
        />

        <FiltrosIncidencias />

        <div style={styles.statsGrid}>
          <IncidenteStat label="Cárcel Municipal"   value={totales.carcel}   icon={null} />
          <IncidenteStat label="Detenidos Fiscalía" value={totales.fiscalia} icon={null} />
          <IncidenteStat label="Detenidos FGR"      value={totales.fgr}      icon={null} />
        </div>

        <TablaIncidentes tipo={tipo} data={data} />
      </main>
    </div>
  )
}