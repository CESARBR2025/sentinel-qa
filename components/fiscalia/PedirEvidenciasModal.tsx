'use client'

import { useState } from 'react'
import { accionPedirEvidencias } from '@/lib/fiscalia/actions'

export function PedirEvidenciasBoton({ solicitudId }: { solicitudId: string }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const form = e.currentTarget
    const res = await accionPedirEvidencias(new FormData(form))

    setPending(false)

    if (!res.success) {
      setError(res.error ?? 'Error desconocido')
      return
    }

    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          fontFamily: 'JetBrains Mono,monospace',
          fontSize: 9,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '5px 14px',
          border: '1px solid #059669',
          background: '#ffffff',
          color: '#059669',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.color = '#ffffff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#059669'; }}
      >
        Pedir Evidencias
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(15,23,42,0.5)',
          }}
          onClick={() => { if (!pending) { setOpen(false); setError(null) } }}
        >
          <div
            style={{
              background: '#ffffff',
              width: 420,
              padding: 32,
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, width: 48, height: 3, background: '#059669' }}></div>

            {error && (
              <div style={{
                marginBottom: 16,
                padding: '10px 14px',
                background: '#fef2f2',
                borderLeft: '3px solid #dc2626',
                fontFamily: 'Inter,sans-serif',
                fontSize: 12,
                color: '#991b1b',
                lineHeight: 1.4,
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 24 }}>
              <h3 style={{
                fontFamily: 'Barlow Condensed,sans-serif',
                fontSize: 22,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                margin: '0 0 8px 0',
                color: '#0f172a',
              }}>
                Pedir Evidencias
              </h3>
              <p style={{
                fontFamily: 'Inter,sans-serif',
                fontSize: 13,
                color: '#64748b',
                margin: 0,
                lineHeight: 1.5,
              }}>
                Al solicitar las evidencias, se notificará al <strong>monitorista</strong> para que cargue las fotos del caso. El estado de la solicitud cambiará a <strong>PENDIENTE_MONITORISTA</strong>. ¿Deseas continuar?
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <input type="hidden" name="id" value={solicitudId} />

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => { setOpen(false); setError(null) }}
                  style={{
                    fontFamily: 'Inter,sans-serif',
                    fontSize: 12,
                    padding: '8px 20px',
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  style={{
                    fontFamily: 'Inter,sans-serif',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '8px 20px',
                    border: 'none',
                    background: pending ? '#34d399' : '#059669',
                    color: '#ffffff',
                    cursor: pending ? 'not-allowed' : 'pointer',
                  }}
                >
                  {pending ? 'Enviando...' : 'Pedir Evidencias'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
