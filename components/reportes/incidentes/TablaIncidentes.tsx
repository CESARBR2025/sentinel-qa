import { styles } from './styles'

interface Props {
  tipo: string
  data: any[]
}

export function TablaIncidentes({ tipo, data }: Props) {
  // Definición de columnas según el tipo
  const columns = tipo === 'diario' 
    ? ['Fecha', 'Cárcel Municipal', 'Detenidos Fiscalía', 'Detenidos FGR']
    : ['Fecha', 'Cárcel', 'Fisc.', 'Vehíc.', 'Cateo FGE', 'Operativos', 'Cateo FGR', 'FGR', 'A. Fuego', 'A. Blancas', 'Droga', 'Fiestas'];

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col} style={styles.th}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td style={{...styles.td, fontWeight: 600}}>{row.fecha}</td>
              <td style={styles.td}>{row.carcel}</td>
              <td style={styles.td}>{row.fiscalia}</td>
              {tipo === 'diario' ? (
                <td style={styles.td}>{row.fgr}</td>
              ) : (
                <>
                  <td style={styles.td}>{row.vehiculos}</td>
                  <td style={styles.td}>{row.cateo_fge}</td>
                  <td style={styles.td}>{row.operativos}</td>
                  <td style={styles.td}>{row.cateo_fgr}</td>
                  <td style={styles.td}>{row.fgr}</td>
                  <td style={styles.td}>{row.armas_fuego}</td>
                  <td style={styles.td}>{row.armas_blancas}</td>
                  <td style={styles.td}>{row.drogas}</td>
                  <td style={styles.td}>{row.fiestas}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}