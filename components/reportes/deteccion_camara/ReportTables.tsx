'use client'
import { styles } from './styles'

type TableRow = Record<string, string | number | boolean | null | undefined>

export function ReportTable({ data }: { data: TableRow[] }) {
  return (
    <div style={styles.tableContainer}>
      <div style={styles.tableHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 3, height: 16, background: '#1f355a', borderRadius: 'var(--radius-full)', flexShrink: 0 }} />
          <h3 style={{ fontFamily: 'var(--apple-font-display)', margin: 0, fontSize: '18px', fontWeight: 600, color: '#0f172a' }}>
            Registros por turno
          </h3>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1400px' }}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Turno</th>
              <th style={styles.th}>Pers. s/n</th>
              <th style={styles.th}>Pers. c/a</th>
              <th style={styles.th}>Veh. revisión</th>
              <th style={styles.th}>Veh. repuve</th>
              <th style={styles.th}>Persec.</th>
              <th style={styles.th}>Aseg.</th>
              <th style={styles.th}>Recup.</th>
              <th style={styles.th}>Incendio</th>
              <th style={styles.th}>H. tránsito</th>
              <th style={styles.th}>Motos</th>
              <th style={styles.totalTh}>Total pers.</th>
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
                  {Number(r.persConAntecedentes) > 0
                    ? <span style={styles.badge('#FEE2E2', '#B91C1C')}>{r.persConAntecedentes}</span>
                    : 0}
                </td>
                <td style={styles.td}>{r.vehiculosRevisar}</td>
                <td style={styles.td}>{r.vehiculosRepuve}</td>
                <td style={styles.td}>{r.persecuciones}</td>
                <td style={styles.td}>
                  {Number(r.asegurados) > 0
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