import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { FileStack, Plus, FileDown } from 'lucide-react';

import { DashboardHeader } from '@/components/partials/Header';
import { styles } from '@/components/reportes/sin_robos/styles';
import { TablaReportesLimpios } from '@/components/reportes/sin_robos/ReporteSinRobos';
import { ReportFilters } from '@/components/reportes/sin_robos/ReportFilters';
import { listarReportesSinNovedad } from '@/lib/reportes-sin-novedad/service'
import { getUserWithRole } from '@/lib/auth/helpers'

export default async function ReportesLimpiosPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; q?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const userWithRole = await getUserWithRole(session.user.id)

  if (!userWithRole || !['Administrador', 'Reportante'].includes(userWithRole.rolNombre ?? '')) redirect('/dashboard')

  const user = session.user as { name: string; email: string; image?: string }
  const sp = await searchParams
  const data = await listarReportesSinNovedad(sp.from || undefined, sp.to || undefined, sp.q || undefined)

  return (
    <div style={styles.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <DashboardHeader user={user} />
      <main style={styles.main}>
        <div style={styles.headerContainer}>
          <div>
            <span style={styles.tag}>SSPM · SISTEMA SENTINEL</span>
            <h1 style={styles.title}>REPORTES <span style={{ color: '#2563EB' }}>SIN NOVEDAD</span></h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <a href={`/api/reportes-sin-novedad/exportar?from=${sp.from ?? ''}&to=${sp.to ?? ''}&q=${sp.q ?? ''}`}
              style={{ ...styles.primaryButton, background: '#16a34a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <FileStack size={16} /> EXPORTAR EXCEL
            </a>
          </div>
        </div>
        <ReportFilters />
        <TablaReportesLimpios data={data} />
      </main>
    </div>
  )
}