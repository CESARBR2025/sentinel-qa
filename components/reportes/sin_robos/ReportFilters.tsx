'use client';
import { Calendar, Search, Filter } from 'lucide-react';
import { styles } from './styles';

export const ReportFilters = () => {
    return (
        <div style={styles.filterCard}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                
                {/* FILTRO: BUSQUEDA GENERAL */}
                <div style={{ flex: 2, minWidth: '300px' }}>
                    <label style={styles.label}>
                        <Search size={10} style={{ marginRight: '4px' }} /> 
                        Buscador de registros
                    </label>
                    <input 
                        style={styles.input} 
                        placeholder="Filtrar por nombre, folio o conclusión..." 
                    />
                </div>

                {/* FILTRO: FECHA INICIO */}
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={styles.label}>
                        <Calendar size={10} style={{ marginRight: '4px' }} /> 
                        Fecha Inicio
                    </label>
                    <input 
                        type="date" 
                        style={styles.input} 
                    />
                </div>

                {/* FILTRO: FECHA FIN */}
                <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={styles.label}>
                        <Calendar size={10} style={{ marginRight: '4px' }} /> 
                        Fecha Fin
                    </label>
                    <input 
                        type="date" 
                        style={styles.input} 
                    />
                </div>

                {/* BOTÓN APLICAR (Opcional, estilo Sentinel) */}
                <button style={{ 
                    ...styles.primaryButton, 
                    background: '#F1F5F9', 
                    color: '#475569',
                    border: '1px solid #E2E8F0',
                    height: '42px' 
                }}>
                    <Filter size={14} /> FILTRAR
                </button>

            </div>
        </div>
    );
};