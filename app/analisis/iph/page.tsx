/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import BitacoraIPH from '@/components/analisis/iph/BitacoraIPH'
import { tieneAccesoAnalisis, tienePermiso } from '@/lib/analisis/permisos'

export default async function IPHPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoAnalisis(session.user.id))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'analisis', 'ver'))) redirect('/dashboard')

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        .iph-row:hover { background-color: #f8fafc !important; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}} />
      
      <DashboardHeader user={session.user as any} backHref="/analisis" backLabel="Análisis" />
      
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ marginBottom: 32 }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#1f355a', fontWeight: 700, letterSpacing: '0.2em' }}>
                REGISTRO NACIONAL DE DETENCIONES
            </span>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 42, fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                BITÁCORA <span style={{ color: '#3e5171' }}>IPH</span>
            </h1>
            <div style={{ width: 40, height: 4, background: '#3e5171' }}></div>
        </div>

        <BitacoraIPH />
        
        <div style={{ marginTop: 40 }}>
            <DashboardFooter />
        </div>
      </main>
    </div>
  )
}