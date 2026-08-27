'use client'
import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { styles } from './styles'

export function FiltrosIncidencias() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [from, setFrom] = useState(searchParams.get('from') || '')
  const [to, setTo] = useState(searchParams.get('to') || '')
  const [tipo, setTipo] = useState(searchParams.get('tipo') || 'diario')

  const handleGenerar = () => {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)

    // CORRECCIÓN: Usamos 'tipo' que es el nombre de tu estado arriba
    params.set('tipo', tipo)

    router.push(`?${params.toString()}`)
  }

  const handleLimpiar = () => {
    setFrom('')
    setTo('')
    setTipo('diario')
    router.push('?')
  }

  useEffect(() => {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    params.set('tipo', tipo)
    router.push(`?${params.toString()}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo])

  return (
    <section style={styles.filterCard}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px', minWidth: 160 }}>
          <label style={styles.label}>Tipo de reporte</label>
          <select
            style={{ ...styles.input, appearance: 'none', cursor: 'pointer', fontWeight: 600, color: '#0F172A' }}
            value={tipo}
            onChange={e => setTipo(e.target.value)}
          >
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
          </select>
        </div>
        <div style={{ flex: '1 1 200px', minWidth: 160 }}>
          <label style={styles.label}>Fecha inicial</label>
          <input type="date" style={{ ...styles.input, color: '#0F172A' }} value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 200px', minWidth: 160 }}>
          <label style={styles.label}>Fecha final</label>
          <input type="date" style={{ ...styles.input, color: '#0F172A' }} value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button style={{ ...styles.primaryButton, background: '#1f355a' }} onClick={handleGenerar}>
          <Search size={16} /> Generar
        </button>
        <button style={{ ...styles.primaryButton, background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0' }} onClick={handleLimpiar}>
          <X size={16} /> Limpiar
        </button>
      </div>
    </section>
  )
}