import { TabSolicitudes } from '@/components/fiscalia/TabSolicitudes'
import { obtenerDashboardFiscalia, obtenerSolicitudes } from '@/lib/fiscalia/actions'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

export default async function SolicitudesPage() {
  const user = await obtenerDashboardFiscalia()
  const { pendientes, sinEvidencias, conEvidencias, finalizadas } = await obtenerSolicitudes()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .st-h { border-bottom: 1px solid #e2e8f0; }
        .st-h th { font-family: 'JetBrains Mono',monospace; font-size: 10px; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase; padding: 12px 16px; text-align: left; font-weight: 600; }
        .st-r td { font-family: 'Inter',sans-serif; font-size: 12px; color: #334155; padding: 14px 16px; border-bottom: 1px solid #f1f5f9; }
        .st-r:hover td { background: #f8fafc; }
        .badge-estado { font-family: 'JetBrains Mono',monospace; font-size: 9px; letter-spacing: 0.06em; padding: 3px 10px; display: inline-block; text-transform: uppercase; }
      `}</style>

      <DashboardHeader user={user} roleLabel="Solicitudes de Evidencias" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <PageHeader
          title="Solicitudes de"
          accent="Evidencias"
          subtitle="Reportes de denuncias con solicitud de evidencias a monitorista"
          actions={<PageHeaderLink href="/fiscalia" variant="secondary">← Panel</PageHeaderLink>}
        />

        <TabSolicitudes pendientes={pendientes} sinEvidencias={sinEvidencias} conEvidencias={conEvidencias} finalizadas={finalizadas} />

        <DashboardFooter />
      </main>
    </div>
  )
}
