'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, CheckCircle2, Clock, Eye, Upload } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { SubirEvidenciaModal } from './SubirEvidenciaModal'
import { Toast } from '@/components/ui/Toast'
import { SegmentPage } from '@/components/partials/SegmentPage'

export interface SolicitudRow {
  id: string
  origen: 'denuncia' | 'general'
  entidadId: string
  denunciaToken?: string
  token?: string
  solicitudId: number | null
  folio: string
  solicitadoNombre: string | null
  descripcion: string
  status: string
  creadoEn: string
  completadoEn: string | null
  totalEvidencias: number
}

export function BandejaSolicitudes({
  pendientes,
  completadas,
}: {
  pendientes: SolicitudRow[]
  completadas: SolicitudRow[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<'pendientes' | 'completadas'>('pendientes')
  const [modalAbierto, setModalAbierto] = useState<SolicitudRow | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const lista = tab === 'pendientes' ? pendientes : completadas

  return (
    <>
      <style>{`
        .mon-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
        .mon-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border: none; cursor: pointer; font-family: var(--apple-font-display); font-size: 13px; font-weight: 600; letter-spacing: normal; text-transform: none; border-radius: var(--radius-lg); transition: all .2s; }
        .mon-btn:active { transform: scale(0.97); }
        .mon-btn-primary { background: #0f172a; color: #fff; }
        .mon-btn-primary:hover { background: #1f355a; }
        .mon-btn-success { background: #16a34a; color: #fff; }
        .mon-btn-success:hover { background: #15803d; }
        .mon-btn-secondary { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
        .mon-btn-secondary:hover { border-color: #1f355a; color: #1f355a; }
        .mon-badge { font-family: var(--apple-font-display); font-size: 11px; font-weight: 600; letter-spacing: normal; text-transform: none; padding: 2px 10px; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 4px; }
      `}</style>
      <Toast show={!!toast} mensaje={toast ?? ''} onClose={() => setToast(null)} />

      <SegmentPage
        tabs={[
          { key: 'pendientes', label: 'Pendientes', icon: <Clock size={14} />, count: pendientes.length },
          { key: 'completadas', label: 'Completadas', icon: <CheckCircle2 size={14} />, count: completadas.length },
        ]}
        activeKey={tab}
        onChange={(k) => setTab(k as 'pendientes' | 'completadas')}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {lista.length === 0 && (
          <div className="mon-card" style={{ padding: 48, textAlign: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>
            Sin solicitudes {tab === 'pendientes' ? 'pendientes' : 'completadas'}
          </div>
        )}
        {lista.map((s) => (
          <div key={s.id} className="mon-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                  {s.origen === 'denuncia' && <span className="mon-badge" style={{ background: 'rgba(31,53,90,0.08)', color: '#1f355a' }}>D1</span>}
                  <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 15, fontWeight: 600, color: '#0f172a' }}>
                    {s.folio || s.entidadId.substring(0, 12)}
                  </span>
                  <span className="mon-badge" style={statusBadge(s.status)}>{statusLabel(s.status)}</span>
                  {s.totalEvidencias > 0 && (
                    <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                      <Camera size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {s.totalEvidencias} evidencia{s.totalEvidencias !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#475569', margin: '0 0 8px 0', lineHeight: 1.5 }}>{s.descripcion}</p>
                <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, color: '#94a3b8' }}>
                  {s.solicitadoNombre ? `Solicitado por: ${s.solicitadoNombre} · ` : ''}
                  {new Date(s.creadoEn).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap' }}>
                {tab === 'pendientes' && (
                  <>
                    <button className="mon-btn mon-btn-primary" onClick={() => setModalAbierto(s)}>
                      <Upload size={14} /> Subir
                    </button>
                    {s.origen === 'denuncia' && s.solicitudId && (
                      <button className="mon-btn mon-btn-success" onClick={async () => {
                        if (!window.confirm(`Completar Solicitud #${s.solicitudId}?\n\n${s.descripcion}\n\nSe marcará como atendida y se notificará a Fiscalía.`)) return
                        await fetch(`/api/monitorista/denuncias/${s.entidadId}/completar-solicitud`, {
                          method: 'POST', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ solicitudId: s.solicitudId }),
                        })
                        setToast('Solicitud completada')
                        router.refresh()
                      }}>
                        <CheckCircle2 size={14} /> Completar
                      </button>
                    )}
                  </>
                )}
                {s.origen === 'denuncia' ? (
                  <Link href={`/monitorista/denuncias/${s.denunciaToken ?? s.entidadId}`} className="mon-btn mon-btn-secondary">
                    <Eye size={14} /> Ver denuncia
                  </Link>
                ) : (
                  <Link href={`/monitorista/solicitudes/${s.token ?? s.id}`} className="mon-btn mon-btn-secondary">
                    <Eye size={14} /> Ver
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalAbierto && (
        <SubirEvidenciaModal
          solicitudId={modalAbierto.id}
          incidenteId={modalAbierto.entidadId}
          origen={modalAbierto.origen}
          denunciaSolicitudId={modalAbierto.solicitudId}
          onClose={() => setModalAbierto(null)}
          onExito={() => { setToast('Evidencia subida'); router.refresh() }}
        />
      )}
    </>
  )
}

function statusBadge(status: string): React.CSSProperties {
  const base: React.CSSProperties = { background: '#f1f5f9', color: '#64748b' }
  switch (status) {
    case 'pendiente': return { background: '#fef3c7', color: '#b45309' }
    case 'completada': return { background: '#dcfce7', color: '#16a34a' }
    case 'cancelada': return { background: '#fee2e2', color: '#dc2626' }
    default: return base
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'pendiente': return 'Pendiente'
    case 'completada': return 'Completada'
    case 'cancelada': return 'Cancelada'
    default: return status
  }
}
