import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { obtenerDenunciasPendientes, obtenerDenunciasAtendidas } from '@/lib/monitorista/denuncia-service'
import { Camera, ClipboardList, Clock, History, Shield, User, Video } from 'lucide-react'
import { obtenerPermisosUsuario } from '@/lib/monitorista/permisos'
import { getMonitoristaStats } from '@/lib/monitorista/repository'
import { getUserWithRole } from '@/lib/auth/helpers'
import { DashboardHeader } from '@/components/partials/Header'
import Link from 'next/link'

export default async function MonitoristaHubPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const userWithRole = await getUserWithRole(session.user.id)
  const esAdmin = userWithRole?.rolNombre === 'Administrador'
  const permisos = await obtenerPermisosUsuario(session.user.id)

  const stats = await getMonitoristaStats(session.user.id)
  const [d1Pend, d1Comp] = await Promise.all([
    obtenerDenunciasPendientes(),
    obtenerDenunciasAtendidas(),
  ])

  const user = session.user as { name: string; apellido?: string; email: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <DashboardHeader user={user as { name: string; apellido?: string; email: string }} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase', fontWeight: 700 }}>Centro de Monitoreo</span>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Monitorista</h1>
          <div style={{ width: 64, height: 3, background: '#1f355a', marginTop: 12 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          {permisos.solicitudes.puede_ver && <Link href="/monitorista/solicitudes" style={{ textDecoration: 'none' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <Camera size={28} color="#1f355a" />
                <span style={onlineStyle}>ONLINE</span>
              </div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 26, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Solicitudes de Evidencia</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>Denuncias D1 · Incidentes</div>
              <div style={{ display: 'flex', gap: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Pendientes</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#b45309' }}>{d1Pend.length + stats.solsPend}</div></div>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Completadas</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#15803d' }}>{d1Comp.length + stats.solsComp}</div></div>
              </div>
              <div style={{ marginTop: 20, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, color: '#1f355a', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 8 }}>ACCEDER →</div>
            </div>
          </Link>}

          {permisos.detenidos.puede_ver && <Link href="/monitorista/detenidos" style={{ textDecoration: 'none' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <User size={28} color="#059669" />
                <span style={onlineStyle}>ONLINE</span>
              </div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 26, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Reporte de Detenidos</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>Solicitar evidencias a Fiscalía/Juzgado</div>
              <div style={{ display: 'flex', gap: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Enviados</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#b45309' }}>{stats.detPend}</div></div>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Completados</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#15803d' }}>{stats.detComp}</div></div>
              </div>
              <div style={{ marginTop: 20, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, color: '#1f355a', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 8 }}>ACCEDER →</div>
            </div>
          </Link>}

          {permisos.incidentes_camara.puede_ver && <Link href="/monitorista/incidentes-camara" style={{ textDecoration: 'none' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <Video size={28} color="#7c3aed" />
                <span style={onlineStyle}>ONLINE</span>
              </div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 26, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Incidentes por Cámara</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>Registro de novedades por turno</div>
              <div style={{ display: 'flex', gap: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Personas</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#7c3aed' }}>{stats.icStats?.personas ?? 0}</div></div>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Vehículos</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#7c3aed' }}>{stats.icStats?.vehiculos ?? 0}</div></div>
              </div>
              <div style={{ marginTop: 20, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 8 }}>ACCEDER →</div>
            </div>
          </Link>}

          {permisos.historial.puede_ver && <Link href="/monitorista/historial" style={{ textDecoration: 'none' }}>
            <div style={cardStyle}>
              <div style={{ marginBottom: 20 }}><History size={28} color="#64748b" /></div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 26, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Historial</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>Actividad registrada</div>
              <div style={{ paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Registros</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{stats.histCount}</div></div>
              </div>
              <div style={{ marginTop: 20, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 8 }}>VER →</div>
            </div>
          </Link>}
        </div>
      </main>

      <footer style={{ padding: '32px 48px', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
        SSPM · SAN JUAN DEL RÍO · QRO · SENTINEL v0.1
      </footer>
    </div>
  )
}

const cardStyle: import('react').CSSProperties = { background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, cursor: 'pointer', borderRadius: 2 }
const onlineStyle: import('react').CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#059669', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }
