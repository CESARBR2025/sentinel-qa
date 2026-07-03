'use client'

import { useState, useTransition, useRef } from 'react'
import { addAutoridadMedida } from '@/lib/prevencion/actions'
import { AutoridadBadge } from './AutoridadBadge'

const AUTORIDADES = ['FISCALIA', 'UMECA', 'JUZGADOS', 'SEC_MUJER'] as const
type Autoridad = typeof AUTORIDADES[number]

interface Props {
  medidaId: string
  autoridadPrincipal: string
  yaAgregadas: string[]
}

const L: React.CSSProperties = {
  display: 'block', fontFamily: 'JetBrains Mono,monospace', fontSize: 9,
  color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6,
}
const I: React.CSSProperties = {
  width: '100%', padding: '8px 12px', background: '#f8fafc',
  border: '1px solid #e2e8f0', color: '#1e293b',
  fontFamily: 'Inter,sans-serif', fontSize: 13, outline: 'none', boxSizing: 'border-box',
}

export function AgregarAutoridadForm({ medidaId, autoridadPrincipal, yaAgregadas }: Props) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const disponibles = AUTORIDADES.filter(
    a => a !== autoridadPrincipal && !yaAgregadas.includes(a)
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const fd = new FormData(formRef.current!)
    startTransition(async () => {
      await addAutoridadMedida(fd)
      formRef.current?.reset()
      setOpen(false)
    })
  }

  if (disponibles.length === 0) {
    return (
      <p style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 10, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
        › Todas las autoridades ya están registradas
      </p>
    )
  }

  return (
    <>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            padding: '6px 14px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#2563eb',
            fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
            letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          + Agregar autoridad
        </button>
      ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          <input type="hidden" name="medidaId" value={medidaId} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={L}>Autoridad *</label>
              <select name="autoridad" required style={{ ...I, cursor: 'pointer' }}>
                {disponibles.map(a => (
                  <option key={a} value={a}>{a.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={L}>No. Oficio</label>
              <input name="nOficio" style={I} placeholder="Opcional" />
            </div>
            <div>
              <label style={L}>Fecha Oficio</label>
              <input name="fechaOficio" type="date" style={I} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="submit"
              disabled={pending}
              style={{
                padding: '7px 18px',
                background: pending ? '#f1f5f9' : '#2563eb',
                color: pending ? '#94a3b8' : '#ffffff',
                fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 700,
                fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
                border: 'none', cursor: pending ? 'not-allowed' : 'pointer',
              }}
            >
              {pending ? 'Guardando…' : 'Confirmar'}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={pending}
              style={{
                padding: '7px 14px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </>
  )
}
