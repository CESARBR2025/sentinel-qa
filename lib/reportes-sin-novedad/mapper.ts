import type { SinNovedadRow } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

export { toStr }

export function rowToSinNovedad(row: Record<string, unknown>): SinNovedadRow {
  return {
    reporte: toStr(row.reporte),
    nombreReportante: toStr(row.nombre_reportante),
    telefonoReportante: toStr(row.telefono_reportante),
    conclusion: toStr(row.conclusion),
    fecha: row.fecha ?? null,
  }
}
