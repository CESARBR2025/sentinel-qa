import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { Camera, MapPin, Clock, User, Shield, FileText, ExternalLink } from 'lucide-react'
import React from 'react'
import { obtenerDenunciaPorId, obtenerEvidenciasDenuncia } from '@/lib/monitorista/denuncia-service'
import { BotonSubirDenuncia } from '@/components/monitorista/BotonSubirDenuncia'
import { DashboardHeader } from '@/components/partials/Header'

export default async function DetalleDenunciaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const [denuncia, evidencias] = await Promise.all([
    obtenerDenunciaPorId(id),
    obtenerEvidenciasDenuncia(id),
  ])

  if (!denuncia) notFound()

  const evidenciasPorSolicitud = new Map<number, typeof evidencias>()
  for (const ev of evidencias) {
    const arr = evidenciasPorSolicitud.get(ev.solicitudId) ?? []
    arr.push(ev)
    evidenciasPorSolicitud.set(ev.solicitudId, arr)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        backHref="/monitorista/solicitudes"
        backLabel="Bandeja"
      />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, paddingBottom: 24, borderBottom: '2px solid #e2e8f0' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#1f355a', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>
              Denuncia D1 — Solicitud de Evidencias
            </div>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {denuncia.folioDenuncia}
            </h1>
          </div>
          <span style={statusBadge(denuncia.estadoEvidencia)}>{denuncia.estadoEvidencia.replace('_', ' ')}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <section style={card}>
                <h2 style={sectionTitle}><FileText size={18} /> DATOS DE LA DENUNCIA</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <Campo label="Delito" value={denuncia.delito} />
                  <Campo label="IPH" value={denuncia.iph} />
                  <Campo label="Tipo de Evento" value={
                    denuncia.tipoEvento === '1' ? 'D1' :
                    denuncia.tipoEvento === '2' ? 'Flagrancia' :
                    denuncia.tipoEvento === '3' ? 'Detenido c/elementos' :
                    denuncia.tipoEvento
                  } />
                  <Campo label="Policía a Cargo" value={denuncia.policiaACargo} />
                </div>
              </section>

              <section style={card}>
                <h2 style={sectionTitle}><MapPin size={18} /> UBICACIÓN DEL HECHO</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <Campo label="Lugar" value={denuncia.lugarHecho} />
                  <Campo label="Colonia" value={denuncia.coloniaHecho} />
                  <Campo label="Reporte" value={denuncia.fechaReporte ? `${denuncia.fechaReporte} ${denuncia.horaReporte ?? ''}` : null} />
                  <Campo label="Recibida" value={new Date(denuncia.createdAt).toLocaleString('es-MX')} />
                </div>
              </section>
            </div>

            <section style={card}>
              <h2 style={sectionTitle}><Camera size={18} /> SOLICITUDES DE EVIDENCIA</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {denuncia.monitoristaFechasRequeridas.length === 0 && (
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#94a3b8', padding: 20, textAlign: 'center', border: '1px dashed #e2e8f0', borderRadius: 2 }}>
                    No hay solicitudes de evidencia
                  </div>
                )}
                {denuncia.monitoristaFechasRequeridas.map((sol) => {
                  return (
                    <div key={sol.solicitudId} style={{ background: '#f8fafc', border: `1px solid ${sol.atendida ? '#bbf7d0' : '#fde68a'}`, padding: 24, borderRadius: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 600, color: sol.atendida ? '#15803d' : '#b45309' }}>
                            Solicitud #{sol.solicitudId}
                          </div>
                          <span style={{
                            fontFamily: 'JetBrains Mono', fontSize: 9, padding: '3px 10px', borderRadius: 2,
                            background: sol.atendida ? '#f0fdf4' : '#fffbeb',
                            color: sol.atendida ? '#15803d' : '#b45309',
                          }}>
                            {sol.atendida ? '✅ ATENDIDA' : '⏳ PENDIENTE'}
                          </span>
                          <span style={{
                            fontFamily: 'JetBrains Mono', fontSize: 9, padding: '3px 10px', borderRadius: 2,
                            background: '#f1f5f9', color: '#475569',
                          }}>
                            {sol.horaInicio} - {sol.horaFin}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: 14, color: '#1e293b', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                        📍 {sol.calle} {sol.numero}, Col. {sol.colonia}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                          {!sol.atendida && (
                            <BotonSubirDenuncia denunciaId={denuncia.id} solicitudId={sol.solicitudId} />
                          )}
                          {sol.atendida && (
                            <span style={{
                              fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600,
                              color: '#15803d', letterSpacing: '0.1em',
                            }}>
                              ✅ COMPLETADA
                            </span>
                          )}
                        </div>
                        {(evidenciasPorSolicitud.get(sol.solicitudId) ?? []).length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {(evidenciasPorSolicitud.get(sol.solicitudId) ?? []).map((ev) => (
                              <a key={ev.id} href={`/api/monitorista/expediente-proxy?url=${encodeURIComponent(ev.urlArchivo)}`} target="_blank" rel="noreferrer" style={{
fontFamily: 'JetBrains Mono', fontSize: 10, color: '#1f355a',
                      textDecoration: 'none', padding: '6px 12px',
                      border: '1px solid #c3c8d2', borderRadius: 2,
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: '#eff1f3',
                              }}>
                                <ExternalLink size={10} /> {ev.nombreArchivo || `Evidencia #${ev.id}`}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {evidencias.length > 0 && (
              <section style={card}>
                <h2 style={sectionTitle}><Camera size={18} /> EVIDENCIAS SUBIDAS ({evidencias.length})</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {denuncia.monitoristaFechasRequeridas.map((sol) => {
                    const evs = evidenciasPorSolicitud.get(sol.solicitudId) ?? []
                    if (evs.length === 0) return null
                    return (
                      <div key={sol.solicitudId}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#1f355a', marginBottom: 8, letterSpacing: '0.05em' }}>
                          Solicitud #{sol.solicitudId} — {evs.length} archivo{evs.length > 1 ? 's' : ''}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {evs.map((ev) => (
                            <a key={ev.id} href={`/api/monitorista/expediente-proxy?url=${encodeURIComponent(ev.urlArchivo)}`} target="_blank" rel="noreferrer" style={{
                              fontFamily: 'JetBrains Mono', fontSize: 10, color: '#1f355a',
                              textDecoration: 'none', padding: '6px 12px',
                              border: '1px solid rgba(212,164,58,0.3)', borderRadius: 2,
                              display: 'flex', alignItems: 'center', gap: 4,
                              background: 'rgba(212,164,58,0.05)',
                            }}>
                              <ExternalLink size={10} /> {ev.nombreArchivo || `Evidencia #${ev.id}`}
                            </a>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            <div style={card}>
              <h2 style={sectionTitle}><Clock size={18} /> FECHAS</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Campo label="Reporte" value={denuncia.fechaReporte ? `${denuncia.fechaReporte} ${denuncia.horaReporte ?? ''}` : null} />
                <Campo label="Recibida en sistema" value={new Date(denuncia.createdAt).toLocaleString('es-MX')} />
              </div>
            </div>
            <div style={card}>
              <h2 style={sectionTitle}><User size={18} /> POLICÍA</h2>
              <Campo label="A cargo" value={denuncia.policiaACargo} />
            </div>
            <div style={card}>
              <h2 style={sectionTitle}><Shield size={18} /> ESTADOS</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Trámite</div>
                  <span style={estadoBadge(denuncia.estadoTramite)}>{denuncia.estadoTramite.replace('_', ' ')}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Evidencia</div>
                  <span style={estadoBadge(denuncia.estadoEvidencia)}>{denuncia.estadoEvidencia.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function Campo({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#1e293b' }}>{value}</div>
    </div>
  )
}

const card: React.CSSProperties = {
  background: '#ffffff', border: '1px solid #e2e8f0', padding: 32, borderRadius: 2,
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: 700,
  textTransform: 'uppercase', color: '#0f172a', marginBottom: 20,
  display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em',
}

function statusBadge(estado: string): React.CSSProperties {
  const base: React.CSSProperties = { padding: '6px 14px', borderRadius: 2, fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid' }
  if (estado.includes('PENDIENTE')) return { ...base, background: '#fffbeb', color: '#b45309', borderColor: '#fef3c7' }
  if (estado.includes('ENVIADA')) return { ...base, background: '#eff1f3', color: '#1c3051', borderColor: '#dbdfe5' }
  if (estado === 'FINALIZADO') return { ...base, background: '#f0fdf4', color: '#15803d', borderColor: '#dcfce7' }
  return { ...base }
}

function estadoBadge(valor: string): React.CSSProperties {
  const base: React.CSSProperties = { padding: '4px 10px', borderRadius: 2, fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block' }
  if (valor === 'RECIBIDA') return { ...base, background: '#fffbeb', color: '#b45309' }
  if (valor === 'EN_ANALISIS') return { ...base, background: '#eff1f3', color: '#1c3051' }
  if (valor === 'CERRADA') return { ...base, background: '#f0fdf4', color: '#15803d' }
  return { ...base }
}
