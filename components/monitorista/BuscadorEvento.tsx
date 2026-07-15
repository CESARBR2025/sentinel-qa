'use client'

import { useState, useRef, useEffect } from 'react'
import React from 'react'

const OPCIONES = [
  'D1',
  'Flagrancia',
  'Detenido con diversos elementos',
  'Robo a casa habitación',
  'Robo a vehículo',
  'Robo a transeúnte',
  'Robo a negocio',
  'Violencia familiar',
  'Lesiones',
  'Homicidio',
  'Daño a la propiedad',
  'Posesión de drogas',
  'Conducción en estado de ebriedad',
  'Alteración del orden público',
  'Falta administrativa',
]

export function BuscadorEvento({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [input, setInput] = useState(value)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(!!value)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtradas = OPCIONES.filter((o) => o.toLowerCase().includes(input.toLowerCase()))
  const mostrarOpciones = open && !selected
  const mostrarOtros = input.trim() && filtradas.length === 0

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <label style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'block', marginBottom: 6 }}>
        Tipo de Evento *
      </label>
      <input
        type="text"
        value={selected ? value : input}
        onChange={(e) => {
          setInput(e.target.value)
          setSelected(false)
          setOpen(true)
          onChange('')
        }}
        onFocus={() => setOpen(true)}
        placeholder="Buscar tipo de evento..."
        required
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 2, fontFamily: 'Inter', fontSize: 13, color: '#1e293b', boxSizing: 'border-box', outline: 'none' }}
      />

      {mostrarOpciones && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 2, zIndex: 1000, maxHeight: 220, overflow: 'auto', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          {filtradas.map((op) => (
            <div
              key={op}
              onClick={() => {
                onChange(op)
                setInput(op)
                setSelected(true)
                setOpen(false)
              }}
              style={{ padding: '10px 12px', fontFamily: 'Inter', fontSize: 13, color: '#1e293b', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {op}
            </div>
          ))}
          {mostrarOtros && (
            <div
              onClick={() => {
                onChange(input)
                setInput(`Otros: ${input}`)
                setSelected(true)
                setOpen(false)
              }}
              style={{ padding: '10px 12px', fontFamily: 'Inter', fontSize: 13, color: '#1f355a', cursor: 'pointer', fontStyle: 'italic', borderTop: '1px solid #e2e8f0' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#eff1f3')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              + Otros: &quot;{input}&quot;
            </div>
          )}
        </div>
      )}

      {selected && value && (
        <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#059669', fontWeight: 500 }}>✓ {value}</span>
          <button
            type="button"
            onClick={() => { setInput(''); setSelected(false); onChange('') }}
            style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Cambiar
          </button>
        </div>
      )}
    </div>
  )
}
