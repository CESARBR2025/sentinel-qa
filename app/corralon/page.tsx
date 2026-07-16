import { obtenerDashboardCorralon, obtenerSolicitudes } from '@/lib/corralon/actions'
import { ModuleCard } from './module-card'
import { DashboardHeader } from '@/components/partials/Header'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getUserWithRole, obtenerHubRol } from '@/lib/auth/helpers'
import { APP_VERSION } from "@/lib/constants"

export default async function CorralonDashboardPage() {
  const [user, solicitudes] = await Promise.all([
    obtenerDashboardCorralon(),
    obtenerSolicitudes(),
  ])

  const session = await auth.api.getSession({ headers: await headers() })
  const userWithRole = session ? await getUserWithRole(session.user.id) : null
  const hub = userWithRole?.esAdmin ? null : obtenerHubRol(userWithRole?.rolNombre)
  const backHref = hub === '/corralon' ? undefined : (hub ?? '/dashboard')

  const pendientesCount = solicitudes.pendientes.length

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <DashboardHeader user={user} roleLabel="Corralón" backHref={backHref} />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 48px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* Módulo Operativo */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 4, height: 16, background: '#d97706' }}></div>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: '0.08em', color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>
              Módulos Operativos
            </h2>
          </div>

          <ModuleCard pendientesCount={pendientesCount} />
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'auto', paddingTop: 20,
          borderTop: '1px solid #e2e8f0',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>SSPM · SAN JUAN DEL RÍO · QRO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>CENTINELA {APP_VERSION} · CORRALÓN</span>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#d97706' }}></span>
          </div>
        </div>

      </div>
    </div>
  )
}
