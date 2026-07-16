import { auth }    from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import PrevencionNav from './PrevencionNav'
import { CampanillaNotificaciones } from '@/components/notificaciones/CampanillaNotificaciones'
import { generarAlertasBusquedas }  from '@/lib/notificaciones/checker'
import { listarNotificacionesNoLeidas } from '@/lib/notificaciones/repository'
import { obtenerPermisosUsuario } from '@/lib/prevencion/permisos'
import { DashboardHeader } from '@/components/partials/Header'
import { APP_VERSION } from "@/lib/constants"

export default async function PrevencionLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const permisos = await obtenerPermisosUsuario(session.user.id)
  const tieneAcceso = permisos.busquedas.puede_ver || permisos.medidas.puede_ver || permisos.solicitudes.puede_ver
  if (!tieneAcceso) redirect('/dashboard')

  // Generate alerts for this user (idempotent)
  await generarAlertasBusquedas(session.user.id)

  // Fetch initial unread notifications to pass as SSR props
  const initialNotifs = await listarNotificacionesNoLeidas(session.user.id)

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader user={user} roleLabel="Prevención del Delito" backHref="/dashboard">
        <CampanillaNotificaciones initialNotifs={initialNotifs} />
      </DashboardHeader>

      {/* Sub-navegación */}
      <PrevencionNav />

      {/* Contenido */}
      <main style={{ padding: '40px 48px' }}>
        {children}
      </main>

      <footer style={{ padding: '24px 48px', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
        SSPM · SAN JUAN DEL RÍO · QRO · CENTINELA {APP_VERSION}
      </footer>
    </div>
  )
}
