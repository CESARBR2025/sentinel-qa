'use client'

import { useState } from 'react'
import { Camera, CheckCircle2, Clock, Eye, Upload, Shield } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { SubirEvidenciaModal } from './SubirEvidenciaModal'

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
  const [tab, setTab] = useState<'pendientes' | 'completadas'>('pendientes')
  const [modalAbierto, setModalAbierto] = useState<SolicitudRow | null>(null)

  const lista = tab === 'pendientes' ? pendientes : completadas

  return (
    <>
      <div style={{ display: 'flex', gap: 0, marginBottom: 0 }}>
        <button onClick={() => setTab('pendientes')} style={tabStyle(tab === 'pendientes')}>
          <Clock size={14} /> PENDIENTES ({pendientes.length})
        </button>
        <button onClick={() => setTab('completadas')} style={tabStyle(tab === 'completadas')}>
          <CheckCircle2 size={14} /> COMPLETADAS ({completadas.length})
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
        {lista.length === 0 && (
          <div style={{
            background: 'rgba(11,18,32,0.6)', border: '1px solid rgba(27,39,66,0.8)',
            padding: 48, textAlign: 'center', borderRadius: 2,
            fontFamily: 'JetBrains Mono', fontSize: 12, color: '#4a5878',
          }}>
            Sin solicitudes {tab === 'pendientes' ? 'pendientes' : 'completadas'}
          </div>
        )}
        {lista.map((s) => (
          <div key={s.id} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  {s.origen === 'denuncia' && <span style={origenBadge}>D1</span>}
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#d4a43a' }}>
                    {s.folio || s.entidadId.substring(0, 12)}
                  </span>
                  <span style={statusBadge(s.status)}>{s.status.toUpperCase()}</span>
                  {s.totalEvidencias > 0 && (
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#5c74a1' }}>
                      <Camera size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {s.totalEvidencias} evidencia{s.totalEvidencias !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: '#8f9fbf', margin: '0 0 8px 0', lineHeight: 1.5 }}>{s.descripcion}</p>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#4a5878' }}>
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
                        if (!window.confirm(`¿Estás seguro de completar la Solicitud #${s.solicitudId}?\n\n${s.descripcion}\n\nSe marcará como atendida y se notificará a Fiscalía.`)) return
                        await fetch(`/api/monitorista/denuncias/${s.entidadId}/completar-solicitud`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ solicitudId: s.solicitudId }),
                        })
                        window.location.reload()
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
          onClose={() => { setModalAbierto(null); window.location.reload() }}
        />
      )}
    </>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(11,18,32,0.6)', backdropFilter: 'blur(10px)',
  border: '1px solid rgba(27,39,66,0.8)', padding: 24, borderRadius: 2,
}
const tabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '12px 24px',
  background: active ? 'rgba(212,164,58,0.08)' : 'transparent',
  color: active ? '#d4a43a' : '#4a5878',
  border: active ? '1px solid rgba(212,164,58,0.3)' : '1px solid transparent',
  borderBottom: active ? '2px solid #d4a43a' : '2px solid transparent',
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, borderRadius: '2px 2px 0 0',
  transition: 'all 0.2s',
})
const btnPrimary: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '8px 16px',
  background: '#d4a43a', color: '#050810', border: 'none', borderRadius: 2,
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
}
const btnSuccess: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '8px 16px',
  background: '#4a9e6a', color: '#ffffff', border: 'none', borderRadius: 2,
  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
}
const btnDetalle: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '8px 16px',
  background: 'rgba(27,39,66,0.8)', color: '#5c74a1',
  border: '1px solid rgba(27,39,66,0.8)', borderRadius: 2,
  cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
}
const origenBadge: React.CSSProperties = {
  fontFamily: 'JetBrains Mono', fontSize: 8, fontWeight: 700, textTransform: 'uppercase',
  padding: '2px 6px', borderRadius: 2, letterSpacing: '0.1em',
  background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)',
}

function statusBadge(status: string): React.CSSProperties {
  const base: React.CSSProperties = { fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 2, letterSpacing: '0.1em' }
  switch (status) {
    case 'pendiente': return { ...base, background: 'rgba(212,164,58,0.15)', color: '#d4a43a' }
    case 'completada': return { ...base, background: 'rgba(74,158,106,0.15)', color: '#4a9e6a' }
    case 'cancelada': return { ...base, background: 'rgba(192,34,58,0.15)', color: '#c0223a' }
    default: return { ...base }
  }
}
