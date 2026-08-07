import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DashboardHeader } from '@/components/partials/Header';
import { PageHeader } from '@/components/partials/PageHeader';
import { D1Filters } from '@/components/reportes/d1/D1Filters';
import { D1ReportsTable } from '@/components/reportes/d1/D1ReportsTable';
import { listarReportesD1 } from '@/lib/d1/service'
import { tienePermiso } from '@/lib/reportes/permisos'

export default async function ReportesD1Page({
    searchParams,
}: {
    searchParams: Promise<{ from?: string; to?: string; folio?: string }>
}) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect('/login')

    if (!(await tienePermiso(session.user.id, 'reportes_ciudadano', 'ver'))) redirect('/dashboard')

    const user = session.user as { name: string; email: string; image?: string }
    const sp = await searchParams
    const data = await listarReportesD1(sp.from, sp.to, sp.folio)

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f1f5f9', color: '#0f172a', fontFamily: 'Inter,sans-serif' }}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
            <DashboardHeader user={user} roleLabel="Sistema Cosmos" backHref="/agente_reportes" backLabel="Panel de Reportes" />
            <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <PageHeader
                    title="Registro de"
                    accent="Reportes D1"
                    subtitle="SSPM · Sistema de Denuncia D1"
                />
                <D1Filters />
                <D1ReportsTable data={data} />
            </main>
        </div>
    )
}