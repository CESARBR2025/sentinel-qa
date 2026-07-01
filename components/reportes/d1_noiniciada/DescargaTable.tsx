'use client';
import { useState } from 'react';
import { User, Smartphone, ClipboardList } from 'lucide-react';
import { styles } from './styles';
import { DescargaPagination } from './DescargaPagination';

export const DescargaTable = ({ data }: { data: any[] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalRecords = data.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div style={styles.tableSection}>
            <div style={styles.tableContainer}>
                <table style={{ ...styles.table, minWidth: '100%' }}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Folio Temporal</th>
                            <th style={styles.th}>Fecha de Registro</th>
                            <th style={styles.th}>Nombre del Afectado</th>
                            <th style={styles.th}>Teléfono de Contacto</th>
                            <th style={styles.th}>Documentación Validada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, i) => (
                            <tr key={i}>
                                <td style={styles.td}>
                                    <span style={{ ...styles.monoData, color: '#2563EB' }}>{item.folio}</span>
                                </td>
                                <td style={styles.td}>{item.fecha}</td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <User size={14} color="#64748B" />
                                        <span style={{ fontWeight: 600, textTransform: 'uppercase' }}>{item.nombre_afectado}</span>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Smartphone size={14} color="#64748B" />
                                        <span style={styles.monoData}>{item.telefono}</span>
                                    </div>
                                </td>
                                <td style={styles.td}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <ClipboardList size={14} color="#64748B" />
                                        {item.documentacion}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <DescargaPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    startIndex={startIndex}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    );
};