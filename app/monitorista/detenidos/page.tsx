import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { listarReportesConDetenidos } from '@/lib/monitorista/detenido-service'
import { obtenerOCrearToken } from '@/lib/recursos/token-recurso'
import Link from 'next/link'
import React from 'react'
import { Clock, CheckCircle2, Eye, Camera } from 'lucide-react'
import { tienePermiso } from '@/lib/monitorista/permisos'
import { DashboardHeader } from '@/components/partials/Header'
import { DashboardFooter } from '@/components/partials/Footer'
import { PageHeader, PageHeaderLink } from '@/components/partials/PageHeader'

export default async function DetenidosPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  if (!(await tienePermiso(session.user.id, 'detenidos', 'ver'))) redirect('/monitorista')

  const reportes = await listarReportesConDetenidos()
  // Token opaco persistente por reporte para la URL de detalle — el id interno nunca viaja en la URL.
  const tokens = new Map<string, string>()
  for (const r of reportes) {
    tokens.set(r.id, await obtenerOCrearToken('detenido', r.id))
  }
  const pendientes = reportes.filter(r => r.fotos.some(f => f.estado === 'pendiente' || f.estado === 'enviado' || f.estado === 'rechazado'))
  const completadas = reportes.filter(r => r.fotos.length > 0 && r.fotos.every(f => f.estado === 'completado'))
  const sinFotos = reportes.filter(r => r.fotos.length === 0)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        roleLabel="Monitorista"
      />

      <main className="pad-pagina" style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <PageHeader
          title="Reporte de"
          accent="Detenidos"
          accentColor="#059669"
          subtitle="Reportes de campo con detenidos · solicitud y envío de fotos"
          actions={<PageHeaderLink href="/monitorista" variant="secondary">← Panel</PageHeaderLink>}
        />

        <div className="grid-3">
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
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 700, color: '#172844' }}>{r.nombreDetenido}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748b', padding: '2px 8px', background: '#f1f5f9', borderRadius: 2 }}>
                      Folio: {r.folioDetenido || r.id.substring(0, 12)}
                    </span>
                    <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#059669', fontWeight: 500 }}>{r.tipoIncidente || 'S/C'}</span>
                  </div>

                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: '#475569', lineHeight: 1.6, marginBottom: 12 }}>
                    {r.delitoDenuncia && <div><strong>Delitos:</strong> {r.delitoDenuncia}</div>}
                    <div><strong>Modus Operandi:</strong> {r.modusOperandi || '—'}</div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {r.fotos.map(f => (
                      <span key={f.id} style={fotoBadge(f.estado)}>
                        {f.tipoFoto === 'frontal' ? 'Frontal' : f.tipoFoto === 'derecho' ? 'Derecho' : 'Izquierdo'}: {f.estado.toUpperCase()}
                      </span>
                    ))}
                    {r.fotos.length === 0 && <span style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#94a3b8' }}>Sin solicitar fotos</span>}
                  </div>

                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#cbd5e1', marginTop: 8 }}>
                    {r.oficialNombre && `${r.oficialNombre} · `}
                    {new Date(r.createdAt).toLocaleString('es-MX', { day: '2-digit', month: '2-digit' })}
                  </div>
                </div>
                <Link href={`/monitorista/detenidos/${tokens.get(r.id) ?? r.id}`} style={btnDetalle}>
                  <Eye size={14} /> VER
                </Link>
              </div>
            </div>
          ))}
        </div>

        <DashboardFooter />
      </main>
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
  if (estado === 'enviado') return { ...base, background: '#eff1f3', color: '#1c3051', border: '1px solid #dbdfe5' }
  if (estado === 'rechazado') return { ...base, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
  if (estado === 'completado') return { ...base, background: '#f0fdf4', color: '#15803d', border: '1px solid #dcfce7' }
  return { ...base }
}
