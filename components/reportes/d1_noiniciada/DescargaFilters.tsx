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
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 240px', minWidth: 180 }}>
          <label style={styles.label}>Nombre del afectado</label>
          <input style={styles.input} placeholder="Ej. Juan Pérez..."
            value={nombre} onChange={e => setNombre(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleFiltrar() }} />
        </div>
        <div style={{ flex: '1 1 160px', minWidth: 140 }}>
          <label style={styles.label}>Fecha inicio</label>
          <input type="date" style={styles.input} value={from} onChange={e => setFrom(e.target.value)} />
        </div>
        <div style={{ flex: '1 1 160px', minWidth: 140 }}>
          <label style={styles.label}>Fecha fin</label>
          <input type="date" style={styles.input} value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ ...styles.primaryButton, justifyContent: 'center', padding: '10px 14px' }} onClick={handleFiltrar}>
            <Search size={16} /> Filtrar
          </button>
          <button style={{ ...styles.primaryButton, justifyContent: 'center', background: '#64748B', padding: '10px 14px' }} onClick={handleLimpiar}>
            <X size={16} /> Limpiar
          </button>
          <a href={`/api/reportes-sin-d1/exportar?from=${from}&to=${to}&nombre=${nombre}`}
            style={{ ...styles.primaryButton, justifyContent: 'center', background: '#1f355a', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FileSpreadsheet size={16} /> Excel
          </a>
        </div>
      </div>
    </div>
  )
}