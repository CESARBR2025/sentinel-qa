import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { query } from '@/lib/db'
import { obtenerDenunciasPendientes, obtenerDenunciasAtendidas } from '@/lib/monitorista/denuncia-service'
import { Camera, ClipboardList, Clock, History, Shield, User, Video } from 'lucide-react'
import { SignOutButton } from '@/app/dashboard/sign-out-button'
import Link from 'next/link'
import React from 'react'

export default async function MonitoristaHubPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const r = await query<{ nombre: string }>(
    `SELECT r.nombre FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = $1 LIMIT 1`, [session.user.id],
  )
  const esAdmin = r.rows[0]?.nombre === 'Administrador'

  const [solsPend, solsComp, histCount, d1Pend, d1Comp, detPend, detComp] = await Promise.all([
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitudes_evidencia WHERE status = 'pendiente'"),
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitudes_evidencia WHERE status = 'completada'"),
    query<{ c: number }>("SELECT count(*)::int as c FROM monitorista_historial WHERE monitorista_id = $1", [session.user.id]),
    obtenerDenunciasPendientes(),
    obtenerDenunciasAtendidas(),
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitudes_detenido WHERE id IN (SELECT DISTINCT solicitud_id FROM solicitud_fotos WHERE estado IN ('pendiente','enviado','rechazado'))"),
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitudes_detenido WHERE id IN (SELECT DISTINCT solicitud_id FROM solicitud_fotos WHERE estado NOT IN ('pendiente','enviado','rechazado'))"),
  ])

  const user = session.user as { name: string; apellido?: string }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <header style={{ borderBottom: '1px solid #e2e8f0', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', gap: 24, background: '#ffffff' }}>
        {esAdmin && <Link href="/dashboard" style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', textDecoration: 'none' }}>← Dashboard</Link>}
        {!esAdmin && <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase' }}>Monitorista</div>}
        <div style={{ width: 1, height: 20, background: '#e2e8f0' }} />
        <div style={{ flexGrow: 1 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 600 }}>Seguridad Pública Municipal</span>
          <span style={{ fontFamily: 'Barlow Condensed', fontWeight: 800, fontSize: 22, letterSpacing: '0.05em', textTransform: 'uppercase', marginLeft: 12, color: '#0f172a' }}>Monitorista</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div><span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#94a3b8', display: 'block', letterSpacing: '0.1em' }}>OPERADOR</span><span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 600, color: '#1e40af' }}>{user.name}</span></div>
          <SignOutButton />
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>Centro de Monitoreo</span>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Monitorista</h1>
          <div style={{ width: 64, height: 3, background: '#2563eb', marginTop: 12 }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
          <Link href="/monitorista/solicitudes" style={{ textDecoration: 'none' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <Camera size={28} color="#2563eb" />
                <span style={onlineStyle}>ONLINE</span>
              </div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 26, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Solicitudes de Evidencia</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>Denuncias D1 · Incidentes</div>
              <div style={{ display: 'flex', gap: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Pendientes</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#b45309' }}>{d1Pend.length + solsPend.rows[0]?.c}</div></div>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Completadas</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#15803d' }}>{d1Comp.length + solsComp.rows[0]?.c}</div></div>
              </div>
              <div style={{ marginTop: 20, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 8 }}>ACCEDER →</div>
            </div>
          </Link>

          <Link href="/monitorista/detenidos" style={{ textDecoration: 'none' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <User size={28} color="#059669" />
                <span style={onlineStyle}>ONLINE</span>
              </div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 26, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Reporte de Detenidos</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>Solicitar evidencias a Fiscalía/Juzgado</div>
              <div style={{ display: 'flex', gap: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Enviados</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#b45309' }}>{detPend.rows[0]?.c ?? 0}</div></div>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Completados</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#15803d' }}>{detComp.rows[0]?.c ?? 0}</div></div>
              </div>
              <div style={{ marginTop: 20, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 8 }}>ACCEDER →</div>
            </div>
          </Link>

          <Link href="/monitorista/incidentes-camara" style={{ textDecoration: 'none' }}>
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <Video size={28} color="#7c3aed" />
                <span style={onlineStyle}>ONLINE</span>
              </div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 26, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Incidentes por Cámara</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>Registro de novedades por turno</div>
              <div style={{ display: 'flex', gap: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Personas</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#7c3aed' }}>—</div></div>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Vehículos</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#7c3aed' }}>—</div></div>
              </div>
              <div style={{ marginTop: 20, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 8 }}>ACCEDER →</div>
            </div>
          </Link>

          <Link href="/monitorista/historial" style={{ textDecoration: 'none' }}>
            <div style={cardStyle}>
              <div style={{ marginBottom: 20 }}><History size={28} color="#64748b" /></div>
              <div style={{ fontFamily: 'Barlow Condensed', fontSize: 26, fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', marginBottom: 8 }}>Historial</div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>Actividad registrada</div>
              <div style={{ paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
                <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Registros</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 24, fontWeight: 700, color: '#0f172a' }}>{histCount.rows[0]?.c ?? 0}</div></div>
              </div>
              <div style={{ marginTop: 20, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 8 }}>VER →</div>
            </div>
          </Link>
        </div>
      </main>

      <footer style={{ padding: '32px 48px', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
        SSPM · SAN JUAN DEL RÍO · QRO · SENTINEL v0.1
      </footer>
    </div>
  )
}

const cardStyle: React.CSSProperties = { background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, cursor: 'pointer', borderRadius: 2 }
const onlineStyle: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#059669', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 6 }
