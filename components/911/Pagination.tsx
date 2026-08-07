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
    const startRange = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endRange = Math.min(currentPage * pageSize, totalCount);

    // Generar array de números de página para mostrar (máx. 5 visibles)
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    };

    const qs = (pageNum: number) => {
        const sep = baseUrl.includes('?') ? '&' : '?'
        return `${baseUrl}${sep}page=${pageNum}`
    }

    const pages = getPageNumbers();
    const sinDatos = totalCount === 0;
    const mostrarControles = totalPages > 1 && !sinDatos;

    return (
        <div className="pg911">
            <style>{`
                .pg911 {
                    display: flex; align-items: center; justify-content: space-between; gap: 16px;
                    flex-wrap: wrap; padding: 18px 24px; margin-top: 4px;
                    border-top: 1px solid #e2e8f0;
                    font-family: var(--apple-font-display);
                }
                @media (max-width: 720px) {
                    .pg911 { flex-direction: column; align-items: flex-start; padding: 14px 16px; gap: 12px; }
                }

                .pg911-info { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #94a3b8; }
                .pg911-info b { color: #0f172a; font-weight: 600; font-variant-numeric: tabular-nums; }

                .pg911-controls { display: flex; align-items: center; gap: 6px; }
                .pg911-nums { display: flex; align-items: center; gap: 6px; }

                .pg911-btn {
                    min-width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center;
                    border: 1px solid #e2e8f0; background: #fff; color: #475569; border-radius: var(--radius-md);
                    font-family: var(--apple-font-display); font-size: 12px; font-weight: 600; text-decoration: none;
                    transition: all .2s ease;
                }
                .pg911-btn:hover { border-color: #1f355a; color: #1f355a; background: rgba(31,53,90,0.05); }
                .pg911-btn:active { transform: scale(0.96); }
                .pg911-btn-active { background: #1f355a; border-color: #1f355a; color: #fff; box-shadow: 0 3px 10px rgba(31,53,90,0.3); }
                .pg911-btn-active:hover { background: #1f355a; border-color: #1f355a; color: #fff; }
                .pg911-btn-disabled { opacity: 0.35; cursor: not-allowed; pointer-events: none; }

                @media (max-width: 480px) {
                    .pg911-info { width: 100%; }
                    .pg911-controls { width: 100%; justify-content: space-between; }
                }
            `}</style>

            {/* Info registros */}
            <div className="pg911-info">
                {sinDatos ? (
                    <span>Sin registros</span>
                ) : (
                    <>
                        <span>Mostrando</span>
                        <b>{startRange}–{endRange}</b>
                        <span>de</span>
                        <b>{totalCount}</b>
                        <span>registros</span>
                    </>
                )}
            </div>

            {/* Controles */}
            {mostrarControles && (
                <div className="pg911-controls">
                    {/* Primera Página */}
                    <Link
                        href={qs(1)}
                        className={`pg911-btn ${currentPage === 1 ? 'pg911-btn-disabled' : ''}`}
                        aria-label="Primera página"
                    >
                        <ChevronsLeft size={14} />
                    </Link>

                    {/* Anterior */}
                    <Link
                        href={qs(currentPage - 1)}
                        className={`pg911-btn ${currentPage === 1 ? 'pg911-btn-disabled' : ''}`}
                        aria-label="Página anterior"
                    >
                        <ChevronLeft size={14} />
                    </Link>

                    {/* Números */}
                    <div className="pg911-nums">
                        {pages.map(p => (
                            <Link
                                key={p}
                                href={qs(p)}
                                className={`pg911-btn ${currentPage === p ? 'pg911-btn-active' : ''}`}
                                aria-label={`Ir a la página ${p}`}
                                aria-current={currentPage === p ? 'page' : undefined}
                            >
                                {p}
                            </Link>
                        ))}
                    </div>

                    {/* Siguiente */}
                    <Link
                        href={qs(currentPage + 1)}
                        className={`pg911-btn ${currentPage === totalPages ? 'pg911-btn-disabled' : ''}`}
                        aria-label="Página siguiente"
                    >
                        <ChevronRight size={14} />
                    </Link>

                    {/* Última Página */}
                    <Link
                        href={qs(totalPages)}
                        className={`pg911-btn ${currentPage === totalPages ? 'pg911-btn-disabled' : ''}`}
                        aria-label="Última página"
                    >
                        <ChevronsRight size={14} />
                    </Link>
                </div>
            )}
        </div>
    );
}
