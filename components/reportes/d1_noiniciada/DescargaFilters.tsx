import { Search, FileSpreadsheet } from 'lucide-react';
import { styles } from './styles';

export const DescargaFilters = () => {
    return (
        <div style={styles.filterCard}>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                gap: '16px', 
                alignItems: 'end' 
            }}>
                {/* 1. Nombre */}
                <div>
                    <label style={styles.label}>Nombre del Afectado</label>
                    <input style={styles.input} placeholder="Ej. Juan Pérez..." />
                </div>

                {/* 2. Documentación */}
                <div>
                    <label style={styles.label}>Documentación</label>
                    <input style={styles.input} placeholder="INE, Pasaporte, etc..." />
                </div>

                {/* 3. Fecha Inicio */}
                <div>
                    <label style={styles.label}>Fecha Inicio</label>
                    <input type="date" style={styles.input} />
                </div>

                {/* 4. Fecha Fin */}
                <div>
                    <label style={styles.label}>Fecha Fin</label>
                    <input type="date" style={styles.input} />
                </div>

                {/* 5. Acciones de Búsqueda y Descarga */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button title="Filtrar" style={{ ...styles.primaryButton, flex: 1, justifyContent: 'center' }}>
                        <Search size={16} />
                    </button>
                    
                    <button title="Descargar Reporte Excel" style={{ 
                        ...styles.primaryButton, 
                        background: '#166534', // Verde Excel
                        flex: 2, 
                        justifyContent: 'center' 
                    }}>
                        <FileSpreadsheet size={16} /> DESCARGAR EXCEL
                    </button>
                </div>
            </div>
        </div>
    );
};