'use client'

import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export type ToastTipo = 'exito' | 'error'

export function Toast({
  show,
  mensaje,
  tipo = 'exito',
  onClose,
  duracion = 4000,
}: {
  show: boolean
  mensaje: string
  tipo?: ToastTipo
  onClose: () => void
  duracion?: number
}) {
  useEffect(() => {
    if (!show) return
    const timer = setTimeout(onClose, duracion)
    return () => clearTimeout(timer)
  }, [show, duracion, onClose])

  if (!show) return null

  const esExito = tipo === 'exito'
  const color = esExito ? '#22c55e' : '#ef4444'
  const Icono = esExito ? CheckCircle : XCircle

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: '#0f172a', color: '#ffffff', padding: '16px 24px',
      borderRadius: 2, display: 'flex', alignItems: 'center', gap: 12,
      fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
      borderLeft: `4px solid ${color}`, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      animation: 'toastSlideIn 0.3s ease',
    }}>
      <Icono size={20} color={color} />
      <span>{mensaje}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginLeft: 8 }}>
        <X size={16} />
      </button>
      <style>{`
        @keyframes toastSlideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  )
}
