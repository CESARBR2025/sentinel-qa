"use client"
import { useState } from 'react'
import { FileDown, Table as TableIcon, Search } from 'lucide-react'
import { styles } from './styles'

interface OperationalTableProps {
    title: string;
    columns: string[];
    data: any[];
}

export function OperationalTable({ title, columns, data }: OperationalTableProps) {
    const [searchTerm, setSearchTerm] = useState("")

    // Filtra los datos en tiempo real
    const filteredData = data.filter(row => 
        Object.values(row).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    )

    return (
        <div style={styles.tableSection}>
            <div style={styles.tableContainer}>
                <div style={styles.tableHeader}>
                    <h3 style={{ fontFamily: 'Barlow Condensed', margin: 0, fontSize: '22px', fontWeight: 700 }}>
                        <span style={{ color: '#2563EB', marginRight: '8px' }}>|</span> {title}
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={14} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94A3B8' }} />
                            <input 
                                type="text"
                                placeholder="Buscar..."
                                style={styles.searchInput}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button style={styles.secondaryButton}><TableIcon size={14} /> EXCEL</button>
                    </div>
                </div>
                
                {/* ESTO CONTROLA LA "INFESTACION": Altura máxima y scroll */}
                <div style={{ overflowX: 'auto', maxHeight: '450px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#F8FAFC' }}>
                            <tr>
                                {columns.map((col, idx) => (
                                    <th key={idx} style={styles.th}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row, i) => (
                                    <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#F8FAFC' }}>
                                        {Object.values(row).map((val: any, idx) => (
                                            <td key={idx} style={styles.td}>
                                                {val === 'RECUPERADO' ? <span style={styles.badge('#DCFCE7', '#166534')}>{val}</span> :
                                                 val === 'ROBADO' ? <span style={styles.badge('#FEE2E2', '#991B1B')}>{val}</span> : val}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={columns.length} style={{...styles.td, textAlign: 'center', padding: '40px'}}>No hay registros</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}