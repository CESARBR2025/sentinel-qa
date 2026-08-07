'use client'

import { BellPlus, BellOff, Loader2 } from 'lucide-react'
import { usePushSubscription } from '@/hooks/usePushSubscription'

const ESTILO_BASE: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8, width: '100%', flexShrink: 0,
  padding: '11px 14px', border: 'none', borderTop: '1px solid #e2e8f0',
  background: 'transparent', cursor: 'pointer', textAlign: 'left',
  fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500,
  letterSpacing: 'normal', textTransform: 'none', color: '#64748b',
}

export function TogglePush() {
  const { estado, activar, desactivar } = usePushSubscription()

  if (estado === 'no-soportado') return null

  if (estado === 'denegado') {
    return (
      <div style={{ ...ESTILO_BASE, cursor: 'default', color: '#94a3b8' }}>
        <BellOff size={13} /> Notificaciones bloqueadas en el navegador
      </div>
    )
  }

  if (estado === 'cargando') {
    return (
      <div style={{ ...ESTILO_BASE, cursor: 'default' }}>
        <Loader2 size={13} className="animate-spin" /> Cargando…
      </div>
    )
  }

  if (estado === 'activo') {
    return (
      <button type="button" onClick={() => void desactivar()} style={ESTILO_BASE}>
        <BellOff size={13} /> Desactivar en este dispositivo
      </button>
    )
  }

  return (
    <button type="button" onClick={() => void activar()} style={{ ...ESTILO_BASE, color: '#1f355a' }}>
      <BellPlus size={13} /> Activar notificaciones en este dispositivo
    </button>
  )
}
