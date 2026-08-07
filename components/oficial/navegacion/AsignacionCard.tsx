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
      background: 'var(--apple-glass-bg)', backdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid var(--apple-glass-border)', borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--apple-shadow-glass)',
      padding: 28, boxSizing: 'border-box',
      fontFamily: 'var(--apple-font-display)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500,
          color: '#64748b',
        }}>
          <Hash size={12} />
          Reporte No.
        </div>
        <div style={{
          fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 28,
          color: '#0f172a', lineHeight: 1.1, letterSpacing: 'normal', textTransform: 'none',
        }}>
          {folio}
        </div>
      </div>

      <div style={{ height: 1, background: '#f1f5f9' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500,
          color: '#64748b',
        }}>
          <MapPin size={12} />
          Ubicación
        </div>
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 15, fontWeight: 500, color: '#334155' }}>
          {direccion ?? 'Sin dirección registrada'}
        </div>
      </div>

      <div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600,
          padding: '6px 14px', borderRadius: 'var(--radius-full)',
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
          fontFamily: 'var(--apple-font-display)', fontWeight: 600, fontSize: 15,
          textTransform: 'none', letterSpacing: 'normal',
          border: 'none', borderRadius: 'var(--radius-lg)',
          background: pendiente ? '#c3c8d2' : '#1f355a',
          color: '#ffffff', cursor: pendiente ? 'wait' : 'pointer',
          opacity: pendiente ? 0.7 : 1, transition: 'all .15s',
          boxShadow: pendiente ? 'none' : '0 3px 10px rgba(31,53,90,0.28)',
        }}
      >
        {pendiente ? 'Iniciando…' : 'Iniciar navegación'}
      </button>
    </div>
  )
}
