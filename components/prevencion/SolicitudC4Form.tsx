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
          background: '#0b1220',
          border: '1px solid #1b2742',
          color: '#d8e0f0',
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
            background: pending ? '#1b2742' : '#d4a43a',
            color: pending ? '#4a5878' : '#070b16',
            border: 'none',
            fontFamily: 'Barlow Condensed,sans-serif',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: pending ? 'not-allowed' : 'pointer',
          }}
        >
          {pending ? 'Registrando...' : 'Registrar petición a C4'}
        </button>
      </div>
    </form>
  )
}
