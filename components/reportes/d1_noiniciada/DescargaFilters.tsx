'use client'
import { Search, FileSpreadsheet, X } from 'lucide-react'
import { styles } from './styles'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export const DescargaFilters = () => {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [from,   setFrom]   = useState('')
  const [to,     setTo]     = useState('')

  const handleFiltrar = () => {
    const p = new URLSearchParams()
    if (nombre) p.set('nombre', nombre)
    if (from)   p.set('from',   from)
    if (to)     p.set('to',     to)
    router.push(`?${p}`)
  }

  const handleLimpiar = () => {
    setNombre(''); setFrom(''); setTo('')
    router.push('?')
  }

  return (
    <div style={styles.filterCard}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', alignItems: 'end' }}>
        <div>
          <label style={styles.label}>Nombre del Afectado</label>
          <input style={styles.input} placeholder="Ej. Juan Pérez..."
            value={nombre} onChange={e => setNombre(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleFiltrar() }} />
        </div>
        <div>
          <label style={styles.label}>Fecha Inicio</label>
          <input type="date" style={styles.input} value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div>
          <label style={styles.label}>Fecha Fin</label>
          <input type="date" style={styles.input} value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ ...styles.primaryButton, flex: 1, justifyContent: 'center' }} onClick={handleFiltrar}>
            <Search size={16} />
          </button>
          <button style={{ ...styles.primaryButton, flex: 1, justifyContent: 'center', background: '#64748B' }} onClick={handleLimpiar}>
            <X size={16} />
          </button>
          <a href={`/api/reportes-sin-d1/exportar?from=${from}&to=${to}&nombre=${nombre}`}
            style={{ ...styles.primaryButton, flex: 2, justifyContent: 'center', background: '#166534', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FileSpreadsheet size={16} /> EXCEL
          </a>
        </div>
      </div>
    </div>
  )
}