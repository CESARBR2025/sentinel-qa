'use client'
import { Search, Download } from 'lucide-react'
import { styles } from './styles'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function D1Filters() {
    const router = useRouter()
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [folio, setFolio] = useState('')

    const handleFiltrar = () => {
        const params = new URLSearchParams()
        if (from) params.set('from', from)
        if (to) params.set('to', to)
        if (folio) params.set('folio', folio)
        router.push(`?${params}`)
    }

    const handleLimpiar = () => {
        setFrom(''); setTo(''); setFolio('')
        router.push('?')
    }

    return (
        <div style={styles.filterBar}>
            <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Fecha Inicio</label>
                <input type="date" style={styles.input} value={from} onChange={e => setFrom(e.target.value)} />
            </div>
            <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Fecha Fin</label>
                <input type="date" style={styles.input} value={to} onChange={e => setTo(e.target.value)} />
            </div>
            <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Folio / IPH</label>
                <input type="text" placeholder="Buscar..." style={styles.input} value={folio} onChange={e => setFolio(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleFiltrar() }} />
            </div>
            <button style={{ ...styles.primaryButton, height: '38px', justifyContent: 'center', background: '#2563EB' }} onClick={handleFiltrar}>
                <Search size={16} /> FILTRAR
            </button>
            <button style={{ ...styles.primaryButton, height: '38px', justifyContent: 'center', background: '#64748B' }} onClick={handleLimpiar}>
                X LIMPIAR
            </button>
            <a href={`/api/d1/exportar?from=${from}&to=${to}&folio=${folio}`}
                style={{ ...styles.primaryButton, height: '38px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#16a34a' }}>
                <Download size={16} /> EXCEL
            </a>
        </div>
    )
}