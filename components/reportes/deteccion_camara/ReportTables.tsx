import { styles } from './styles'

interface ReportTableProps {
    data: any // Aquí puedes tipar mejor según tu getReportData
}

export function ReportTable({ data }: ReportTableProps) {
    return (
        <div style={styles.tableContainer}>
            <div style={styles.tableHeader}>
                <h3 style={{ fontFamily: 'Barlow Condensed', margin: 0, fontSize: '20px', fontWeight: 700 }}>
                    <span style={{ color: '#2563EB', marginRight: '8px' }}>|</span> REGISTROS POR TURNO
                </h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1400px' }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC' }}>
                            <th style={styles.th}>FECHA</th>
                            <th style={styles.th}>PERS. S/N</th>
                            <th style={styles.th}>PERS. C/A</th>
                            <th style={styles.th}>VEH. REVISIÓN</th>
                            <th style={styles.th}>VEH. REPUVE</th>
                            <th style={styles.th}>PERSEC.</th>
                            <th style={styles.th}>ASEG.</th>
                            <th style={styles.th}>RECUP.</th>
                            <th style={styles.th}>INCENDIO</th>
                            <th style={styles.th}>H. TRÁNSITO</th>
                            <th style={styles.th}>MOTOS</th>
                            <th style={styles.totalTh}>TOTAL PERS.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3].map((i) => (
                            <tr key={i}>
                                <td style={styles.td}><b>24/05/2024</b></td>
                                <td style={styles.td}>{data.persSinNovedad / 30}</td>
                                <td style={styles.td}>
                                    <span style={styles.badge('#FEE2E2', '#B91C1C')}>02</span>
                                </td>
                                <td style={styles.td}>12</td>
                                <td style={styles.td}>45</td>
                                <td style={styles.td}>0</td>
                                <td style={styles.td}>
                                    <span style={styles.badge('#DBEAFE', '#1E40AF')}>01</span>
                                </td>
                                <td style={styles.td}>1</td>
                                <td style={styles.td}>0</td>
                                <td style={styles.td}>2</td>
                                <td style={styles.td}>15</td>
                                <td style={styles.totalTd}>142</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}