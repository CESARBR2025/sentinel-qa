"use client"
import { useState, useEffect } from 'react'
import { Table as TableIcon, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { styles } from '@/components/reportes/modulo_incidentes/styles'

interface PhoneReport {
    folio: string;
    telefono: string;
    fecha: string;
    incidencia: string;
}

export function PhoneReportsTable({ data }: { data: PhoneReport[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // 1. FILTRADO
    const filteredData = data.filter(row => 
        Object.values(row).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // 2. LÓGICA DE PAGINACIÓN
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    return (
        <div style={styles.tableSection}>
            <div style={styles.tableContainer}>
                
                {/* ENCABEZADO */}
                <div style={styles.tableHeader}>
                    <h3 style={{ fontFamily: 'Barlow Condensed', margin: 0, fontSize: '22px', fontWeight: 700 }}>
                        <span style={{ color: '#1f355a', marginRight: '8px' }}>|</span> REGISTRO DE NÚMEROS IDENTIFICADOS
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94A3B8' }} />
                            <input 
                                type="text" placeholder="Buscar número o tipo..." style={styles.searchInput}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* TABLA */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                        <thead style={{ background: '#F8FAFC' }}>
                            <tr>
                                <th style={styles.th}>Folio</th>
                                <th style={styles.th}>Número Telefónico Reportado</th>
                                <th style={styles.th}>Fecha de Reporte</th>
                                <th style={styles.th}>Tipo de Incidencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, i) => (
                                    <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#F8FAFC' }}>
                                        <td style={{...styles.td, fontFamily: 'JetBrains Mono', fontWeight: 600, color: '#64748B'}}>{row.folio}</td>
                                        <td style={{...styles.td, fontWeight: 700, color: '#1f355a', fontSize: '15px'}}>{row.telefono}</td>
                                        <td style={styles.td}>{row.fecha}</td>
                                        <td style={{...styles.td, fontWeight: 600, textTransform: 'uppercase'}}>{row.incidencia}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} style={{...styles.td, textAlign: 'center', padding: '40px'}}>No hay registros disponibles</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PIE DE TABLA / PAGINACIÓN (Basado en tu ejemplo) */}
                <div style={{ 
                    padding: '12px 24px', 
                    borderTop: '1px solid #E2E8F0', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: '#FFFFFF'
                }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#64748B' }}>
                        MOSTRANDO {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} DE {filteredData.length} REGISTROS
                    </div>

                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(1)}
                            style={{ ...styles.secondaryButton, padding: '6px' }}
                        ><ChevronsLeft size={16} /></button>

                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            style={{ ...styles.secondaryButton, padding: '6px' }}
                        ><ChevronLeft size={16} /></button>

                        <span style={{ 
                            fontFamily: 'JetBrains Mono', 
                            fontSize: '12px', 
                            fontWeight: 700, 
                            margin: '0 10px',
                            color: '#0F172A'
                        }}>
                            PÁGINA {currentPage} DE {totalPages || 1}
                        </span>

                        <button 
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            style={{ ...styles.secondaryButton, padding: '6px' }}
                        ><ChevronRight size={16} /></button>

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