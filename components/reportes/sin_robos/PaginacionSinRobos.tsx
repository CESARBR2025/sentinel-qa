'use client';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { styles } from './styles';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalResults: number;
    onPageChange: (page: number) => void;
}

export function PaginacionSinRobos({ currentPage, totalPages, totalResults, onPageChange }: PaginationProps) {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderTop: '1px solid #E2E8F0',
            background: '#FFFFFF',
            flexWrap: 'wrap',
            gap: 12
        }}>
            {/* Texto de resultados a la izquierda */}
            <div style={{ ...styles.tag }}>
                Mostrando <span style={{ color: '#0F172A' }}>{totalResults}</span> resultados en total
            </div>
            
            {/* Controles de navegación */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                
                {/* IR AL INICIO */}
                <button 
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    title="Ir al inicio"
                    style={{...paginationButtonStyle, opacity: currentPage === 1 ? 0.4 : 1}}
                >
                    <ChevronsLeft size={16} />
                </button>

                {/* ANTERIOR */}
                <button 
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    style={{...paginationButtonStyle, opacity: currentPage === 1 ? 0.4 : 1}}
                >
                    <ChevronLeft size={16} />
                </button>
                
                {/* INDICADOR CENTRAL */}
                <div style={{
                    fontFamily: 'var(--apple-font-display)',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                    margin: '0 4px'
                }}>
                    <span style={{ color: '#1f355a', background: '#eff1f3', padding: '4px 10px', borderRadius: 'var(--radius-md)' }}>
                        {currentPage}
                    </span>
                    <span style={{ padding: '4px 2px', color: '#64748B' }}>/</span>
                    <span style={{ padding: '4px 10px', color: '#64748B' }}>{totalPages}</span>
                </div>

                {/* SIGUIENTE */}
                <button 
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{...paginationButtonStyle, opacity: currentPage === totalPages ? 0.4 : 1}}
                >
                    <ChevronRight size={16} />
                </button>

                {/* IR AL FINAL */}
                <button 
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    title="Ir al final"
                    style={{...paginationButtonStyle, opacity: currentPage === totalPages ? 0.4 : 1}}
                >
                    <ChevronsRight size={16} />
                </button>
            </div>
        </div>
    );
}

const paginationButtonStyle = {
    background: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: 'var(--radius-md)',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: '#64748B',
    transition: 'all 0.2s'
};