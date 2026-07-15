'use client'

import { useTransition, useRef } from 'react'
import { createContestacion } from '@/lib/prevencion/actions'

export function ContestacionForm({ solicitudId }: { solicitudId: string }) {
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(formRef.current!)
    startTransition(async () => {
      await createContestacion(fd)
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <input type="hidden" name="solicitudId" value={solicitudId} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
        <FormField label="Fecha de contestación *">
          <input type="date" name="fechaContestacion" required style={inputStyle} />
        </FormField>
        <FormField label="URL / Ruta del PDF">
          <input
            type="text"
            name="archivoPdfUrl"
            placeholder="Ruta o URL del archivo PDF..."
            style={inputStyle}
          />
        </FormField>
      </div>

      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, letterSpacing: '0.25em', color: '#1f355a', textTransform: 'uppercase', marginTop: 4 }}>
        › Acuse de Entrega
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 14 }}>
        <FormField label="Fecha de entrega">
          <input type="date" name="fechaEntrega" style={inputStyle} />
        </FormField>
        <FormField label="Hora de entrega">
          <input type="time" name="horaEntrega" style={inputStyle} />
        </FormField>
        <FormField label="Nombre de quien recibió">
          <input
            type="text"
            name="nombreQuienRecibio"
            placeholder="Nombre completo"
            style={inputStyle}
          />
        </FormField>
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          style={{
            padding: '10px 24px',
            background: pending ? '#f1f5f9' : '#1f355a',
            color: pending ? '#94a3b8' : '#ffffff',
            border: 'none',
            fontFamily: 'Barlow Condensed,sans-serif',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: pending ? 'not-allowed' : 'pointer',
            borderRadius: '2px',
          }}
        >
          {pending ? 'Guardando...' : 'Registrar Contestación y Acuse'}
        </button>
      </div>
    </form>
  )
}

const inputStyle: React.CSSProperties = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  color: '#1e293b',
  fontFamily: 'Inter,sans-serif',
  fontSize: 13,
  padding: '9px 12px',
  width: '100%',
  boxSizing: 'border-box',
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 9, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
