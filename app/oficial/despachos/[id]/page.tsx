import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { verificarRolOficial, listarDespachosAsignados } from '@/lib/oficial/service'
import { getCatalogos } from '@/lib/911/service'
import { obtenerIncidenteBasico } from '@/lib/incidentes/repository'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { DespachoContent } from '@/components/oficial/DespachoContent'
import { APP_VERSION } from "@/lib/constants"

export default async function AtenderDespachoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  // Solo puede atender incidentes asignados a él y aún en despacho
  const asignados = await listarDespachosAsignados(session.user.id)
  const asignacion = asignados.find(d => d.incidenteId === id)
  if (!asignacion) notFound()

  const [catalogos, incidenteBasico] = await Promise.all([
    getCatalogos(),
    obtenerIncidenteBasico(id),
  ])
  if (!incidenteBasico) notFound()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>
      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        variant="apple"
      />

      <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', minHeight: 0, boxSizing: 'border-box', overflowX: 'clip' }}>
        <div className="pad-pagina" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <PageHeader
            title="Atender"
            accent="Despacho"
            subtitle={`${asignacion.folio} · ${asignacion.tipoIncidente || 'incidente'}`}
            actions={<PageHeaderLink href="/oficial/despachos" variant="secondary">← Mis despachos</PageHeaderLink>}
          />

          <DespachoContent
            estatusInicial={incidenteBasico.estatus}
            incidenteId={id}
            asignacion={asignacion}
            catalogos={catalogos}
            user={session.user}
          />
        </div>

        <footer style={{ padding: '24px 0', fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#94a3b8', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
          SSPM · San Juan del Río · Centinela {APP_VERSION} · Oficial
        </footer>
      </main>
    </div>
  )
}
