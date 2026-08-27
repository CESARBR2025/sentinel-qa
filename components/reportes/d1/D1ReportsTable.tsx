"use client"
import { useState } from 'react'
import { Search } from 'lucide-react'
import { styles } from './styles'
import { D1Pagination } from './D1Pagination' // Importamos tu componente

type TableRow = Record<string, string | number | boolean | null | undefined>

export function D1ReportsTable({ data }: { data: TableRow[] }) {
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

    const handleSearch = (term: string) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }

    return (
        <div style={styles.tableSection}>
            <div style={styles.tableContainer}>

                {/* ENCABEZADO DE TABLA */}
                <div style={styles.tableHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 3, height: 16, background: '#1f355a', borderRadius: 'var(--radius-full)', flexShrink: 0 }} />
                        <h3 style={{ fontFamily: 'var(--apple-font-display)', margin: 0, fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>
                            Registro operativo D1
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

                <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Folio / IPH</th>
                                <th style={styles.th}>Incidente / delito</th>
                                <th style={styles.th}>Fecha y hora</th>
                                <th style={styles.th}>Ubicación</th>
                                <th style={styles.th}>Personal</th>
                                <th style={styles.th}>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, i) => (
                                <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#F8FAFC' }}>
                                    <td style={styles.td}>
                                        <div style={{ fontFamily: 'var(--apple-font-display)', fontWeight: 700, fontSize: 13 }}>{item.folioDenuncia}</div>
                                        {item.iph !== '—' && <div style={{ fontSize: 10, color: '#64748B' }}>IPH: {item.iph}</div>}
                                        {item.folioCu !== '—' && <div style={{ fontSize: 10, color: '#64748B' }}>CU: {item.folioCu}</div>}
                                        {item.folioSija !== '—' && <div style={{ fontSize: 10, color: '#64748B' }}>SIJA: {item.folioSija}</div>}
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ fontWeight: 600, fontSize: 12 }}>{item.tipoIncidente !== '—' ? item.tipoIncidente : item.tipoEvento}</div>
                                        <div style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{item.delito}</div>
                                        {item.violencia && (
                                            <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontFamily: 'var(--apple-font-display)', fontWeight: 500 }}>
                                                Con violencia
                                            </span>
                                        )}
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12 }}>{item.fechaReporte}</div>
                                        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, color: '#64748B' }}>{item.horaReporte}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ fontWeight: 600, fontSize: 12 }}>{item.coloniaHecho}</div>
                                        <div style={{ fontSize: 11, color: '#64748B' }}>{item.lugarHecho}</div>
                                        <div style={{ fontSize: 10, color: '#94A3B8' }}>{item.municipio}</div>
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ fontWeight: 600, fontSize: 12 }}>{item.policiaACargo}</div>
                                        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 11, color: '#64748B' }}>CRP: {item.crp}</div>
                                        {item.oficialNombre !== '—' && <div style={{ fontSize: 10, color: '#94A3B8' }}>{item.oficialNombre}</div>}
                                    </td>
                                    <td style={styles.td}>
                                        <span style={{ background: item.estadoTramite === 'RECIBIDA' ? '#dbdfe5' : item.estadoTramite === 'EN_PROCESO' ? '#FEF3C7' : '#DCFCE7', color: item.estadoTramite === 'RECIBIDA' ? '#1c3051' : item.estadoTramite === 'EN_PROCESO' ? '#B45309' : '#15803D', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontFamily: 'var(--apple-font-display)', fontWeight: 500, display: 'inline-block', marginBottom: 4 }}>
                                            {item.estadoTramite}
                                        </span>
                                        {item.seGeneroD1 && (
                                            <span style={{ background: '#DCFCE7', color: '#15803D', padding: '2px 10px', borderRadius: 'var(--radius-full)', fontSize: 11, fontFamily: 'var(--apple-font-display)', fontWeight: 500 }}>
                                                D1 generada
                                            </span>
                                        )}
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