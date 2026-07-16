'use client'

import { useState, useRef, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import { actualizarTelefono } from '@/lib/oficial/actions'

interface Props {
  telefono: string | null
}

export function EditarTelefono({ telefono }: Props) {
  const [editando, setEditando] = useState(false)
  const [valor, setValor] = useState(telefono || '')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editando && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editando])

  async function handleGuardar() {
    if (!valor.trim() || valor === telefono) { setEditando(false); return }
    setError(null)
    setEnviando(true)
    try {
      const fd = new FormData()
      fd.set('telefono', valor.trim())
      await actualizarTelefono(fd)
      setEditando(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally { setEnviando(false) }
  }

  function handleCancelar() { setValor(telefono || ''); setEditando(false); setError(null) }

  if (editando) {
    return (
      <div>
        <div className="te-edit-wrap">
          <input
            ref={inputRef}
            type="tel"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleGuardar(); if (e.key === 'Escape') handleCancelar() }}
            className="te-input"
            disabled={enviando}
            placeholder="4421234567"
          />
          <button onClick={handleGuardar} disabled={enviando || !valor.trim()} className="te-save">
            {enviando ? 'Guardando…' : 'Guardar'}
          </button>
          <button onClick={handleCancelar} disabled={enviando} className="te-cancel">Cancelar</button>
        </div>
        {error && <div className="te-error">{error}</div>}
      </div>
    )
  }

  return (
    <div className="te-wrap">
      <span className="te-value">{telefono || <span style={{ color: '#94a3b8' }}>Sin registrar</span>}</span>
      <button onClick={() => setEditando(true)} className="te-btn">
        <Pencil size={10} />
        {telefono ? 'Editar' : 'Agregar'}
      </button>
    </div>
  )
}
