import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileDown, Download } from 'lucide-react'

import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { ReportFilters } from '@/components/reportes/estadisticos/ReportFilters'
import { PhoneStatsCards } from '@/components/reportes/estadisticos/PhoneStatsCards'
import { PhoneReportsTable } from '@/components/reportes/estadisticos/PhoneReportsTable'
import { obtenerDatosTelefonicos } from '@/lib/reportes-operativos/service'
import { tienePermiso } from '@/lib/reportes/permisos'

export default async function ReportesTelefonicosPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tienePermiso(session.user.id, 'reportes_ciudadano', 'ver'))) redirect('/dashboard')

  const user = session.user as { name: string; email: string; image?: string }
  const sp = await searchParams
  const data = await obtenerDatosTelefonicos(sp.from, sp.to)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f1f5f9', color: '#0f172a', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <DashboardHeader user={user} roleLabel="Análisis Estadístico" />
      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Reportes"
          accent="Telefónicos"
          subtitle="SSPM · Inteligencia de Comunicaciones"
          actions={
            <PageHeaderLink href="/agente_reportes" variant="secondary">← Panel de Reportes</PageHeaderLink>
          }
        />
        <ReportFilters />
        <PhoneStatsCards total={data.length} />
        <PhoneReportsTable data={data} />
      </main>
    </div>
  )
}