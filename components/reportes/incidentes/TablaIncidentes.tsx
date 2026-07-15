import { styles } from './styles'

interface RowData {
  fecha: string
  carcel: number
  fiscalia: number
  fgr: number
  vehiculos?: number
  cateo_fge?: number
  operativos?: number
  cateo_fgr?: number
  armas_fuego?: number
  armas_blancas?: number
  drogas?: number
  fiestas?: number
}

interface Props {
  tipo: string
  data: RowData[]
}

export function TablaIncidentes({ tipo, data }: Props) {
  // 1. Definición estricta de columnas
  // Si tipo es 'semanal', mostramos las 12 columnas. Si no, solo las 4 de diario.
  const columns = tipo === 'semanal' 
    ? [
        'Fecha', 
        'Cárcel', 
        'Fisc.', 
        'Vehíc. Recup', 
        'Cateo FGE', 
        'Operativos', 
        'Cateo FGR', 
        'FGR', 
        'A. Fuego', 
        'A. Blancas', 
        'Droga', 
        'Fiestas'
      ]
    : ['Fecha', 'Cárcel Municipal', 'Detenidos Fiscalía', 'Detenidos FGR'];

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr style={{ background: '#F8FAFC' }}>
            {columns.map((col, index) => (
              <th key={index} style={styles.th}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i}>
                {/* COMÚN: Fecha, Cárcel y Fiscalía siempre van primero */}
                <td style={{ ...styles.td, fontWeight: 600 }}>{row.fecha}</td>
                <td style={styles.td}>{row.carcel}</td>
                <td style={styles.td}>{row.fiscalia}</td>
                
                {/* CONDICIONAL: Según el tipo de reporte */}
                {tipo === 'semanal' ? (
                  <>
                    <td style={styles.td}>{row.vehiculos ?? 0}</td>
                    <td style={styles.td}>{row.cateo_fge ?? 0}</td>
                    <td style={styles.td}>{row.operativos ?? 0}</td>
                    <td style={styles.td}>{row.cateo_fgr ?? 0}</td>
                    <td style={styles.td}>{row.fgr ?? 0}</td>
                    <td style={styles.td}>{row.armas_fuego ?? 0}</td>
                    <td style={styles.td}>{row.armas_blancas ?? 0}</td>
                    <td style={styles.td}>{row.drogas ?? 0}</td>
                    <td style={styles.td}>{row.fiestas ?? 0}</td>
                  </>
                ) : (
                  /* EN DIARIO: La cuarta columna es FGR */
                  <td style={styles.td}>{row.fgr}</td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ ...styles.td, textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                No hay registros para mostrar en este periodo.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}