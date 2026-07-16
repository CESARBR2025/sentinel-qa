import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Clock, Shield, ChevronRight, FileText, CheckCircle2, AlertTriangle } from 'lucide-react'
import { verificarRolOficial, listarDespachosAsignados, listarDespachosAtendidos, contarDespachosAsignadosOficial, contarDespachosAtendidosOficial } from '@/lib/oficial/service'
import { DashboardHeader } from '@/components/partials/Header'
import { SegmentControl } from '@/components/oficial/SegmentControl'
import { ToastExito } from '@/components/oficial/ToastExito'
import React from 'react'

function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function ResolucionBadge({ estatus }: { estatus: string }) {
  const isDetencion = estatus === 'cerrado_detencion'
  return (
    <span
      style={{
        fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
        padding: '2px 8px', borderRadius: 2,
        background: isDetencion ? '#fef2f2' : '#f0fdfa',
        color: isDetencion ? '#991b1b' : '#0f766e',
        border: `1px solid ${isDetencion ? '#fecaca' : '#ccfbf1'}`,
      }}
    >
      {isDetencion ? 'C/DETENCIÓN' : 'ATENDIDO'}
    </span>
  )
}

function D1Badge({ d }: { d: any }) {
  if (d.d1Id) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', borderRadius: 2 }}>
        <CheckCircle2 size={11} /> D1: {d.d1Folio}
      </span>
    )
  }
  if (d.quiereDenuncia) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700, padding: '3px 10px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: 2 }}>
        <AlertTriangle size={11} /> DENUNCIA PENDIENTE
      </span>
    )
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'JetBrains Mono,monospace', fontSize: 10, padding: '3px 10px', background: '#eff1f3', color: '#1f355a', border: '1px solid #c3c8d2', borderRadius: 2 }}>
      <FileText size={11} /> SIN DENUNCIA
    </span>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4,
  padding: '20px 24px', textDecoration: 'none', color: 'inherit',
  display: 'flex', flexDirection: 'column', gap: 10,
}

export default async function MisDespachosPage({ searchParams }: { searchParams: Promise<{ tab?: string; exito?: string; folio?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const esOficial = await verificarRolOficial(session.user.id)
  if (!esOficial) redirect('/dashboard')

  const { tab = 'pendientes', exito, folio } = await searchParams
  const id = session.user.id

  const [despachosActivos, despachosAtendidos, countPendientes, countAtendidos] = await Promise.all([
    tab === 'pendientes' ? listarDespachosAsignados(id) : Promise.resolve([]),
    tab === 'atendidos' ? listarDespachosAtendidos(id) : Promise.resolve([]),
    contarDespachosAsignadosOficial(id),
    contarDespachosAtendidosOficial(id),
  ])

  const list = tab === 'atendidos' ? despachosAtendidos : despachosActivos

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <ToastExito show={exito === '1'} folio={folio} />
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600&display=swap');`}</style>

      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        backHref="/oficial"
        backLabel="Panel"
      />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 48px' }}>

        <div style={{ marginBottom: 24 }}>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.3em', color: '#1f355a', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>
            Oficial en Campo
          </span>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 32, textTransform: 'uppercase', margin: '4px 0 0 0', color: '#0f172a' }}>
            MIS <span style={{ color: '#1f355a' }}>DESPACHOS</span>
          </h1>
        </div>

        <div style={{ marginBottom: 24 }}>
          <SegmentControl
            tabs={[
              { id: 'pendientes', label: 'Pendientes', count: countPendientes },
              { id: 'atendidos', label: 'Atendidos', count: countAtendidos },
            ]}
            activeTab={tab}
          />
        </div>

        {list.length === 0 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, padding: '64px 32px', textAlign: 'center' }}>
            <Shield size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <div style={{ fontFamily: 'Barlow Condensed', fontSize: 22, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: 8 }}>
              {tab === 'atendidos' ? 'Sin despachos atendidos' : 'Sin asignaciones activas'}
            </div>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#94a3b8', letterSpacing: '0.1em', margin: 0 }}>
              {tab === 'atendidos' ? 'NO HAY DESPACHOS CERRADOS EN TU HISTORIAL' : 'NO TIENES SOLICITUDES DE DESPACHO PENDIENTES'}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tab === 'pendientes' && (despachosActivos as any[]).map(d => (
            <Link key={d.incidenteId} href={`/oficial/despachos/${d.incidenteId}`}
              style={{ ...cardStyle, flexDirection: 'row', alignItems: 'center', textDecoration: 'none' } as React.CSSProperties}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{d.folio}</span>
                  {d.estatus === 'en_sitio' && (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#f0fdfa', color: '#0f766e', border: '1px solid #ccfbf1', borderRadius: 2 }}>
                      EN SITIO
                    </span>
                  )}
                  {d.prioridad && (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', borderRadius: 2 }}>
                      {d.prioridad.toUpperCase()}
                    </span>
                  )}
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b' }}>{d.tipoIncidente || 'Sin clasificar'}</span>
                  {d.canal === 'radio' && (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2', borderRadius: 2 }}>
                      RONDÍN
                    </span>
                  )}
                </div>
                {(d.calle || d.colonia) && (
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={11} />{[d.calle, d.colonia].filter(Boolean).join(', ')}
                  </span>
                )}
                {d.descripcion && (
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{d.descripcion}</span>
                )}
                <div style={{ display: 'flex', gap: 16, fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> DESPACHADO: {formatDate(d.fechaHoraDespacho)}
                  </span>
                  {d.unidades.length > 0 && <span>UNIDADES: {d.unidades.join(' · ')}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: '#1f355a', flexShrink: 0 }}>
                ATENDER <ChevronRight size={14} />
              </div>
            </Link>
          ))}

          {tab === 'atendidos' && (despachosAtendidos as any[]).map(d => {
            const necesitaDenuncia = d.quiereDenuncia && !d.d1Id
            return (
              <div key={d.incidenteId} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{d.folio}</span>
                  <D1Badge d={d} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <ResolucionBadge estatus={d.estatus} />
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#64748b' }}>{d.tipoIncidente || 'Sin clasificar'}</span>
                  {d.canal === 'radio' && (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, padding: '2px 8px', background: '#eff1f3', color: '#1c3051', border: '1px solid #c3c8d2', borderRadius: 2 }}>
                      RONDÍN
                    </span>
                  )}
                </div>
                {(d.calle || d.colonia) && (
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={11} />{[d.calle, d.colonia].filter(Boolean).join(', ')}
                  </span>
                )}
                {d.acciones && (
                  <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#475569', lineHeight: 1.5 }}>{d.acciones}</span>
                )}
                <div style={{ display: 'flex', gap: 16, fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={10} /> CERRADO: {formatDate(d.fechaCierre)}
                  </span>
                  {d.folioReporteCampo && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FileText size={10} /> {d.folioReporteCampo}
                    </span>
                  )}
                  {d.unidades.length > 0 && <span>UNIDADES: {d.unidades.join(' · ')}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4, borderTop: '1px solid #f1f5f9' }}>
                  {necesitaDenuncia ? (
                    <Link href={`/denuncia/nuevo?reporteCampoId=${d.reporteCampoId}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: '#b45309', textDecoration: 'none', padding: '6px 12px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 2 }}>
                      COMPLETAR DENUNCIA <ChevronRight size={14} />
                    </Link>
                  ) : (
                    <Link href={`/oficial/reportes/${d.reporteCampoId}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700, color: '#1f355a', textDecoration: 'none', padding: '6px 12px' }}>
                      VER REPORTE <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
