import { ChevronLeft, ChevronRight } from 'lucide-react'
import { styles } from '@/components/reportes/modulo_incidentes/styles'

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalResults: number;
}

export function PhonePagination({ currentPage, totalPages, totalResults }: PaginationProps) {
    return (
        <div style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '16px 24px', 
            borderTop: '1px solid #E2E8F0',
            background: '#FFFFFF'
        }}>
            <div style={{ ...styles.tag, letterSpacing: '0.1em' }}>
                MOSTRANDO <span style={{ color: '#0F172A' }}>{totalResults}</span> RESULTADOS EN TOTAL
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button style={paginationButtonStyle}>
                    <ChevronLeft size={16} />
                </button>
                
                <div style={{ 
                    fontFamily: 'JetBrains Mono', 
                    fontSize: '12px', 
                    fontWeight: 700,
                    display: 'flex',
                    gap: '4px'
                }}>
                    <span style={{ color: '#1f355a', background: '#eff1f3', padding: '4px 10px', borderRadius: '4px' }}>
                        {currentPage}
                    </span>
                    <span style={{ padding: '4px 2px', color: '#64748B' }}>/</span>
                    <span style={{ padding: '4px 10px', color: '#64748B' }}>{totalPages}</span>
                </div>

                <button style={paginationButtonStyle}>
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    )
}

const paginationButtonStyle = {
    background: 'white',
    border: '1px solid #E2E8F0',
    borderRadius: '4px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: '#64748B',
    transition: 'all 0.2s'
}