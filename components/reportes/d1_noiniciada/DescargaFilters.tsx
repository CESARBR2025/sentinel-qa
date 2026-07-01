import { Search, FileSpreadsheet } from 'lucide-react';
import { styles } from './styles';

export const DescargaFilters = () => {
    return (
        <div style={styles.filterCard}>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px', 
                alignItems: 'end' 
            }}>
                {/* Nombre */}
                <div>
                    <label style={styles.label}>Nombre del Afectado</label>
                    <input style={styles.input} placeholder="Ej. Juan Pérez..." />
                </div>

                {/* Documentación */}
                <div>
                    <label style={styles.label}>Documentación</label>
                    <input style={styles.input} placeholder="INE, Pasaporte, etc..." />
                </div>

                {/* Fecha */}
                <div>
                    <label style={styles.label}>Rango de Fecha</label>
                    <input type="date" style={styles.input} />
                </div>

                {/* Acciones */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ ...styles.primaryButton, flex: 1, justifyContent: 'center' }}>
                        <Search size={16} /> BUSCAR
                    </button>
                    
                    {/* BOTÓN DE DESCARGA EXCEL */}
                    <button style={{ 
                        ...styles.primaryButton, 
                        background: '#166534', // Verde Excel para que se note
                        flex: 1, 
                        justifyContent: 'center' 
                    }}>
                        <FileSpreadsheet size={16} /> DESCARGAR EXCEL
                    </button>
                </div>
            </div>
        </div>
    );
};