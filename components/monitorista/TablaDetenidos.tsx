'use client'

import { useState } from 'react'
import { Clock, CheckCircle2, Eye, User, Camera, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface FotoInfo {
  tipo_foto: string
  estado: string
  enviado_a: string | null
}

interface DetenidoRow {
  id: string
  nombre_detenido: string
  folio: string
  tipo_evento: string | null
  delitos: string | null
  falta_admin: string | null
  creado_en: string
  fotos: FotoInfo[]
}

export function TablaDetenidos({
  pendientes,
  completadas,
}: {
  pendientes: DetenidoRow[]
  completadas: DetenidoRow[]
}) {
  const [tab, setTab] = useState<'pendientes' | 'completadas'>('pendientes')
  const lista = tab === 'pendientes' ? pendientes : completadas

  return (
    <>
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
        {lista.map((s) => {
          const totalFotos = s.fotos.length
          const enviadas = s.fotos.filter(f => f.estado === 'enviado').length
          const completadas = s.fotos.filter(f => f.estado === 'completado').length
          const rechazadas = s.fotos.filter(f => f.estado === 'rechazado').length

          return (
            <div key={s.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: 24, borderRadius: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                    <User size={16} color="#64748b" />
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 700, color: '#1e40af' }}>{s.nombre_detenido}</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b' }}>Folio: {s.folio}</span>
                  </div>

                  <div style={{ display: 'flex', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                    {s.fotos.map((f) => (
                      <span key={f.tipo_foto} style={fotoBadge(f.estado)}>
                        <Camera size={10} style={{ marginRight: 4 }} />
                        {f.tipo_foto === 'frontal' ? 'Frontal' : f.tipo_foto === 'derecho' ? 'Derecho' : 'Izquierdo'}: {f.estado.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>
                    {[s.tipo_evento, s.delitos, s.falta_admin].filter(Boolean).join(' · ') || 'Sin datos'}
                  </p>
                </div>
                <Link href={`/monitorista/detenidos/${s.id}`} style={btnDetalle}>
                  <Eye size={14} /> VER
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

const tabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 600, letterSpacing: '0.15em',
  textTransform: 'uppercase', padding: '12px 24px',
  background: active ? '#ffffff' : '#f8fafc',
  color: active ? '#0f172a' : '#64748b',
  border: active ? '1px solid #e2e8f0' : '1px solid transparent',
  borderBottom: active ? '2px solid #059669' : '2px solid transparent',
  marginBottom: -2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
  borderRadius: '4px 4px 0 0', transition: 'all 0.2s',
})

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
