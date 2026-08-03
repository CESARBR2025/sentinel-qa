import { redirect } from 'next/navigation'
import { auth }     from '@/lib/auth'
import { headers }  from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
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
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}} />
      <DashboardHeader user={user} />
      <main className="pad-pagina" style={{ width: '100%' }}>
        <PageHeader
          title="KPI"
          accent="Incidencias"
          subtitle="Mapa de ubicación y mapa de calor por rango de fecha y hora"
          actions={<PageHeaderLink href="/agente_despacho" variant="secondary">← Panel Despacho</PageHeaderLink>}
        />
        <KpiIncidenciasView
          tiposIncidente={catalogos.incidentes.map(t => ({ id: t.id, nombre: t.nombre }))}
          prioridades={catalogos.prioridades.map(p => ({ id: p.id, nombre: p.nombre }))}
        />
        <div style={{ marginTop: 40 }}><DashboardFooter /></div>
      </main>
    </div>
  )
}
