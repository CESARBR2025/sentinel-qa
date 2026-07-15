import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { verificarRolJuzgado, obtenerDatosAsegurado } from '@/lib/agente_juzgado/service'
import { obtenerEvidenciasMonitorista } from '@/lib/agente_juzgado/repository'
import { CapturarDetallesForm } from '@/components/agente_juzgado/CapturarDetallesForm'
import { DetallesAseguradoView } from '@/components/agente_juzgado/DetallesAseguradoView'
import { DashboardHeader } from '@/components/partials/Header'
import { APP_VERSION } from "@/lib/constants"

export default async function AseguradosPage({ params }: { params: Promise<{ solicitudId: string }> }) {
  const { solicitudId } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolJuzgado(session.user.id)
  if (!esValido) redirect('/dashboard')

  const data = await obtenerDatosAsegurado(solicitudId)
  if (!data) notFound()

  const evidencias = await obtenerEvidenciasMonitorista(solicitudId)

  const datosCapturados = data.folioSija !== null
  const user = session.user as { name: string; apellido?: string; email?: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader
        user={{ name: user.name, apellido: user.apellido, email: user.email || '' }}
        roleLabel={datosCapturados ? 'Detalles del Expediente' : 'Capturar Detalles'}
        backHref="/agente_juzgado/solicitudes"
        backLabel="Solicitudes"
      />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {datosCapturados ? (
          <DetallesAseguradoView solicitudId={solicitudId} data={data} evidencias={evidencias} />
        ) : (
          <CapturarDetallesForm solicitudId={solicitudId} data={data} />
        )}

        <div style={{
          marginTop: 'auto', paddingTop: 20,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>CENTINELA {APP_VERSION} · JUZGADO · ASEGURADOS</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#059669' }}></span>
          </div>
        </div>

      </div>
    </div>
  )
}
