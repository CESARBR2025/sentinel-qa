/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader } from '@/components/partials/PageHeader'
import BitacoraIPH from '@/components/analisis/iph/BitacoraIPH'
import { tieneAccesoAnalisis, tienePermiso } from '@/lib/analisis/permisos'

export default async function IPHPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoAnalisis(session.user.id))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'analisis', 'ver'))) redirect('/dashboard')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .iph-row:hover { background-color: #f8fafc !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
      
      <DashboardHeader user={session.user as any} roleLabel="Análisis" backHref="/analisis" backLabel="Análisis" />
      
      <main className="pad-dashboard" style={{ maxWidth: '1400px', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <PageHeader
          title="Bitácora"
          accent="IPH"
          subtitle="Registro Nacional de Detenciones · consulta de IPH registrados"
        />

        <BitacoraIPH />
        
        <DashboardFooter />
      </main>
    </div>
  )
}
