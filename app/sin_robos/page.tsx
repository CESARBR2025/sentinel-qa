import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { FileStack } from 'lucide-react';

import { DashboardHeader } from '@/components/partials/Header';
import { PageHeader } from '@/components/partials/PageHeader';
import { styles } from '@/components/reportes/sin_robos/styles';
import { TablaReportesLimpios } from '@/components/reportes/sin_robos/ReporteSinRobos';
import { ReportFilters } from '@/components/reportes/sin_robos/ReportFilters';
import { listarReportesSinNovedad } from '@/lib/reportes-sin-novedad/service'
import { tienePermiso } from '@/lib/reportes/permisos'

export default async function ReportesLimpiosPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; q?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tienePermiso(session.user.id, 'reportes_ciudadano', 'ver'))) redirect('/dashboard')

  const user = session.user as { name: string; email: string; image?: string }
  const sp = await searchParams
  const data = await listarReportesSinNovedad(sp.from || undefined, sp.to || undefined, sp.q || undefined)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f1f5f9', color: '#0f172a', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <DashboardHeader user={user} roleLabel="Sin Robos Confirmados" backHref="/agente_reportes" backLabel="Panel de Reportes" />
      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Reportes"
          accent="Sin Novedad"
          subtitle="SSPM · Sistema Centinela"
          actions={
            <a href={`/api/reportes-sin-novedad/exportar?from=${sp.from ?? ''}&to=${sp.to ?? ''}&q=${sp.q ?? ''}`}
              style={{ ...styles.primaryButton, background: '#16a34a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <FileStack size={16} /> EXPORTAR EXCEL
            </a>
          }
        />
        <ReportFilters />
        <TablaReportesLimpios data={data} />
      </main>
    </div>
  )
}