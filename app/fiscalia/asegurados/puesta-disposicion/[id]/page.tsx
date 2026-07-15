import { redirect } from 'next/navigation'
import { FormularioPuestaDisposicion } from '@/components/fiscalia/FormularioPuestaDisposicion'
import { obtenerDashboardFiscalia, obtenerDetalleAseguradoCompletoAction, obtenerPuestaDisposicionAction } from '@/lib/fiscalia/actions'
import { DashboardHeader } from '@/components/partials/Header'
import { APP_VERSION } from "@/lib/constants"

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
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader user={user} roleLabel="Puesta a Disposición" backHref="/fiscalia/asegurados" backLabel="Asegurados" />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        <FormularioPuestaDisposicion reporteCampoId={reporteCampoId} data={data} puestaDisposicion={pad} />

        <div style={{
          marginTop: 'auto', paddingTop: 20,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>CENTINELA {APP_VERSION} · FISCALÍA · PUESTA A DISPOSICIÓN</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed' }}></span>
          </div>
        </div>

      </div>
    </div>
  )
}
