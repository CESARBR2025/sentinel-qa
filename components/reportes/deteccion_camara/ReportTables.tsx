'use client'
import { styles } from './styles'

export function ReportTable({ data }: { data: any[] }) {
  return (
    <div style={styles.tableContainer}>
      <div style={styles.tableHeader}>
        <h3 style={{ fontFamily: 'Barlow Condensed', margin: 0, fontSize: '20px', fontWeight: 700 }}>
          <span style={{ color: '#1f355a', marginRight: '8px' }}>|</span> REGISTROS POR TURNO
        </h3>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1400px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th style={styles.th}>FECHA</th>
              <th style={styles.th}>TURNO</th>
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
            {data.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#F8FAFC' }}>
                <td style={styles.td}><b>{r.fecha}</b></td>
                <td style={styles.td}>
                  <span style={styles.badge(
                    r.turno === 'MATUTINO' ? '#dbdfe5' : r.turno === 'VESPERTINO' ? '#FEF3C7' : '#F3E8FF',
                    r.turno === 'MATUTINO' ? '#172844' : r.turno === 'VESPERTINO' ? '#B45309' : '#6B21A8'
                  )}>{r.turno}</span>
                </td>
                <td style={styles.td}>{r.persSinNovedad}</td>
                <td style={styles.td}>
                  {r.persConAntecedentes > 0
                    ? <span style={styles.badge('#FEE2E2', '#B91C1C')}>{r.persConAntecedentes}</span>
                    : 0}
                </td>
                <td style={styles.td}>{r.vehiculosRevisar}</td>
                <td style={styles.td}>{r.vehiculosRepuve}</td>
                <td style={styles.td}>{r.persecuciones}</td>
                <td style={styles.td}>
                  {r.asegurados > 0
                    ? <span style={styles.badge('#dbdfe5', '#172844')}>{r.asegurados}</span>
                    : 0}
                </td>
                <td style={styles.td}>{r.recuperados}</td>
                <td style={styles.td}>{r.incendios}</td>
                <td style={styles.td}>{r.hechosTransito}</td>
                <td style={styles.td}>{r.motosRevisadas}</td>
                <td style={styles.totalTd}>{r.totalPersonas}</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={13} style={{ ...styles.td, textAlign: 'center', color: '#94A3B8', padding: '40px' }}>
                  Sin registros en el período seleccionado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}