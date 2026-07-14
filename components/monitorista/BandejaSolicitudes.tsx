'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, CheckCircle2, Clock, Eye, Upload } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { SubirEvidenciaModal } from './SubirEvidenciaModal'
import { Toast } from '@/components/ui/Toast'

interface SolicitudRow {
  id: string
  origen: 'denuncia' | 'general'
  entidadId: string
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
      <Toast show={!!toast} mensaje={toast ?? ''} onClose={() => setToast(null)} />
      <div style={{ display: 'flex', gap: 0, marginBottom: 0, borderBottom: '2px solid #e2e8f0' }}>
        <button onClick={() => setTab('pendientes')} style={tabStyle(tab === 'pendientes')}>
          <Clock size={14} /> PENDIENTES ({pendientes.length})
        </button>
        <button onClick={() => setTab('completadas')} style={tabStyle(tab === 'completadas')}>
          <CheckCircle2 size={14} /> COMPLETADAS ({completadas.length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
        {lista.length === 0 && (
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 48, textAlign: 'center', fontFamily: 'JetBrains Mono', fontSize: 12, color: '#94a3b8' }}>
            Sin solicitudes {tab === 'pendientes' ? 'pendientes' : 'completadas'}
          </div>
        )}
        {lista.map((s) => (
          <div key={s.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  {s.origen === 'denuncia' && <span style={origenBadge}>D1</span>}
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#172844' }}>
                    {s.folio || s.entidadId.substring(0, 12)}
                  </span>
                  <span style={statusBadge(s.status)}>{s.status.toUpperCase()}</span>
                  {s.totalEvidencias > 0 && (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b' }}>
                      <Camera size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {s.totalEvidencias} evidencia{s.totalEvidencias !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#475569', margin: '0 0 8px 0', lineHeight: 1.5 }}>{s.descripcion}</p>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#94a3b8' }}>
                  {s.solicitadoNombre ? `Solicitado por: ${s.solicitadoNombre} · ` : ''}
                  {new Date(s.creadoEn).toLocaleString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {tab === 'pendientes' && (
                  <>
                    <button onClick={() => setModalAbierto(s)} style={btnPrimary}>
                      <Upload size={14} /> SUBIR
                    </button>
                    {s.origen === 'denuncia' && s.solicitudId && (
                      <button onClick={async () => {
                        if (!window.confirm(`Completar Solicitud #${s.solicitudId}?\n\n${s.descripcion}\n\nSe marcará como atendida y se notificará a Fiscalía.`)) return
                        await fetch(`/api/monitorista/denuncias/${s.entidadId}/completar-solicitud`, {
                          method: 'POST', headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ solicitudId: s.solicitudId }),
                        })
                        setToast('Solicitud completada')
                        router.refresh()
                      }} style={btnSuccess}>
                        <CheckCircle2 size={14} /> COMPLETAR
                      </button>
                    )}
                  </>
                )}
                {s.origen === 'denuncia' ? (
                  <Link href={`/monitorista/denuncias/${s.entidadId}`} style={btnDetalle}>
                    <Eye size={14} /> VER DENUNCIA
                  </Link>
                ) : (
                  <Link href={`/monitorista/solicitudes/${s.id}`} style={btnDetalle}>
                    <Eye size={14} /> VER
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

const tabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em',
  textTransform: 'uppercase', padding: '12px 24px',
  background: active ? '#ffffff' : '#f8fafc',
  color: active ? '#0f172a' : '#64748b',
  border: active ? '1px solid #e2e8f0' : '1px solid transparent',
  borderBottom: active ? '2px solid #3e5171' : '2px solid transparent',
  marginBottom: -2,
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
  borderRadius: '4px 4px 0 0',
  transition: 'all 0.2s',
})
const btnPrimary: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '8px 16px',
  background: '#0f172a', color: '#ffffff', border: 'none', borderRadius: 2,
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
}
const btnSuccess: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '8px 16px',
  background: '#059669', color: '#ffffff', border: 'none', borderRadius: 2,
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
}
const btnDetalle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '8px 16px',
  background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 2,
  cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
}
const origenBadge: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 8, fontWeight: 700, textTransform: 'uppercase',
  padding: '2px 6px', borderRadius: 2, letterSpacing: '0.1em',
  background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe',
}

function statusBadge(status: string): React.CSSProperties {
  const base: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 2, letterSpacing: '0.1em' }
  switch (status) {
    case 'pendiente': return { ...base, background: '#fffbeb', color: '#b45309', border: '1px solid #fef3c7' }
    case 'completada': return { ...base, background: '#f0fdf4', color: '#15803d', border: '1px solid #dcfce7' }
    case 'cancelada': return { ...base, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
    default: return { ...base }
  }
}
