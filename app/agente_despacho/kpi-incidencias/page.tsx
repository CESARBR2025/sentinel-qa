import { redirect } from 'next/navigation'
import { auth }     from '@/lib/auth'
import { headers }  from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { DashboardFooter } from '@/components/partials/Footer'
import { KpiIncidenciasView } from '@/components/911/kpi/KpiIncidenciasView'
import { tieneAccesoSeccion } from '@/lib/911/permisos'
import { getCatalogos } from '@/lib/911/service'

export default async function KpiIncidenciasPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoSeccion(session.user.id, '911_despacho'))) redirect('/dashboard')

  const catalogos = await getCatalogos()
  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>
      <DashboardHeader user={user} variant="apple" backHref="/agente_despacho" backLabel="Panel Despacho" />
      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PageHeader
          title="KPI"
          accent="Incidencias"
          subtitle="Mapa de ubicación y mapa de calor por rango de fecha y hora"
        />
        <KpiIncidenciasView
          tiposIncidente={catalogos.incidentes.map(t => ({ id: t.id, nombre: t.nombre }))}
          prioridades={catalogos.prioridades.map(p => ({ id: p.id, nombre: p.nombre }))}
        />
        <DashboardFooter />
      </main>
    </div>
  )
}
