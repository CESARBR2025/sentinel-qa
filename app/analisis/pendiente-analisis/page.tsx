import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import TablonAnalisis from '@/components/analisis/TablonAnalisis'
import { tieneAccesoAnalisis, tienePermiso } from '@/lib/analisis/permisos'

export default async function AnalisisPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoAnalisis(session.user.id))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'analisis', 'ver'))) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .analisis-row:hover { background-color: #f1f5f9 !important; }
      `}} />
      
      <DashboardHeader user={user} backHref="/analisis" backLabel="Análisis" />
      
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ marginBottom: 32 }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#1f355a', fontWeight: 700, letterSpacing: '0.2em' }}>
                INTELIGENCIA Y ESTADÍSTICA
            </span>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 42, fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                BITÁCORA DE <span style={{ color: '#3e5171' }}>RESULTADOS OPERATIVOS</span>
            </h1>
            <div style={{ width: 40, height: 4, background: '#3e5171' }}></div>
        </div>

        <TablonAnalisis />
        
        <div style={{ marginTop: 40 }}>
            <DashboardFooter />
        </div>
      </main>
    </div>
  )
}