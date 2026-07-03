'use client'

import { useTransition, useRef } from 'react'
import { createSolicitudC4 } from '@/lib/prevencion/actions'

export function SolicitudC4Form({ solicitudId }: { solicitudId: string }) {
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(formRef.current!)
    startTransition(async () => {
      await createSolicitudC4(fd)
      formRef.current?.reset()
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
      <input type="hidden" name="solicitudId" value={solicitudId} />
      <textarea
        name="descripcionEvidencias"
        required
        rows={3}
        placeholder="Describir evidencias o información a solicitar al C4..."
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          color: '#1e293b',
          fontFamily: 'Inter,sans-serif',
          fontSize: 13,
          padding: '10px 12px',
          resize: 'vertical',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      <div>
        <button
          type="submit"
          disabled={pending}
          style={{
            padding: '9px 20px',
            background: pending ? '#f1f5f9' : '#2563eb',
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
          {pending ? 'Registrando...' : 'Registrar petición a C4'}
        </button>
      </div>
    </form>
  )
}
