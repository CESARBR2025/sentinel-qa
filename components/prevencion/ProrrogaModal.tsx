'use client'

import { useState, useTransition, useRef } from 'react'
import { createProrroga } from '@/lib/prevencion/actions'

export function ProrrogaModal({ medidaId }: { medidaId: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData(formRef.current!)
    startTransition(async () => {
      await createProrroga(fd)
      setOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '8px 18px', background: 'rgba(212,164,58,0.1)',
          border: '1px solid #d4a43a', color: '#d4a43a',
          fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700,
          fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        ↻ Habilitar Prórroga
      </button>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(7,11,22,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#0b1220', border: '1px solid #1b2742',
            padding: 32, width: 420, maxWidth: '90vw',
          }}>
            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d8e0f0', marginBottom: 6 }}>
              Habilitar <span style={{ color: '#d4a43a' }}>Prórroga</span>
            </div>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 24px' }}>
              La vigencia se extiende desde hoy
            </p>

            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input type="hidden" name="medidaId" value={medidaId} />

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                <div>
                  <label style={L}>Extensión *</label>
                  <input
                    name="cantidad" type="number" min={1} max={999} required
                    placeholder="ej. 30"
                    style={I}
                  />
                </div>
                <div>
                  <label style={L}>Unidad</label>
                  <select name="unidad" defaultValue="dias" style={{ ...I, cursor: 'pointer' }}>
                    <option value="dias">Días</option>
                    <option value="meses">Meses</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={L}>Documento de solicitud (opcional)</label>
                <input
                  name="archivo"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  style={{ ...I, padding: '7px 12px', cursor: 'pointer', color: '#8a9bc0' }}
                />
                <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#2a3a5e', letterSpacing: '0.1em', margin: '4px 0 0' }}>
                  PDF, imagen o Word —
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                <button
                  type="submit"
                  disabled={pending}
                  style={{
                    flex: 1, padding: '10px 0', background: pending ? '#1b2742' : '#d4a43a',
                    color: pending ? '#4a5878' : '#070b16',
                    fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700,
                    fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase',
                    border: 'none', cursor: pending ? 'not-allowed' : 'pointer',
                  }}
                >
                  {pending ? 'Guardando…' : 'Confirmar prórroga'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={pending}
                  style={{
                    padding: '10px 20px', background: 'transparent',
                    border: '1px solid #1b2742', color: '#8a9bc0',
                    fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700,
                    fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

const L: React.CSSProperties = {
  display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
  color: '#4a5878', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6,
}
const I: React.CSSProperties = {
  width: '100%', padding: '9px 12px', background: '#070b16',
  border: '1px solid #1b2742', color: '#d8e0f0',
  fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none', boxSizing: 'border-box',
}
