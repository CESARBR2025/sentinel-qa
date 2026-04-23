import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignOutButton } from './sign-out-button'
import { Enable2FA } from './enable-2fa'
import { ModuleCards } from './module-cards'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const user = session.user as {
    name: string; apellido?: string; email: string; twoFactorEnabled?: boolean
  }

  return (
    <main style={{ minHeight:'100vh', background:'#070b16', color:'#d8e0f0', fontFamily:'Inter,system-ui,sans-serif', padding:'48px 56px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:48, paddingBottom:24, borderBottom:'1px solid #1b2742' }}>
        <div>
          <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, letterSpacing:'0.3em', color:'#c0223a', textTransform:'uppercase', marginBottom:8 }}>
            Tablero táctico
          </div>
          <h1 style={{ fontFamily:'Barlow Condensed,sans-serif', fontWeight:800, fontSize:48, letterSpacing:'0.06em', textTransform:'uppercase', margin:0, color:'#d8e0f0' }}>
            SENTINEL <span style={{ color:'#d4a43a' }}>C4</span>
          </h1>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'#d4a43a', letterSpacing:'0.12em' }}>
              {user.name} {user.apellido ?? ''}
            </div>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#4a5878', letterSpacing:'0.1em', marginTop:2 }}>
              {user.email}
            </div>
          </div>
          <SignOutButton />
        </div>
      </div>

      {/* Módulos */}
      <ModuleCards />

      {/* Seguridad de cuenta */}
      <div style={{ borderTop:'1px solid #1b2742', paddingTop:32, marginTop:16 }}>
        <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, letterSpacing:'0.28em', color:'#4a5878', textTransform:'uppercase', marginBottom:16 }}>
          › Seguridad de la cuenta
        </div>
        <div style={{ maxWidth:420 }}>
          <Enable2FA enabled={!!user.twoFactorEnabled} />
        </div>
      </div>

      <div style={{ marginTop:48, fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'#2a3a5e', letterSpacing:'0.18em', textTransform:'uppercase', textAlign:'center' }}>
        SSPM · SAN JUAN DEL RÍO · QRO · SENTINEL v0.1
      </div>
    </main>
  )
}
