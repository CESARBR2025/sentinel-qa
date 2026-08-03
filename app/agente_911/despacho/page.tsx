import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import { DashboardFooter } from '@/components/partials/Footer'
import { TablonDespacho } from '@/components/911/despacho/TablonDespacho'
import { tieneAccesoSeccion, obtenerRolNombre } from '@/lib/911/permisos'

export default async function DespachoPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoSeccion(session.user.id, '911_despacho'))) redirect('/dashboard')

  const rolNombre = await obtenerRolNombre(session.user.id)
  const backHref = rolNombre === 'agente_despacho' ? '/agente_despacho' : '/dashboard'
  const backLabel = rolNombre === 'agente_despacho' ? 'Panel Despacho' : 'Dashboard'

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
      <DashboardHeader user={user} />
      <main className="pad-pagina" style={{ width: '100%' }}>
        <PageHeader
          title="Reportes"
          accent="de Despacho"
          subtitle="Tablón de incidentes pendientes, asignación de unidades y elementos por turno"
          actions={<PageHeaderLink href={backHref} variant="secondary">← {backLabel}</PageHeaderLink>}
        />
        <TablonDespacho />
        <div style={{ marginTop: 40 }}><DashboardFooter /></div>
      </main>
    </div>
  )
}