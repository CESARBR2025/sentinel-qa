import FiscaliaTable from '@/components/fiscalia/FiscaliaTable'
import { obtenerDashboardFiscalia, obtenerLiberacionesAction } from '@/lib/fiscalia/actions'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

export default async function LiberacionesPage() {
  const [user, liberaciones] = await Promise.all([
    obtenerDashboardFiscalia(),
    obtenerLiberacionesAction(),
  ])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader user={user} roleLabel="Liberaciones de Vehículos" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <PageHeader
          title="Gestión de"
          accent="Liberaciones"
          subtitle="Administra las liberaciones de vehículos remitidas por la Policía Vial"
          actions={<PageHeaderLink href="/fiscalia" variant="secondary">← Panel</PageHeaderLink>}
        />

        <FiscaliaTable
          respuestaServidor={{
            data: liberaciones.data,
            total: liberaciones.total,
          }}
        />

        <DashboardFooter />
      </main>
    </div>
  )
}
