'use client'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { styles } from '../deteccion_camara/styles'

export function ReportFilters() {
  const router = useRouter()
  const [from, setFrom] = useState('')
  const [to,   setTo]   = useState('')

  const handleGenerar = () => {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to)   params.set('to',   to)
    router.push(`?${params}`)
  }

  const handleLimpiar = () => {
    setFrom('')
    setTo('')
    router.push('?')
  }

  return (
    <section style={styles.filterCard}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px', minWidth: 160 }}>
          <label style={styles.label}>Fecha inicial</label>
          <input type="date" style={styles.input} value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 200px', minWidth: 160 }}>
          <label style={styles.label}>Fecha final</label>
          <input type="date" style={styles.input} value={to} onChange={e => setTo(e.target.value)} />
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