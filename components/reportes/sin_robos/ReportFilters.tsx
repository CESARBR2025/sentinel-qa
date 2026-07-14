'use client'
import { Calendar, Search, Filter, X } from 'lucide-react'
import { styles } from './styles'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const ReportFilters = () => {
  const router = useRouter()
  const [from, setFrom] = useState('')
  const [to,   setTo]   = useState('')
  const [q,    setQ]    = useState('')

  const handleFiltrar = () => {
    const p = new URLSearchParams()
    if (from) p.set('from', from)
    if (to)   p.set('to',   to)
    if (q)    p.set('q',    q)
    router.push(`?${p}`)
  }

  const handleLimpiar = () => {
    setFrom(''); setTo(''); setQ('')
    router.push('?')
  }

  return (
    <div style={styles.filterCard}>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '300px' }}>
          <label style={styles.label}><Search size={10} style={{ marginRight: '4px' }} /> Buscador</label>
          <input style={styles.input} placeholder="Nombre, folio o conclusión..."
            value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleFiltrar() }} />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={styles.label}><Calendar size={10} style={{ marginRight: '4px' }} /> Fecha Inicio</label>
          <input type="date" style={styles.input} value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div style={{ flex: 1, minWidth: '150px' }}>
          <label style={styles.label}><Calendar size={10} style={{ marginRight: '4px' }} /> Fecha Fin</label>
          <input type="date" style={styles.input} value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button style={{ ...styles.primaryButton, background: '#1f355a', height: '42px' }} onClick={handleFiltrar}>
          <Filter size={14} /> FILTRAR
        </button>
        <button style={{ ...styles.primaryButton, background: '#64748B', height: '42px' }} onClick={handleLimpiar}>
          <X size={14} /> LIMPIAR
        </button>
      </div>
    </div>
  )
}