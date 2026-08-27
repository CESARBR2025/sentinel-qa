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

export function DescargaPagination({ 
    currentPage, totalPages, totalRecords, startIndex, itemsPerPage, onPageChange 
}: PaginationProps) {
    return (
        <div style={{ 
            padding: '12px 24px', 
            borderTop: '1px solid #E2E8F0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            background: '#FFFFFF',
            flexWrap: 'wrap',
            gap: 12
        }}>
            <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Mostrando {totalRecords === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalRecords)} de {totalRecords} pendientes
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button 
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(1)}
                    style={{ ...styles.secondaryButton, padding: '6px', opacity: currentPage === 1 ? 0.5 : 1 }}
                ><ChevronsLeft size={14} /></button>

                <button 
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    style={{ ...styles.secondaryButton, padding: '6px', opacity: currentPage === 1 ? 0.5 : 1 }}
                ><ChevronLeft size={14} /></button>

                <div style={{ 
                    fontFamily: 'var(--apple-font-display)', fontSize: '12px', 
                    fontWeight: 600, margin: '0 12px', color: '#0F172A',
                    background: '#F1F5F9', padding: '4px 12px', borderRadius: 'var(--radius-md)'
                }}>
                    Pág. {currentPage} / {totalPages || 1}
                </div>

                <button 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(currentPage + 1)}
                    style={{ ...styles.secondaryButton, padding: '6px', opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1 }}
                ><ChevronRight size={14} /></button>

                <button 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(totalPages)}
                    style={{ ...styles.secondaryButton, padding: '6px', opacity: (currentPage === totalPages || totalPages === 0) ? 0.5 : 1 }}
                ><ChevronsRight size={14} /></button>
            </div>
        </div>
    );
}