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
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', flexWrap: 'wrap', gap: 12
        }}>
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: '12px', color: '#64748B' }}>
                Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalRecords)} de {totalRecords} registros
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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
                    fontFamily: 'var(--apple-font-display)', fontSize: '12px',
                    fontWeight: 600, margin: '0 10px', color: '#0F172A'
                }}>
                    Página {currentPage} de {totalPages || 1}
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