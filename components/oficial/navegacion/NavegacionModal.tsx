'use client'

import { createPortal } from 'react-dom'
import { useEffect, useSyncExternalStore } from 'react'
import { NavegacionDespacho } from './NavegacionDespacho'

const emptySubscribe = () => () => {}

interface NavegacionModalProps {
  incidenteId: string
  destino: { lat: number; lng: number }
  folio: string
  direccion?: string | null
  prioridad?: string | null
  onAtender: () => void
}

export function NavegacionModal({ incidenteId, destino, folio, direccion, prioridad, onAtender }: NavegacionModalProps) {
  const montado = useSyncExternalStore(emptySubscribe, () => true, () => false)

  useEffect(() => {
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflowPrevio
    }
  }, [])

  if (!montado) return null

  return createPortal(
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'var(--apple-glass-bg)', backdropFilter: 'blur(20px) saturate(180%)',
      display: 'flex', flexDirection: 'column',
    }}>
      <NavegacionDespacho
        incidenteId={incidenteId}
        destino={destino}
        folio={folio}
        direccion={direccion}
        prioridad={prioridad}
        onAtender={onAtender}
      />
    </div>,
    document.body,
  )
}
