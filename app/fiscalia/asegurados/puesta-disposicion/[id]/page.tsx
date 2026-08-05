import { redirect } from 'next/navigation'
import { FormularioPuestaDisposicion } from '@/components/fiscalia/FormularioPuestaDisposicion'
import { obtenerDashboardFiscalia, obtenerDetalleAseguradoCompletoAction, obtenerPuestaDisposicionAction } from '@/lib/fiscalia/actions'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PuestaDisposicionPage({ params }: Props) {
  const user = await obtenerDashboardFiscalia()
  const { id: reporteCampoId } = await params

  const { data, error } = await obtenerDetalleAseguradoCompletoAction(reporteCampoId)
  if (!data || error) redirect('/fiscalia/asegurados')

  const { data: pad } = await obtenerPuestaDisposicionAction(reporteCampoId)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader user={user} roleLabel="Puesta a Disposición" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Puesta a"
          accent="Disposición"
          accentColor="#7c3aed"
          subtitle={`Cierre del trámite del reporte #${reporteCampoId}`}
          actions={<PageHeaderLink href="/fiscalia/asegurados" variant="secondary">← Asegurados</PageHeaderLink>}
        />

        <FormularioPuestaDisposicion reporteCampoId={reporteCampoId} data={data} puestaDisposicion={pad} ocultarEncabezado />

        <DashboardFooter />
      </main>
    </div>
  )
}
