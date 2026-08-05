import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { obtenerDetalleInfraccionViaAction } from '@/lib/fiscalia/actions'
import { DetalleInfraccionView } from '@/components/shared/DetalleInfraccionView'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

export default async function DetalleInfraccionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const { id } = await params

  const result = await obtenerDetalleInfraccionViaAction(id)
  const user = session.user as { name: string; apellido?: string; email?: string }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader
        user={{ name: user.name, apellido: user.apellido, email: user.email || '' }}
        roleLabel="Detalle de Infracción"
      />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <PageHeader
          title="Detalle de"
          accent="Infracción"
          subtitle="Infracción VÍA con garantía de vehículo · liberación"
          actions={<PageHeaderLink href="/fiscalia/liberaciones" variant="secondary">← Liberaciones</PageHeaderLink>}
        />

        <DetalleInfraccionView
          detalle={result.data}
          error={result.error}
        />

        <DashboardFooter />
      </main>
    </div>
  )
}
