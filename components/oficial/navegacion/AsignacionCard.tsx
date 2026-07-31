'use client'

import { Hash, MapPin } from 'lucide-react'
import { colorPorPrioridad } from '@/lib/incidentes/prioridad-colores'

interface AsignacionCardProps {
  folio: string
  direccion?: string | null
  prioridad?: string | null
  onIniciar: () => void
  pendiente?: boolean
}

export function AsignacionCard({ folio, direccion, prioridad, onIniciar, pendiente }: AsignacionCardProps) {
  const color = colorPorPrioridad(prioridad)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 20,
      width: '100%', maxWidth: 480, margin: '32px auto',
      background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2,
      boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
      padding: 28, boxSizing: 'border-box',
      fontFamily: 'Inter,sans-serif',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8',
        }}>
          <Hash size={12} />
          Reporte No.
        </div>
        <div style={{
          fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 28,
          color: '#0f172a', lineHeight: 1.1,
        }}>
          {folio}
        </div>
      </div>

      <div style={{ height: 1, background: '#f1f5f9' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94a3b8',
        }}>
          <MapPin size={12} />
          Ubicación
        </div>
        <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 15, fontWeight: 500, color: '#334155' }}>
          {direccion ?? 'Sin dirección registrada'}
        </div>
      </div>

      <div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '6px 14px', borderRadius: 2,
          background: color.fondo, color: color.oscuro, border: `1px solid ${color.principal}`,
        }}>
          Impacto: {prioridad ?? 'Sin definir'}
        </span>
      </div>

      <button
        onClick={onIniciar}
        disabled={pendiente}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', padding: '16px 24px', marginTop: 4,
          fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 16,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          border: '1px solid #1f355a', borderRadius: 2,
          background: pendiente ? '#c3c8d2' : '#1f355a',
          color: '#ffffff', cursor: pendiente ? 'wait' : 'pointer',
          opacity: pendiente ? 0.7 : 1, transition: 'all .15s',
        }}
      >
        {pendiente ? 'INICIANDO…' : '🚓 INICIAR NAVEGACIÓN'}
      </button>
    </div>
  )
}
