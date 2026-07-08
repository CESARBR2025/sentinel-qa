import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { listarReportesConDetenidos } from '@/lib/monitorista/detenido-service'
import Link from 'next/link'
import React from 'react'
import { BotonGenerarPpt } from '@/components/monitorista/BotonGenerarPpt'
import { Clock, CheckCircle2, Eye, Camera } from 'lucide-react'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { SubHeader } from '@/components/partials/SubHeader'

export default async function DetenidosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'detenidos', 'ver'))) redirect('/monitorista')

  const reportes = await listarReportesConDetenidos()
  const user = session.user as { name: string }
  const pendientes = reportes.filter(r => r.fotos.some(f => f.estado === 'pendiente' || f.estado === 'enviado' || f.estado === 'rechazado'))
  const completadas = reportes.filter(r => r.fotos.length > 0 && r.fotos.every(f => f.estado === 'completado'))
  const sinFotos = reportes.filter(r => r.fotos.length === 0)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <SubHeader backHref="/monitorista" backLabel="Monitorista" title="Reporte de" accent="Detenidos" accentColor="#059669" user={user} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em', color: '#2563eb', textTransform: 'uppercase', fontWeight: 700 }}>Reportes de Campo con Detenidos</span>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0', textTransform: 'uppercase' }}>Detenidos</h1>
            <div style={{ width: 64, height: 3, background: '#2563eb', marginTop: 12 }} />
          </div>
          <BotonGenerarPpt pendientes={pendientes.length} completados={completadas.length} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 40 }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Clock size={20} color="#b45309" />
              <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pendientes / Enviados</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 700, color: '#0f172a' }}>{pendientes.length}</div></div>
            </div>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <CheckCircle2 size={20} color="#059669" />
              <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Completados</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 700, color: '#0f172a' }}>{completadas.length}</div></div>
            </div>
          </div>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Camera size={20} color="#64748b" />
              <div><div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase' }}>Sin solicitar fotos</div><div style={{ fontFamily: 'Barlow Condensed', fontSize: 32, fontWeight: 700, color: '#0f172a' }}>{sinFotos.length}</div></div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reportes.length === 0 && (
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 48, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#94a3b8' }}>
              No hay reportes de campo con detenidos
            </div>
          )}
          {reportes.map((r) => (
            <div key={r.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 20, borderRadius: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 700, color: '#1e40af' }}>{r.nombre_detenido}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', padding: '2px 8px', background: '#f1f5f9', borderRadius: 2 }}>
                      Folio: {r.folio_detenido || r.id.substring(0, 12)}
                    </span>
                    <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#059669', fontWeight: 500 }}>{r.tipo_incidente || 'S/C'}</span>
                  </div>

                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 12 }}>
                    {r.delito_denuncia && <div><strong>Delitos:</strong> {r.delito_denuncia}</div>}
                    <div><strong>Modus Operandi:</strong> {r.modus_operandi || '—'}</div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {r.fotos.map(f => (
                      <span key={f.id} style={fotoBadge(f.estado)}>
                        {f.tipo_foto === 'frontal' ? 'Frontal' : f.tipo_foto === 'derecho' ? 'Derecho' : 'Izquierdo'}: {f.estado.toUpperCase()}
                      </span>
                    ))}
                    {r.fotos.length === 0 && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#94a3b8' }}>Sin solicitar fotos</span>}
                  </div>

                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#cbd5e1', marginTop: 8 }}>
                    {r.oficial_nombre && `${r.oficial_nombre} · `}
                    {new Date(r.created_at).toLocaleString('es-MX', { day: '2-digit', month: '2-digit' })}
                  </div>
                </div>
                <Link href={`/monitorista/detenidos/${r.id}`} style={btnDetalle}>
                  <Eye size={14} /> VER
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={{ padding: '32px 48px', fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
        SSPM · SAN JUAN DEL RÍO · QRO · SENTINEL v0.1
      </footer>
    </div>
  )
}

const btnDetalle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '8px 16px', background: '#f1f5f9', color: '#475569',
  border: '1px solid #e2e8f0', borderRadius: 2, cursor: 'pointer', textDecoration: 'none',
  display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
}

function fotoBadge(estado: string): React.CSSProperties {
  const base: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 8, fontWeight: 600, padding: '3px 8px', borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 2 }
  if (estado === 'pendiente') return { ...base, background: '#fffbeb', color: '#b45309', border: '1px solid #fef3c7' }
  if (estado === 'enviado') return { ...base, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe' }
  if (estado === 'rechazado') return { ...base, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
  if (estado === 'completado') return { ...base, background: '#f0fdf4', color: '#15803d', border: '1px solid #dcfce7' }
  return { ...base }
}
