import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { FileDown, Download } from 'lucide-react'

import { DashboardHeader } from '@/components/partials/Header'
import { ReportFilters } from '@/components/reportes/estadisticos/ReportFilters'
import { styles } from '@/components/reportes/modulo_incidentes/styles'
import { PhoneStatsCards } from '@/components/reportes/estadisticos/PhoneStatsCards'
import { PhoneReportsTable } from '@/components/reportes/estadisticos/PhoneReportsTable'
import { obtenerDatosTelefonicos } from '@/lib/reportes-operativos/service'
import { db } from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export default async function ReportesTelefonicosPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
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
  const data = await obtenerDatosTelefonicos(sp.from, sp.to)

  return (
    <div style={styles.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <DashboardHeader user={user} />
      <main style={styles.main}>
        <div style={styles.headerContainer}>
          <div>
            <span style={styles.tag}>SSPM · INTELIGENCIA DE COMUNICACIONES</span>
            <h1 style={styles.title}>REPORTES <span style={{ color: '#2563EB' }}>TELEFÓNICOS</span></h1>
          </div>
        </div>
        <ReportFilters />
        <PhoneStatsCards total={data.length} />
        <PhoneReportsTable data={data} />
      </main>
    </div>
  )
}