'use client';
import { useState } from 'react'; // <--- Importante
import { User, Smartphone, FileText, CheckCircle } from 'lucide-react';
import { styles } from './styles';
import { PaginacionSinRobos } from './PaginacionSinRobos'; // <--- El que acabamos de crear

type TableRow = Record<string, string | number | boolean | null | undefined>

export const TablaReportesLimpios = ({ data }: { data: TableRow[] }) => {
    // LOGICA DE PAGINACION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 
    
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div style={styles.tableSection}>
            <div style={styles.tableContainer}>
                {/* Header de la tabla */}
                <div style={{ ...styles.tableHeader, background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={16} color="#10B981" />
                        <span style={styles.tag}>Registros sin novedad confirmada</span>
                    </div>
                    <span style={styles.badge('#dbdfe5', '#1f355a')}>Centinela verificado</span>
                </div>

                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Folio</th>
                            <th style={styles.th}>Fecha</th>
                            <th style={styles.th}>Reportante</th>
                            <th style={styles.th}>Teléfono</th>
                            <th style={styles.th}>Conclusión</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, i) => (
                            <tr key={i}>
                                <td style={styles.td}>
                                    <span style={styles.monoDataBlue}>#{item.reporte}</span>
                                </td>
                                <td style={styles.td}>{item.fecha}</td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={14} color="#64748B" />
                                        <span style={{ fontWeight: 600 }}>{item.nombreReportante}</span>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Smartphone size={14} color="#1f355a" />
                                        <span style={styles.monoDataBlue}>{item.telefonoReportante}</span>
                                    </div>
                                </td>
                                <td style={{ ...styles.td, maxWidth: '280px' }}>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        <FileText size={14} color="#94A3B8" />
                                        <span style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4' }}>
                                            {String(item.conclusion ?? '').substring(0, 50)}...
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* LA PAGINACION NUEVA */}
                <PaginacionSinRobos 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalResults={data.length}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};