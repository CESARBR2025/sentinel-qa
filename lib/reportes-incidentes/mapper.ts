import type { ReporteDiarioRow, ReporteSemanalRow } from './types'

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

export { toNum }

export function rowToReporteDiario(row: Record<string, unknown>): ReporteDiarioRow {
  return {
    fecha: row.fecha ?? null,
    carcel: toNum(row.carcel),
    fiscalia: toNum(row.fiscalia),
    fgr: toNum(row.fgr),
  }
}

export function rowToReporteSemanal(row: Record<string, unknown>): ReporteSemanalRow {
  return {
    fecha: row.fecha ?? null,
    carcel: toNum(row.carcel),
    fiscalia: toNum(row.fiscalia),
    cateoFge: toNum(row.cateo_fge),
    cateoFgr: toNum(row.cateo_fgr),
    operativos: toNum(row.operativos),
    fiestas: toNum(row.fiestas),
    vehiculos: toNum(row.vehiculos),
    armasFuego: toNum(row.armas_fuego),
    armasBlancas: toNum(row.armas_blancas),
    drogas: toNum(row.drogas),
    fgr: toNum(row.fgr),
  }
}
