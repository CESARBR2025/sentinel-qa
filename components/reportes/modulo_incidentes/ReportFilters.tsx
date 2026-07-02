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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '20px', alignItems: 'flex-end' }}>
        <div>
          <label style={styles.label}>Fecha Inicial</label>
          <input type="date" style={styles.input} value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label style={styles.label}>Fecha Final</label>
          <input type="date" style={styles.input} value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button style={{ ...styles.primaryButton, background: '#2563EB', padding: '12px 24px' }} onClick={handleGenerar}>
          <Search size={18} /> GENERAR
        </button>
        <button style={{ ...styles.primaryButton, background: '#ffffff', color: '#64748b', border: '1px solid #e2e8f0', padding: '12px 24px' }} onClick={handleLimpiar}>
          <X size={18} /> LIMPIAR
        </button>
      </div>
    </section>
  )
}