import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/partials/Header'
import { FiltrosIncidencias } from '@/components/reportes/incidentes/FiltrosIncidencias'
import { IncidenteStat } from '@/components/reportes/incidentes/StatIncidencia'
import { TablaIncidentes } from '@/components/reportes/incidentes/TablaIncidentes'
import { styles } from '@/components/reportes/incidentes/styles'
import { listarReporteDiario, listarReporteSemanal } from '@/lib/reportes-incidentes/service'

export default async function ReportesIncidentesPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; tipo?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

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
    <div style={styles.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <DashboardHeader user={user} />
      <main style={styles.main}>
        <div style={styles.headerContainer}>
          <div>
            <span style={styles.tag}>SSPM · REPORTES DE INCIDENTES</span>
            <h1 style={styles.title}>
              REPORTE <span style={{ color: '#1f355a' }}>{tipo.toUpperCase()}</span>
            </h1>
          </div>
          <a
            href={`/api/reportes-incidentes/exportar?from=${sp.from ?? ''}&to=${sp.to ?? ''}&tipo=${tipo}`}
            style={{ ...styles.primaryButton, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#16a34a' }}
          >
            EXCEL
          </a>
        </div>

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