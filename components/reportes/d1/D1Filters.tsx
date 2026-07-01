// components/reportes/d1/D1Filters.tsx
import { Search } from 'lucide-react';
import { styles } from './styles';

export function D1Filters() {
    return (
        <div style={styles.filterBar}>
            <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Fecha Inicio</label>
                <input type="date" style={styles.input} />
            </div>
            <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Fecha Fin</label>
                <input type="date" style={styles.input} />
            </div>
            <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Folio / IPH</label>
                <input type="text" placeholder="Buscar..." style={styles.input} />
            </div>
            <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Corporación</label>
                <select style={styles.input}>
                    <option>TODAS</option>
                    <option>POLICÍA MUNICIPAL</option>
                    <option>ESTATAL</option>
                </select>
            </div>
            <button style={{
                ...styles.primaryButton, 
                height: '38px', 
                justifyContent: 'center',
                background: '#2563EB'
            }}>
                <Search size={16} /> FILTRAR
            </button>
        </div>
    );
}