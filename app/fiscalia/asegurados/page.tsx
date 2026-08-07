import { TabAsegurados } from '@/components/fiscalia/TabAsegurados'
import { obtenerDashboardFiscalia, obtenerAseguradosAction } from '@/lib/fiscalia/actions'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader } from '@/components/partials/PageHeader'

export default async function AseguradosPage() {
  const user = await obtenerDashboardFiscalia()
  const { pendientes, completados } = await obtenerAseguradosAction()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader user={user} roleLabel="Asegurados" backHref="/fiscalia" backLabel="Panel" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <PageHeader
          title="Gestión de"
          accent="Asegurados"
          subtitle="Detenidos asegurados, captura de direcciones y puesta a disposición"
        />

        <TabAsegurados pendientes={pendientes} completados={completados} />

        <DashboardFooter />
      </main>
    </div>
  )
}
