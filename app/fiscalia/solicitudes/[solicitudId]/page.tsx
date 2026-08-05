import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { verificarRolFiscalia, obtenerDatosAsegurado } from '@/lib/fiscalia/service'
import { obtenerEvidenciasMonitorista } from '@/lib/fiscalia/repository'
import { CapturarDetallesForm } from '@/components/fiscalia/CapturarDetallesForm'
import { DetallesAseguradoView } from '@/components/fiscalia/DetallesAseguradoView'
import { FotosExpedienteSection } from '@/components/fiscalia/FotosExpedienteSection'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

export default async function AseguradosFiscaliaPage({ params }: { params: Promise<{ solicitudId: string }> }) {
  const { solicitudId } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esValido = await verificarRolFiscalia(session.user.id)
  if (!esValido) redirect('/dashboard')

  const data = await obtenerDatosAsegurado(solicitudId)
  if (!data) notFound()

  const evidencias = await obtenerEvidenciasMonitorista(solicitudId)

  const datosCapturados = data.folioSija !== null
  const user = session.user as { name: string; apellido?: string; email?: string }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader
        user={{ name: user.name, apellido: user.apellido, email: user.email || '' }}
        roleLabel={datosCapturados ? 'Detalles del Expediente' : 'Capturar Detalles'}
      />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <PageHeader
          title={datosCapturados ? 'Detalles del' : 'Capturar'}
          accent={datosCapturados ? 'Expediente' : 'Detalles'}
          accentColor="#7c3aed"
          subtitle={`Expediente de la solicitud #${solicitudId}`}
          actions={<PageHeaderLink href="/fiscalia/solicitudes" variant="secondary">← Solicitudes</PageHeaderLink>}
        />

        {datosCapturados ? (
          <DetallesAseguradoView solicitudId={solicitudId} data={data} evidencias={evidencias} ocultarEncabezado />
        ) : <>
          <CapturarDetallesForm solicitudId={solicitudId} data={data} ocultarEncabezado />
          {data.reporteCampoId && (
            <FotosExpedienteSection
              detenidos={data.detenidosLista || []}
              reporteCampoId={data.reporteCampoId}
              hayArmaFuego={!!data.hayArmaFuego}
              hayArmaBlanca={!!data.hayArmaBlanca}
              hayDroga={!!data.hayDroga}
              hayVehiculo={!!data.hayVehiculo}
              hayHidrocarburo={!!data.hayHidrocarburo}
              objetosRecuperados={data.objetosRecuperados || undefined}
            />
          )}
        </>}

        <DashboardFooter />
      </main>
    </div>
  )
}
