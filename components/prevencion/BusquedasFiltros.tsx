'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { SearchBox } from './SearchBox'

const TIPOS = [
  { key: '', label: 'Todos' },
  { key: 'PROTOCOLO_ALBA', label: 'Protocolo Alba' },
  { key: 'PROTOCOLO_AMBAR', label: 'Protocolo Ambar' },
  { key: 'BUSQUEDA_PERSONA', label: 'Búsqueda de Persona' },
]

const ESTADOS = [
  { key: '', label: 'Todos' },
  { key: 'activa', label: 'Activas' },
  { key: 'cancelada', label: 'Cerradas' },
]

export function BusquedasFiltros() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const tipo = searchParams.get('tipo') ?? ''
  const status = searchParams.get('status') ?? ''
  const q = searchParams.get('q') ?? ''

  const set = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    p.delete('page')
    router.push(`/prevencion/busquedas?${p.toString()}`)
  }, [router, searchParams])

  return (
    <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SearchBox placeholder="Buscar por nombre, folio, carpeta de investigación..." />

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {TIPOS.map(t => {
          const active = tipo === t.key
          return (
            <button
              key={t.key}
              onClick={() => set('tipo', t.key)}
              style={{
                padding: '5px 14px',
                background: active ? '#1f355a' : '#ffffff',
                border: `1px solid ${active ? '#1f355a' : '#e2e8f0'}`,
                color: active ? '#ffffff' : '#64748b',
                fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          )
        })}

        <div style={{ width: 1, height: 18, background: '#e2e8f0' }} />

        <select
          value={status}
          onChange={e => set('status', e.target.value)}
          style={{
            padding: '5px 12px', background: '#ffffff',
            border: '1px solid #e2e8f0', color: status ? '#0f172a' : '#64748b',
            fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            cursor: 'pointer', outline: 'none',
          }}
        >
          {ESTADOS.map(e => <option key={e.key} value={e.key}>{e.label}</option>)}
        </select>

        {(tipo || status || q) && (
          <button
            onClick={() => router.push('/prevencion/busquedas')}
            style={{
              padding: '5px 14px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#ef4444',
              fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>
    </div>
  )
}
