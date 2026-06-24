import { redirect }        from 'next/navigation'
import { auth }            from '@/lib/auth'
import { headers }         from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { TablonDespacho }  from '@/components/911/despacho/TablonDespacho'

export default async function DespachoPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
      <DashboardHeader user={user} />
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 48px' }}>
        <TablonDespacho />
        <div style={{ marginTop: 40 }}><DashboardFooter /></div>
      </main>
    </div>
  )
}