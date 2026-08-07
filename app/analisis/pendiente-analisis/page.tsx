import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader } from '@/components/partials/PageHeader'
import TablonAnalisis from '@/components/analisis/TablonAnalisis'
import { tieneAccesoAnalisis, tienePermiso } from '@/lib/analisis/permisos'

export default async function AnalisisPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoAnalisis(session.user.id))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'analisis', 'ver'))) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .analisis-row:hover { background-color: #f1f5f9 !important; }
      `}} />
      
      <DashboardHeader user={user} roleLabel="Análisis" backHref="/analisis" backLabel="Análisis" />
      
      <main className="pad-dashboard" style={{ maxWidth: '1400px', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PageHeader
          title="Bitácora de"
          accent="Resultados Operativos"
          subtitle="Inteligencia y estadística · matriz de reportes de campo"
        />

        <TablonAnalisis />
        
        <DashboardFooter />
      </main>
    </div>
  )
}
