import { Search } from 'lucide-react'
import { styles } from './styles'

export function ReportFilters() {
    return (
        <section style={styles.filterCard}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'flex-end' }}>
                <div>
                    <label style={styles.label}>Fecha Inicial</label>
                    <input type="date" style={styles.input} />
                </div>
                <div>
                    <label style={styles.label}>Fecha Final</label>
                    <input type="date" style={styles.input} />
                </div>
                <button style={{...styles.primaryButton, background: '#2563EB', padding: '12px 24px'}}>
                    <Search size={18} /> GENERAR REPORTE
                </button>
            </div>
        </section>
    )
}