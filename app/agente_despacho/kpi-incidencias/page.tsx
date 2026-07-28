import { redirect } from 'next/navigation'
import { auth }     from '@/lib/auth'
import { headers }  from 'next/headers'
import { SubHeader } from '@/components/partials/SubHeader'
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
      <SubHeader
        backHref="/agente_despacho"
        backLabel="Panel Despacho"
        title="KPI"
        accent="Incidencias"
        user={user}
      />
      <main style={{ maxWidth: 1600, margin: '0 auto', padding: '32px 48px' }}>
        <KpiIncidenciasView
          tiposIncidente={catalogos.incidentes.map(t => ({ id: t.id, nombre: t.nombre }))}
          prioridades={catalogos.prioridades.map(p => ({ id: p.id, nombre: p.nombre }))}
        />
        <div style={{ marginTop: 40 }}><DashboardFooter /></div>
      </main>
    </div>
  )
}
