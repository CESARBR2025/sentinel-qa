"use client"
import { useState, useEffect } from 'react'
import { Search, FileDown } from 'lucide-react'
import { styles } from './styles'
import { D1Pagination } from './D1Pagination' // Importamos tu componente

export function D1ReportsTable({ data }: { data: any[] }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Lógica de filtrado
    const filteredData = data.filter(row => 
        Object.values(row).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    )

    // Lógica de paginación
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm])

    return (
        <div style={styles.tableSection}>
            <div style={styles.tableContainer}>
                
                {/* ENCABEZADO DE TABLA (Igual a tu ejemplo de teléfonos) */}
                <div style={styles.tableHeader}>
                    <h3 style={{ fontFamily: 'Barlow Condensed', margin: 0, fontSize: '22px', fontWeight: 700 }}>
                        <span style={{ color: '#2563EB', marginRight: '8px' }}>|</span> REGISTRO OPERATIVO D1
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94A3B8' }} />
                            <input 
                                type="text" placeholder="Buscar..." style={styles.searchInput}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button style={styles.secondaryButton}><FileDown size={14} /> EXCEL</button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Folio D1 / CU</th>
                                <th style={styles.th}>Evento y Delito</th>
                                <th style={styles.th}>Tiempos</th>
                                <th style={styles.th}>Ubicación</th>
                                <th style={styles.th}>Unidad y Personal</th>
                                <th style={styles.th}>Estatus</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, i) => (
                                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#F8FAFC' }}>
                                    <td style={styles.td}>
                                        <div style={styles.monoData}>{item.folio_denuncia}</div>
                                        <div style={{fontSize: '10px', color: '#64748B'}}>CU: {item.folio_cu}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{fontWeight: 700}}>{item.delito}</div>
                                        <span style={styles.badge(item.violencia === 'SI' ? 'danger' : 'neutral')}>
                                            {item.violencia}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={styles.monoData}>{item.fecha_reporte}</div>
                                        <div style={{fontSize: '11px'}}>{item.hora_reporte}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{fontWeight: 600}}>{item.colonia}</div>
                                        <div style={{fontSize: '11px'}}>{item.municipio}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{fontWeight: 600}}>{item.nombre_policia}</div>
                                        <div style={styles.monoData}>CRP: {item.crp}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <span style={styles.badge(item.genero_d1 === 'SI' ? 'success' : 'warning')}>
                                            {item.genero_d1}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Llamamos a la paginación pasándole las props que definimos */}
                <D1Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={filteredData.length}
                    startIndex={startIndex}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    )
}