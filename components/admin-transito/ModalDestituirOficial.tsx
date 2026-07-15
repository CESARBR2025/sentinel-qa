'use client'

import { useCallback, useEffect, useRef } from 'react'
import { destituirOficial } from '@/lib/admin-transito/actions'
import { AlertTriangle } from 'lucide-react'

interface Props {
  oficialId: string
  userId: string
  oficialNombre: string
  onClose: () => void
}

export default function ModalDestituirOficial({
  oficialId,
  userId,
  oficialNombre,
  onClose,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose()
    },
    [onClose],
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  async function handleConfirm() {
    const fd = new FormData()
    fd.set('oficialId', oficialId)
    fd.set('userId', userId)
    onClose()
    await destituirOficial(fd)
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15,23,42,0.6)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        style={{
          background: '#fff',
          width: 440,
          maxWidth: '90vw',
          border: '1px solid #e2e8f0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: '#dc2626',
          }}
        />

        <div style={{ padding: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <AlertTriangle size={24} color="#dc2626" strokeWidth={1.5} />
          </div>

          <h3
            style={{
              fontFamily: 'Barlow Condensed,sans-serif',
              fontSize: 22,
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#0f172a',
              margin: '0 0 8px 0',
            }}
          >
            Destituir Oficial
          </h3>

          <p
            style={{
              fontFamily: 'Inter,sans-serif',
              fontSize: 13,
              color: '#64748b',
              lineHeight: 1.6,
              margin: '0 0 4px 0',
            }}
          >
            Se destituirá a <strong style={{ color: '#0f172a' }}>{oficialNombre}</strong> como oficial. El usuario quedará pendiente de reincorporación.
          </p>

          <p
            style={{
              fontFamily: 'JetBrains Mono,monospace',
              fontSize: 10,
              color: '#dc2626',
              letterSpacing: '0.1em',
              margin: '12px 0 24px 0',
            }}
          >
            Esta acción no se puede deshacer.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                background: '#f1f5f9',
                color: '#475569',
                fontFamily: 'Barlow Condensed,sans-serif',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              style={{
                padding: '10px 24px',
                background: '#dc2626',
                color: '#fff',
                fontFamily: 'Barlow Condensed,sans-serif',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Confirmar Destitución
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
