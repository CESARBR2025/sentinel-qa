'use client'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { styles } from './styles';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    startIndex: number;
    itemsPerPage: number;
}

export function Pagination({ 
    currentPage, 
    totalPages, 
    totalRecords, 
    startIndex, 
    itemsPerPage 
}: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Función para cambiar de página a través de la URL
    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const navButtonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px',
        background: '#FFFFFF',
        color: '#0F172A',
        border: '1px solid #CBD5E1',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    return (
        <div style={{ 
            padding: '12px 24px', border: '1px solid #E2E8F0', borderTop: 'none',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF'
        }}>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#64748B' }}>
                MOSTRANDO {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalRecords)} DE {totalRecords} REGISTROS
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                    style={currentPage === 1 ? { ...navButtonStyle, opacity: 0.4 } : navButtonStyle}
                ><ChevronsLeft size={16} /></button>

                <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    style={currentPage === 1 ? { ...navButtonStyle, opacity: 0.4 } : navButtonStyle}
                ><ChevronLeft size={16} /></button>

                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 700, margin: '0 12px' }}>
                    PÁGINA <span style={{ color: '#1f355a' }}>{currentPage}</span> DE {totalPages || 1}
                </span>

                <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    style={currentPage === totalPages ? { ...navButtonStyle, opacity: 0.4 } : navButtonStyle}
                ><ChevronRight size={16} /></button>

                <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    style={currentPage === totalPages ? { ...navButtonStyle, opacity: 0.4 } : navButtonStyle}
                ><ChevronsRight size={16} /></button>
            </div>
        </div>
    );
}