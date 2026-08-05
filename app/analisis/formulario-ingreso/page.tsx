import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'
import RegistroDetenidoStepper from '@/components/analisis/formAnalisis'
import { tieneAccesoAnalisis, tienePermiso } from '@/lib/analisis/permisos'

export default async function DespachoPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ id?: string }> 
}) {
  
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoAnalisis(session.user.id))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'analisis', 'crear'))) redirect('/dashboard')

    const { id } = await searchParams;

  const user = session.user as { name: string; apellido?: string; email: string, id: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-tactical { animation: fadeIn 0.4s ease-out forwards; }
      `}} />

      <DashboardHeader user={user} roleLabel="Análisis" />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <PageHeader
          title="Registro Nacional de"
          accent="Detenidos (IPH)"
          subtitle="Módulo de inteligencia y análisis · registro del Informe Policial Homologado"
          actions={<PageHeaderLink href="/analisis" variant="secondary">← Análisis</PageHeaderLink>}
        />

        <div className="animate-tactical">
            <RegistroDetenidoStepper />
        </div>

        <div style={{ marginTop: 60 }}>
            <DashboardFooter />
        </div>
      </main>
    </div>
  )
}
