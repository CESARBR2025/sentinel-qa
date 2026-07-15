// components/911/Pagination.tsx
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    totalCount: number;
    pageSize: number;
}

export function Pagination({ currentPage, totalPages, baseUrl, totalCount, pageSize }: PaginationProps) {
    // Calcular rango de registros mostrados
    const startRange = (currentPage - 1) * pageSize + 1;
    const endRange = Math.min(currentPage * pageSize, totalCount);

    // Generar array de números de página para mostrar
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    // Determinar separador para query params
    const qs = (pageNum: number) => {
        const sep = baseUrl.includes('?') ? '&' : '?'
        return `${baseUrl}${sep}page=${pageNum}`
    }

    const pages = getPageNumbers();

    return (
        <div style={containerStyle}>
            {/* ESTILOS HOVER PARA LOS BOTONES */}
            <style>{`
                .pg-btn { transition: all 0.2s ease; border: 1px solid #e2e8f0; background: white; color: #64748b; }
                .pg-btn:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
                .pg-btn-active { background: #0f172a !important; border-color: #0f172a !important; color: white !important; }
                .pg-btn-disabled { opacity: 0.3; cursor: not-allowed; pointer-events: none; }
            `}</style>

            {/* INFO IZQUIERDA */}
            <div style={infoStyle}>
                <span style={labelStyle}>MOSTRANDO</span>
                <span style={valueStyle}>{totalCount === 0 ? 0 : `${startRange}-${endRange}`}</span>
                <span style={labelStyle}>DE</span>
                <span style={valueStyle}>{totalCount}</span>
                <span style={labelStyle}>REGISTROS</span>
            </div>

            {/* CONTROLES DERECHA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {/* Primera Página */}
                <Link href={qs(1)} 
                      className={`pg-btn ${currentPage === 1 ? 'pg-btn-disabled' : ''}`}
                      style={arrowBtnStyle}>
                    <ChevronsLeft size={14} />
                </Link>

                {/* Anterior */}
                <Link href={qs(currentPage - 1)} 
                      className={`pg-btn ${currentPage === 1 ? 'pg-btn-disabled' : ''}`}
                      style={arrowBtnStyle}>
                    <ChevronLeft size={14} />
                </Link>

                {/* Números */}
                <div style={{ display: 'flex', gap: '4px', margin: '0 8px' }}>
                    {pages.map(p => (
                        <Link 
                            key={p}
                            href={qs(p)}
                            className={`pg-btn ${currentPage === p ? 'pg-btn-active' : ''}`}
                            style={pageNumberStyle}
                        >
                            {p.toString().padStart(2, '0')}
                        </Link>
                    ))}
                </div>

                {/* Siguiente */}
                <Link href={qs(currentPage + 1)} 
                      className={`pg-btn ${currentPage === totalPages ? 'pg-btn-disabled' : ''}`}
                      style={arrowBtnStyle}>
                    <ChevronRight size={14} />
                </Link>

                {/* Última Página */}
                <Link href={qs(totalPages)} 
                      className={`pg-btn ${currentPage === totalPages ? 'pg-btn-disabled' : ''}`}
                      style={arrowBtnStyle}>
                    <ChevronsRight size={14} />
                </Link>
            </div>
        </div>
    );
}

// ESTILOS
const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px dashed #e2e8f0',
};

const infoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '10px',
    letterSpacing: '0.05em'
};

const labelStyle: React.CSSProperties = { color: '#94a3b8' };
const valueStyle: React.CSSProperties = { color: '#0f172a', fontWeight: 700 };

const arrowBtnStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    borderRadius: '2px',
};

const pageNumberStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '2px',
};