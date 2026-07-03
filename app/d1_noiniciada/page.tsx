import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { FileDown } from 'lucide-react';

import { DashboardHeader } from '@/components/partials/Header';
import { styles } from '@/components/reportes/d1_noiniciada/styles';
import { DescargaFilters } from '@/components/reportes/d1_noiniciada/DescargaFilters';
import { DescargaTable } from '@/components/reportes/d1_noiniciada/DescargaTable';
import { listarSinD1 } from '@/lib/reportes-sin-d1/service'

export default async function DescargasPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; nombre?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = session.user as { name: string; email: string; image?: string }
  const sp   = await searchParams
  const data = await listarSinD1(sp.from || undefined, sp.to || undefined, sp.nombre || undefined)

  return (
    <div style={styles.container}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      <DashboardHeader user={user} />
      <main style={styles.main}>
        <div style={styles.headerContainer}>
          <div>
            <span style={styles.tag}>SSPM · MÓDULO DE TRÁMITE INICIAL</span>
            <h1 style={styles.title}>REPORTES <span style={{ color: '#2563EB' }}>SIN D1 INICIADA</span></h1>
          </div>
        </div>
        <DescargaFilters />
        <DescargaTable data={data} />
      </main>
    </div>
  )
}