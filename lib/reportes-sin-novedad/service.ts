import type { SinNovedadRow } from './types'
import { obtenerReportesSinNovedad } from './repository'

function toStr(val: unknown) { return String(val ?? '—') }

export async function listarReportesSinNovedad(desde?: string, hasta?: string, busqueda?: string) {
  const rows = await obtenerReportesSinNovedad(desde, hasta, busqueda)
  return rows.map((r: SinNovedadRow) => ({
    reporte:            toStr(r.reporte),
    nombreReportante:   r.nombreReportante ? toStr(r.nombreReportante) : 'ANÓNIMO',
    telefonoReportante: r.nombreReportante ? toStr(r.telefonoReportante) : '—',
    conclusion:         toStr(r.conclusion),
    fecha:              r.fecha instanceof Date
      ? r.fecha.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : toStr(r.fecha),
  }))
}