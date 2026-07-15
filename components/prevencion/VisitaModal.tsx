'use client'

import { useState, useTransition, useRef } from 'react'
import { createVisita } from '@/lib/prevencion/actions'

export function VisitaModal({ medidaId }: { medidaId: string }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      await createVisita(medidaId, fd)
      formRef.current?.reset()
      setOpen(false)
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          padding: '9px 18px',
          background: '#1f355a',
          color: '#ffffff',
          border: '1px solid #1f355a',
          borderRadius: '2px',
          fontFamily: 'Barlow Condensed,sans-serif',
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        + Registrar Visita
      </button>

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(7,11,22,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '32px', width: '100%', maxWidth: 480, position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ position: 'absolute', top: -1, left: 0, width: 48, height: 2, background: '#1f355a' }} />

            <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 20, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f172a', marginBottom: 24 }}>
              Registrar <span style={{ color: '#1f355a' }}>Visita Domiciliaria</span>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InputField label="Fecha *" name="fechaVisita" type="date" required />
                <InputField label="Hora *" name="horaVisita" type="time" required />
              </div>
              <TextareaField label="Resultado de la visita" name="resultado" rows={3} />
              <CheckboxField label="Se aplicó apercibimiento" name="apercibimientoAplicado" value="1" />

              <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  style={{ padding: '9px 16px', background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0', fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{ flex: 1, padding: '10px 16px', background: isPending ? '#94a3b8' : '#1f355a', color: '#ffffff', border: 'none', fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700, fontSize: 14, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: isPending ? 'wait' : 'pointer', borderRadius: '2px' }}
                >
                  {isPending ? 'Guardando…' : 'Guardar Visita'}
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
        style={{ padding: '9px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
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
        style={{ padding: '9px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b', fontFamily: 'JetBrains Mono,monospace', fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
      />
    </label>
  )
}

function CheckboxField({ label, name, value }: { label: string; name: string; value: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <input type="checkbox" name={name} value={value} style={{ width: 14, height: 14, accentColor: '#c0223a' }} />
      <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#8a9bc0', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
    </label>
  )
}
