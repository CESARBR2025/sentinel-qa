import { obtenerReportesSinNovedad } from './repository'

function toStr(val: unknown) { return String(val ?? '—') }

export async function listarReportesSinNovedad(desde?: string, hasta?: string, busqueda?: string) {
  const rows = await obtenerReportesSinNovedad(desde, hasta, busqueda)
  return rows.map(r => ({
    reporte:            toStr(r.reporte),
    nombreReportante:   r.nombre_reportante ? toStr(r.nombre_reportante) : 'ANÓNIMO',
    telefonoReportante: r.nombre_reportante ? toStr(r.telefono_reportante) : '—',
    conclusion:         toStr(r.conclusion),
    fecha:              r.fecha instanceof Date
      ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : toStr(r.fecha),
  }))
}