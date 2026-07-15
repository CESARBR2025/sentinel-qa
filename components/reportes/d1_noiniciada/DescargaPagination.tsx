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
            background: '#FFFFFF'
        }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                MOSTRANDO {totalRecords === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalRecords)} DE {totalRecords} PENDIENTES
            </div>

            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
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
                    fontFamily: 'JetBrains Mono', fontSize: '11px', 
                    fontWeight: 700, margin: '0 15px', color: '#0F172A',
                    background: '#F1F5F9', padding: '4px 12px', borderRadius: '4px'
                }}>
                    PÁG. {currentPage} / {totalPages || 1}
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