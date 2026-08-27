import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DashboardHeader } from '@/components/partials/Header';
import { PageHeader } from '@/components/partials/PageHeader';
import { DescargaFilters } from '@/components/reportes/d1_noiniciada/DescargaFilters';
import { DescargaTable } from '@/components/reportes/d1_noiniciada/DescargaTable';
import { listarSinD1 } from '@/lib/reportes-sin-d1/service'
import { tienePermiso } from '@/lib/reportes/permisos'

export default async function DescargasPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; nombre?: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tienePermiso(session.user.id, 'reportes_ciudadano', 'ver'))) redirect('/dashboard')


  const user = session.user as { name: string; email: string; image?: string }
  const sp = await searchParams
  const data = await listarSinD1(sp.from || undefined, sp.to || undefined, sp.nombre || undefined)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f1f5f9', color: '#0f172a', fontFamily: 'var(--apple-font-display)' }}>
      <DashboardHeader user={user} roleLabel="D1 No Iniciada" backHref="/agente_reportes" backLabel="Panel de Reportes" />
      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Reportes"
          accent="Sin D1 Iniciada"
          subtitle="SSPM · Módulo de trámite inicial"
        />
        <DescargaFilters />
        <DescargaTable data={data} />
      </main>
    </div>
  )
}