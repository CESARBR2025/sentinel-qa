// components/reportes/d1/D1Pagination.tsx
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { styles } from './styles';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    startIndex: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function D1Pagination({ 
    currentPage, totalPages, totalRecords, startIndex, itemsPerPage, onPageChange 
}: PaginationProps) {
    return (
        <div style={{ 
            padding: '12px 24px', borderTop: '1px solid #E2E8F0', 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF'
        }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#64748B' }}>
                MOSTRANDO {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalRecords)} DE {totalRecords} REGISTROS
            </div>

            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <button 
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(1)}
                    style={{ ...styles.secondaryButton, padding: '6px' }}
                ><ChevronsLeft size={16} /></button>

                <button 
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    style={{ ...styles.secondaryButton, padding: '6px' }}
                ><ChevronLeft size={16} /></button>

                <span style={{ 
                    fontFamily: 'JetBrains Mono', fontSize: '12px', 
                    fontWeight: 700, margin: '0 10px', color: '#0F172A'
                }}>
                    PÁGINA {currentPage} DE {totalPages || 1}
                </span>

                <button 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(currentPage + 1)}
                    style={{ ...styles.secondaryButton, padding: '6px' }}
                ><ChevronRight size={16} /></button>

                <button 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(totalPages)}
                    style={{ ...styles.secondaryButton, padding: '6px' }}
                ><ChevronsRight size={16} /></button>
            </div>
        </div>
    );
}