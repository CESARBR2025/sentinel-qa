import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Clock, Shield, ChevronRight, FileText, CheckCircle2, AlertTriangle } from 'lucide-react'
import { verificarRolOficial, listarDespachosAsignados, listarDespachosAtendidos, contarDespachosAsignadosOficial, contarDespachosAtendidosOficial } from '@/lib/oficial/service'
import type { DespachoAsignado, DespachoAtendido } from '@/lib/oficial/types'
import { DashboardHeader } from '@/components/partials/Header'
import { PageHeader } from '@/components/partials/PageHeader'
import { labelEstatus } from '@/lib/911/estatus-c4'
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
        fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600,
        padding: '2px 10px', borderRadius: 'var(--radius-full)',
        background: isDetencion ? '#fee2e2' : '#dcfce7',
        color: isDetencion ? '#dc2626' : '#16a34a',
      }}
    >
      {isDetencion ? labelEstatus('cerrado_detencion') : labelEstatus('atendido')}
    </span>
  )
}

function D1Badge({ d }: { d: DespachoAtendido }) {
  if (d.d1Id) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, padding: '3px 10px', background: '#dcfce7', color: '#16a34a', borderRadius: 'var(--radius-full)' }}>
        <CheckCircle2 size={11} /> D1: {d.d1Folio}
      </span>
    )
  }
  if (d.quiereDenuncia) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, padding: '3px 10px', background: '#fef3c7', color: '#b45309', borderRadius: 'var(--radius-full)' }}>
        <AlertTriangle size={11} /> Denuncia pendiente
      </span>
    )
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 500, padding: '3px 10px', background: '#f1f5f9', color: '#64748b', borderRadius: 'var(--radius-full)' }}>
      <FileText size={11} /> Sin denuncia
    </span>
  )
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-card)',
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
    tab === 'pendientes' ? listarDespachosAsignados(id) : Promise.resolve([] as DespachoAsignado[]),
    tab === 'atendidos' ? listarDespachosAtendidos(id) : Promise.resolve([] as DespachoAtendido[]),
    contarDespachosAsignadosOficial(id),
    contarDespachosAtendidosOficial(id),
  ])

  const list = tab === 'atendidos' ? despachosAtendidos : despachosActivos

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      <ToastExito show={exito === '1'} folio={folio} />

      <DashboardHeader
        user={session.user as { name: string; apellido?: string; email: string }}
        variant="apple"
        backHref="/oficial"
        backLabel="Panel"
      />

      <main className="pad-pagina" style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column' }}>

        <PageHeader
          title="Despachos"
          accent="y Reportes"
          subtitle="Asignaciones activas y atendidas"
        />

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
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '64px 24px', textAlign: 'center' }}>
            <Shield size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 20, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>
              {tab === 'atendidos' ? 'Sin despachos atendidos' : 'Sin asignaciones activas'}
            </div>
            <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8', margin: 0 }}>
              {tab === 'atendidos' ? 'No hay despachos cerrados en tu historial' : 'No tienes solicitudes de despacho pendientes'}
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tab === 'pendientes' && despachosActivos.map(d => (
            <Link key={d.incidenteId} href={`/oficial/despachos/${d.incidenteId}`}
              style={{ ...cardStyle, flexDirection: 'row', alignItems: 'center', textDecoration: 'none' } as React.CSSProperties}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{d.folio}</span>
                  {d.estatus === 'en_sitio' && (
                    <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, padding: '2px 10px', background: '#dcfce7', color: '#16a34a', borderRadius: 'var(--radius-full)' }}>
                      {labelEstatus('en_sitio')}
                    </span>
                  )}
                  {d.prioridad && (
                    <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, padding: '2px 10px', background: '#fef3c7', color: '#b45309', borderRadius: 'var(--radius-full)' }}>
                      {d.prioridad}
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>{d.tipoIncidente || 'Sin clasificar'}</span>
                  {d.canal === 'radio' && (
                    <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, padding: '2px 10px', background: '#f1f5f9', color: '#64748b', borderRadius: 'var(--radius-full)' }}>
                      Rondín
                    </span>
                  )}
                </div>
                {(d.calle || d.colonia) && (
                  <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={11} />{[d.calle, d.colonia].filter(Boolean).join(', ')}
                  </span>
                )}
                {d.descripcion && (
                  <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{d.descripcion}</span>
                )}
                <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> Despachado: {formatDate(d.fechaHoraDespacho)}
                  </span>
                  {d.unidades.length > 0 && <span>Unidades: {d.unidades.join(' · ')}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, color: '#1f355a', flexShrink: 0 }}>
                Atender <ChevronRight size={14} />
              </div>
            </Link>
          ))}

          {tab === 'atendidos' && despachosAtendidos.map(d => {
            const necesitaDenuncia = d.quiereDenuncia && !d.d1Id
            return (
              <div key={d.incidenteId} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 14, fontWeight: 600, color: '#0f172a' }}>{d.folio}</span>
                  <D1Badge d={d} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <ResolucionBadge estatus={d.estatus} />
                  <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#64748b' }}>{d.tipoIncidente || 'Sin clasificar'}</span>
                  {d.canal === 'radio' && (
                    <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, fontWeight: 600, padding: '2px 10px', background: '#f1f5f9', color: '#64748b', borderRadius: 'var(--radius-full)' }}>
                      Rondín
                    </span>
                  )}
                </div>
                {(d.calle || d.colonia) && (
                  <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={11} />{[d.calle, d.colonia].filter(Boolean).join(', ')}
                  </span>
                )}
                {d.acciones && (
                  <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#475569', lineHeight: 1.5 }}>{d.acciones}</span>
                )}
                <div style={{ display: 'flex', gap: 16, fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#94a3b8' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> Cerrado: {formatDate(d.fechaCierre)}
                  </span>
                  {d.folioReporteCampo && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FileText size={11} /> {d.folioReporteCampo}
                    </span>
                  )}
                  {d.unidades.length > 0 && <span>Unidades: {d.unidades.join(' · ')}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}>
                  {necesitaDenuncia ? (
                    <Link href={`/denuncia/nuevo?reporteCampoId=${d.reporteCampoId}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, color: '#b45309', textDecoration: 'none', padding: '8px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-lg)' }}>
                      Completar denuncia <ChevronRight size={14} />
                    </Link>
                  ) : (
                    <Link href={`/oficial/reportes/${d.reporteCampoId}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--apple-font-display)', fontSize: 13, fontWeight: 600, color: '#1f355a', textDecoration: 'none', padding: '8px 14px' }}>
                      Ver reporte <ChevronRight size={14} />
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
