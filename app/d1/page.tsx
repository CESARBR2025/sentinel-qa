import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Plus } from 'lucide-react';

import { DashboardHeader } from '@/components/partials/Header';
import { styles } from '@/components/reportes/d1/styles';
import { D1Filters } from '@/components/reportes/d1/D1Filters';
import { D1ReportsTable } from '@/components/reportes/d1/D1ReportsTable';
import { listarReportesD1 } from '@/lib/d1/service'
import { db } from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function ReportesD1Page({
    searchParams,
}: {
    searchParams: Promise<{ from?: string; to?: string; folio?: string }>
}) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect('/login')

    const [userRole] = await db
        .select({ rolNombre: roles.nombre })
        .from(users)
        .leftJoin(roles, eq(users.rolId, roles.id))
        .where(eq(users.id, session.user.id))
        .limit(1)

    if (!['Administrador', 'Reportante'].includes(userRole?.rolNombre ?? '')) redirect('/dashboard')

    const user = session.user as { name: string; email: string; image?: string }
    const sp = await searchParams
    const data = await listarReportesD1(sp.from, sp.to, sp.folio)

    return (
        <div style={styles.container}>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
            <DashboardHeader user={user} />
            <main style={styles.main}>
                <div style={styles.headerContainer}>
                    <div>
                        <span style={styles.tag}>SSPM · SISTEMA DE DENUNCIA D1</span>
                        <h1 style={styles.title}>REGISTRO DE <span style={{ color: '#2563EB' }}>REPORTES D1</span></h1>
                    </div>
                </div>
                <D1Filters />
                <D1ReportsTable data={data} />
            </main>
        </div>
    )
}