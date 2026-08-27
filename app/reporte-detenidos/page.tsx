import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader } from '@/components/partials/PageHeader'
import { tienePermiso } from '@/lib/reporte-detenidos/permisos'
import { listarDetenidosCompletos } from '@/lib/reporte-detenidos/repository'
import { BotonGenerarPpt } from '@/components/reporte-detenidos/BotonGenerarPpt'
import { TablaDetenidosReporte } from '@/components/reporte-detenidos/TablaDetenidosReporte'

export default async function ReporteDetenidosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'reporte_detenidos', 'ver'))) redirect('/agente_reportes')

  const user = session.user as { name: string; apellido?: string; email: string }
  const detenidos = await listarDetenidosCompletos()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f1f5f9', color: '#1e293b', fontFamily: 'var(--apple-font-display)' }}>
      <DashboardHeader user={user} roleLabel="Agente Reportes" backHref="/agente_reportes" backLabel="Panel de Reportes" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Reporte de"
          accent="Detenidos"
          accentColor="#059669"
          subtitle="Detenidos con fotografía frontal, derecho e izquierdo ya completadas por Fiscalía/Juzgado"
          actions={<BotonGenerarPpt />}
        />

        <TablaDetenidosReporte detenidos={detenidos} />

        <DashboardFooter />
      </main>
    </div>
  )
}
