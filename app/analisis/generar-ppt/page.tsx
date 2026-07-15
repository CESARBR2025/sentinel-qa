import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import RegistroInteligenciaDetenido from '@/components/analisis/generarPresentacion'
import { tieneAccesoAnalisis, tienePermiso } from '@/lib/analisis/permisos'

export default async function RegistroInteligenciaPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tieneAccesoAnalisis(session.user.id))) redirect('/dashboard')
  if (!(await tienePermiso(session.user.id, 'analisis', 'ver'))) redirect('/dashboard')

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-tactical { animation: fadeIn 0.4s ease-out forwards; }
      `}} />

      <DashboardHeader user={user} />

      <main style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ marginBottom: '32px' }}>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#c0223a', fontWeight: 700, letterSpacing: '0.2em' }}>
                INTELIGENCIA E INVESTIGACIÓN
            </span>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: '42px', fontWeight: 800, color: '#0f172a', margin: '4px 0' }}>
                FICHA DE REGISTRO <span style={{ color: '#3e5171' }}>TÁCTICO</span>
            </h1>
            <div style={{ width: '40px', height: '4px', background: '#0f172a' }}></div>
        </div>

        <div className="animate-tactical">
            <RegistroInteligenciaDetenido />
        </div>

        <div style={{ marginTop: 60 }}>
            <DashboardFooter />
        </div>
      </main>
    </div>
  )
}