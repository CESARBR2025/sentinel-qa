import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { Camera, ArrowLeft, MapPin, Clock, User, Shield, FileText, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { obtenerDenunciaPorId, obtenerEvidenciasDenuncia } from '@/lib/monitorista/denuncia-service'
import { BotonSubirDenuncia } from '@/components/monitorista/BotonSubirDenuncia'
import { db } from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

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
    <div style={{ minHeight: '100vh', background: '#050810', color: '#d8e0f0' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 64px' }}>
        <Link href="/monitorista" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, color: '#5c74a1',
          fontFamily: 'JetBrains Mono', fontSize: 11, textDecoration: 'none',
          marginBottom: 32, textTransform: 'uppercase', letterSpacing: '0.1em',
        }}><ArrowLeft size={14} /> Bandeja</Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(27,39,66,0.8)' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8b5cf6', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
              Denuncia D1 — Solicitud de Evidencias
            </div>
            <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: 36, fontWeight: 700, color: '#ffffff', margin: 0 }}>
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
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#4a5878', padding: 20, textAlign: 'center', border: '1px dashed rgba(27,39,66,0.5)', borderRadius: 2 }}>
                    No hay solicitudes de evidencia
                  </div>
                )}
                {denuncia.monitoristaFechasRequeridas.map((sol) => {
                  return (
                    <div key={sol.solicitud_id} style={{ background: 'rgba(11,18,32,0.4)', border: `1px solid ${sol.atendida ? 'rgba(74,158,106,0.3)' : 'rgba(212,164,58,0.3)'}`, padding: 24, borderRadius: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 600, color: sol.atendida ? '#4a9e6a' : '#d4a43a' }}>
                            Solicitud #{sol.solicitud_id}
                          </div>
                          <span style={{
                            fontFamily: 'JetBrains Mono', fontSize: 9, padding: '3px 10px', borderRadius: 2,
                            background: sol.atendida ? 'rgba(74,158,106,0.15)' : 'rgba(212,164,58,0.15)',
                            color: sol.atendida ? '#4a9e6a' : '#d4a43a',
                          }}>
                            {sol.atendida ? '✅ ATENDIDA' : '⏳ PENDIENTE'}
                          </span>
                          <span style={{
                            fontFamily: 'JetBrains Mono', fontSize: 9, padding: '3px 10px', borderRadius: 2,
                            background: 'rgba(27,39,66,0.5)', color: '#5c74a1',
                          }}>
                            {sol.hora_inicio} - {sol.hora_fin}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: 14, color: '#d8e0f0', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                        📍 {sol.calle} {sol.numero}, Col. {sol.colonia}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                          {!sol.atendida && (
                            <BotonSubirDenuncia denunciaId={denuncia.id} solicitudId={sol.solicitud_id} />
                          )}
                          {sol.atendida && (
                            <span style={{
                              fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600,
                              color: '#4a9e6a', letterSpacing: '0.1em',
                            }}>
                              ✅ COMPLETADA
                            </span>
                          )}
                        </div>
                        {(evidenciasPorSolicitud.get(sol.solicitud_id) ?? []).length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {(evidenciasPorSolicitud.get(sol.solicitud_id) ?? []).map((ev) => (
                              <a key={ev.id} href={`/api/monitorista/expediente-proxy?url=${encodeURIComponent(ev.urlArchivo)}`} target="_blank" rel="noreferrer" style={{
                                fontFamily: 'JetBrains Mono', fontSize: 10, color: '#d4a43a',
                                textDecoration: 'none', padding: '6px 12px',
                                border: '1px solid rgba(212,164,58,0.3)', borderRadius: 2,
                                display: 'flex', alignItems: 'center', gap: 4,
                                background: 'rgba(212,164,58,0.05)',
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
                    const evs = evidenciasPorSolicitud.get(sol.solicitud_id) ?? []
                    if (evs.length === 0) return null
                    return (
                      <div key={sol.solicitud_id}>
                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#d4a43a', marginBottom: 8, letterSpacing: '0.05em' }}>
                          Solicitud #{sol.solicitud_id} — {evs.length} archivo{evs.length > 1 ? 's' : ''}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {evs.map((ev) => (
                            <a key={ev.id} href={`/api/monitorista/expediente-proxy?url=${encodeURIComponent(ev.urlArchivo)}`} target="_blank" rel="noreferrer" style={{
                              fontFamily: 'JetBrains Mono', fontSize: 10, color: '#d4a43a',
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
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5878', textTransform: 'uppercase', marginBottom: 4 }}>Trámite</div>
                  <span style={estadoBadge(denuncia.estadoTramite)}>{denuncia.estadoTramite.replace('_', ' ')}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5878', textTransform: 'uppercase', marginBottom: 4 }}>Evidencia</div>
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
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#4a5878', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: 'Inter', fontSize: 13, color: '#d8e0f0' }}>{value}</div>
    </div>
  )
}

const card: React.CSSProperties = {
  background: 'rgba(11,18,32,0.6)', backdropFilter: 'blur(10px)',
  border: '1px solid rgba(27,39,66,0.8)', padding: 32, borderRadius: 2,
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'Barlow Condensed', fontSize: 16, fontWeight: 700,
  textTransform: 'uppercase', color: '#ffffff', marginBottom: 20,
  display: 'flex', alignItems: 'center', gap: 10, letterSpacing: '0.05em',
}

function statusBadge(estado: string): React.CSSProperties {
  const base: React.CSSProperties = { padding: '6px 14px', borderRadius: 2, fontSize: 11, fontWeight: 700, fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.05em', border: '1px solid' }
  if (estado.includes('PENDIENTE')) return { ...base, background: 'rgba(212,164,58,0.1)', color: '#d4a43a', borderColor: 'rgba(212,164,58,0.3)' }
  if (estado.includes('ENVIADA')) return { ...base, background: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderColor: 'rgba(59,130,246,0.3)' }
  if (estado === 'FINALIZADO') return { ...base, background: 'rgba(74,158,106,0.1)', color: '#4a9e6a', borderColor: 'rgba(74,158,106,0.3)' }
  return { ...base }
}

function estadoBadge(valor: string): React.CSSProperties {
  const base: React.CSSProperties = { padding: '4px 10px', borderRadius: 2, fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block' }
  if (valor === 'RECIBIDA') return { ...base, background: 'rgba(212,164,58,0.1)', color: '#d4a43a' }
  if (valor === 'EN_ANALISIS') return { ...base, background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }
  if (valor === 'CERRADA') return { ...base, background: 'rgba(74,158,106,0.1)', color: '#4a9e6a' }
  return { ...base }
}
