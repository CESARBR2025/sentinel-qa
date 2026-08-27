"use client"
import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { styles } from './styles'

interface OperationalTableProps {
    title: string;
    columns: string[];
    data: Record<string, string | number | boolean | null | undefined>[];
}

export function OperationalTable({ title, columns, data }: OperationalTableProps) {
    // ESTADOS PARA BÚSQUEDA Y PAGINACIÓN
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10 // Puedes cambiar este número a 25 o 50

    // 1. FILTRADO
    const filteredData = data.filter(row => 
        Object.values(row).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // 2. LÓGICA DE PAGINACIÓN
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

    const handleSearch = (term: string) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }

    return (
        <div style={styles.tableSection}>
            <div style={styles.tableContainer}>
                
                {/* ENCABEZADO */}
                <div style={styles.tableHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 3, height: 16, background: '#1f355a', borderRadius: 'var(--radius-full)', flexShrink: 0 }} />
                        <h3 style={{ fontFamily: 'var(--apple-font-display)', margin: 0, fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>
                            {title}
                        </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94A3B8' }} />
                            <input 
                                type="text" placeholder="Buscar..." style={styles.searchInput}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* TABLA */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                        <thead style={{ background: '#F8FAFC' }}>
                            <tr>
                                {columns.map((col, idx) => (<th key={idx} style={styles.th}>{col}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, i) => (
                                    <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#F8FAFC' }}>
                                        {Object.values(row).map((val, idx) => (
                                            <td key={idx} style={styles.td}>
                                                {val === 'RECUPERADO' || val === 'ACTIVA' ? <span style={styles.badge('#DCFCE7', '#166534')}>{val}</span> :
                                                 val === 'ROBADO' || val === 'PENDIENTE' ? <span style={styles.badge('#FEE2E2', '#991B1B')}>{val}</span> : val}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={columns.length} style={{...styles.td, textAlign: 'center', padding: '40px'}}>No hay registros disponibles</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PIE DE TABLA / PAGINACIÓN */}
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
                    <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: '12px', color: '#64748B' }}>
                        Mostrando {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} registros
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {/* Botón Ir al Inicio */}
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(1)}
                            style={{ ...styles.secondaryButton, padding: '6px' }}
                        ><ChevronsLeft size={16} /></button>

                        {/* Botón Anterior */}
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            style={{ ...styles.secondaryButton, padding: '6px' }}
                        ><ChevronLeft size={16} /></button>

                        <span style={{
                            fontFamily: 'var(--apple-font-display)',
                            fontSize: '12px',
                            fontWeight: 600,
                            margin: '0 10px',
                            color: '#0F172A'
                        }}>
                            Página {currentPage} de {totalPages || 1}
                        </span>

                        {/* Botón Siguiente */}
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            style={{ ...styles.secondaryButton, padding: '6px' }}
                        ><ChevronRight size={16} /></button>

                        {/* Botón Ir al Final */}
                        <button
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(totalPages)}
                            style={{ ...styles.secondaryButton, padding: '6px' }}
                        ><ChevronsRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}