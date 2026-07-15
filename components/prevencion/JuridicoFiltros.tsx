'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { SearchBox } from './SearchBox'

const AUTORIDADES = [
  { value: '', label: 'Todas las autoridades' },
  { value: 'FISCALIA', label: 'Fiscalía' },
  { value: 'UMECA', label: 'UMECA' },
  { value: 'JUZGADOS', label: 'Juzgados' },
  { value: 'SEC_MUJER', label: 'Sec. de la Mujer' },
]

export function JuridicoFiltros() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const autoridad = searchParams.get('autoridad') ?? ''
  const q = searchParams.get('q') ?? ''

  const set = useCallback((key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    p.delete('page')
    router.push(`/prevencion/juridico?${p.toString()}`)
  }, [router, searchParams])

  return (
    <div style={{ marginBottom: 24, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      <SearchBox placeholder="Buscar por oficio, delito, carpeta de investigación..." />

      <select
        value={autoridad}
        onChange={e => set('autoridad', e.target.value)}
        style={{
          padding: '5px 12px', background: '#ffffff',
          border: '1px solid #e2e8f0', color: autoridad ? '#0f172a' : '#64748b',
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          cursor: 'pointer', outline: 'none',
        }}
      >
        {AUTORIDADES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
      </select>

      {(autoridad || q) && (
        <button
          onClick={() => router.push('/prevencion/juridico')}
          style={{
            padding: '5px 14px', background: '#ffffff', border: '1px solid #e2e8f0', color: '#ef4444',
            fontFamily: 'JetBrains Mono,monospace', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer',
          }}
        >
          ✕ Limpiar filtros
        </button>
      )}
    </div>
  )
}
