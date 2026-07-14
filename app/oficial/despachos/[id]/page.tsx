import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { verificarRolOficial, listarDespachosAsignados, obtenerCatalogos } from '@/lib/oficial/service'
import { obtenerHistorialCompleto } from '@/lib/incidentes/service'
import { obtenerIncidenteBasico } from '@/lib/incidentes/repository'
import { HistorialIncidente } from '@/components/incidentes/HistorialIncidente'
import { FormularioRecorrido } from '@/components/oficial/FormularioRecorrido'
import { MarcarEnSitioButton } from '@/components/oficial/MarcarEnSitioButton'
import { DashboardHeader } from '@/components/partials/Header'

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

  const [historial, catalogos, incidenteBasico] = await Promise.all([
    obtenerHistorialCompleto(id),
    obtenerCatalogos(),
    obtenerIncidenteBasico(id),
  ])
  if (!historial || !incidenteBasico) notFound()

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        backHref="/oficial/despachos"
        backLabel="Mis despachos"
      />

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 48px 64px' }}>

    <FormularioRecorrido
          embedded
          user={session.user}
          catalogos={catalogos}
          incidenteId={id}
          prefill={{
            folioCad: asignacion.folio,
            descripcion: asignacion.descripcion ?? undefined,
            calle: asignacion.calle ?? undefined,
            colonia: asignacion.colonia ?? undefined,
            tipoIncidente: asignacion.tipoIncidente ?? undefined,
            prioridad: asignacion.prioridad ?? undefined,
          }}
        />


        <div style={{ marginBottom: 24 , marginTop: 24}}>
          <HistorialIncidente historial={historial} />

          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700,
              padding: '4px 12px', borderRadius: 2,
              ...(incidenteBasico.estatus === 'en_despacho'
                ? { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }
                : incidenteBasico.estatus === 'en_sitio'
                ? { background: '#f0fdfa', color: '#0f766e', border: '1px solid #ccfbf1' }
                : { background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }),
            }}>
              {incidenteBasico.estatus === 'en_despacho' ? 'UNIDADES ASIGNADAS' :
               incidenteBasico.estatus === 'en_sitio' ? 'EN SITIO' :
               incidenteBasico.estatus.toUpperCase()}
            </span>

            <MarcarEnSitioButton incidenteId={id} estatusActual={incidenteBasico.estatus} />
          </div>
        </div>
  <footer style={{ padding: '24px 0 0', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#94a3b8', textAlign: 'center', marginTop: 40 }}>
          SSPM · SAN JUAN DEL RÍO · SENTINEL v0.1 · OFICIAL
        </footer>
        
      </main>
         
    </div>
  )
}
