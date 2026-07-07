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
  }, [tipo])

  return (
    <section style={styles.filterCard}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto auto', gap: '20px', alignItems: 'flex-end' }}>
        <div>
          <label style={styles.label}>Tipo de Reporte</label>
          <select
            style={{ ...styles.input, appearance: 'none', cursor: 'pointer', fontWeight: 600, color: '#0F172A' }}
            value={tipo}
            onChange={e => setTipo(e.target.value)}
          >
            <option value="diario">DIARIO</option>
            <option value="semanal">SEMANAL</option>
          </select>
        </div>
        <div>
          <label style={styles.label}>Fecha Inicial</label>
          <input type="date" style={{ ...styles.input, color: '#0F172A' }} value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label style={styles.label}>Fecha Final</label>
          <input type="date" style={{ ...styles.input, color: '#0F172A' }} value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button style={{ ...styles.primaryButton, background: '#2563EB' }} onClick={handleGenerar}>
          <Search size={18} /> GENERAR
        </button>
        <button style={{ ...styles.primaryButton, background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0' }} onClick={handleLimpiar}>
          <X size={18} /> LIMPIAR
        </button>
      </div>
    </section>
  )
}