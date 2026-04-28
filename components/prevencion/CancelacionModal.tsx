'use client'

import { useState } from 'react'
import { cancelarFicha } from '@/lib/prevencion/actions'

export function CancelacionModal({ fichaId }: { fichaId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding:       '9px 18px',
          background:    'transparent',
          color:         '#c0223a',
          border:        '1px solid #c0223a50',
          fontFamily:    'JetBrains Mono,monospace',
          fontSize:      10,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          cursor:        'pointer',
        }}
      >
        Cancelar ficha
      </button>

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(7,11,22,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div style={{ background: '#0d1525', border: '1px solid #c0223a40', padding: '32px', width: '100%', maxWidth: 480, position: 'relative' }}>
            <div style={{ position: 'absolute', top: -1, left: 0, width: 48, height: 2, background: '#c0223a' }} />

            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#d8e0f0', marginBottom: 6 }}>
              Cancelar <span style={{ color: '#c0223a' }}>Ficha de Búsqueda</span>
            </div>
            <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#4a5878', letterSpacing: '0.1em', marginBottom: 24 }}>
              Esta acción cierra el expediente y detiene todas las alertas de seguimiento.
            </p>

            <form action={cancelarFicha} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input type="hidden" name="fichaId" value={fichaId} />

              <InputField label="Fecha y Hora de Cancelación *" name="fechaCancelacion" type="datetime-local" required />
              <InputField label="Fiscal que Cancela *"          name="fiscalCancela"    required />
              <TextareaField label="Motivo / Observaciones"     name="motivoCancelacion" rows={3} />

              <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{ padding: '9px 16px', background: 'transparent', color: '#7f8faf', border: '1px solid #2a3a5e', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px 16px', background: '#c0223a', color: '#fff', border: 'none', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Confirmar cancelación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function InputField({ label, name, type = 'text', required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#8a9bc0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</span>
      <input
        type={type} name={name} required={required}
        style={{ padding: '9px 12px', background: '#070b16', border: '1px solid #2a3a5e', color: '#d8e0f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box' }}
      />
    </label>
  )
}

function TextareaField({ label, name, rows = 3 }: { label: string; name: string; rows?: number }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#8a9bc0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</span>
      <textarea
        name={name} rows={rows}
        style={{ padding: '9px 12px', background: '#070b16', border: '1px solid #2a3a5e', color: '#d8e0f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
      />
    </label>
  )
}
