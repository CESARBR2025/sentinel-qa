import type { ReporteIncidenteCombinado } from './types'
import { obtenerReporteDiario, obtenerReporteSemanal } from './repository'

function toNum(v: unknown) { return Number(v ?? 0) }
function toStr(v: unknown) {
  if (v instanceof Date) return v.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return String(v ?? '—')
}

const COMBO_KEYS: (keyof ReporteIncidenteCombinado)[] = ['carcel','fiscalia','fgr','cateoFge','cateoFgr','operativos','fiestas','vehiculos','armasFuego','armasBlancas','drogas']

function combinar(ofi: any[], inc: any[]) {
  const map = new Map<string, Record<string, number>>()

  for (const r of [...ofi, ...inc]) {
    const fecha = toStr(r.fecha)
    if (!map.has(fecha)) map.set(fecha, Object.fromEntries(COMBO_KEYS.map(k => [k, 0])))
    const row = map.get(fecha)!
    for (const k of COMBO_KEYS) row[k] += toNum(r[k])
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, vals]): ReporteIncidenteCombinado => ({
      fecha,
      carcel:       vals.carcel       ?? 0,
      fiscalia:     vals.fiscalia     ?? 0,
      fgr:          vals.fgr          ?? 0,
      cateoFge:     vals.cateoFge    ?? 0,
      cateoFgr:     vals.cateoFgr    ?? 0,
      operativos:   vals.operativos   ?? 0,
      fiestas:      vals.fiestas      ?? 0,
      vehiculos:    vals.vehiculos    ?? 0,
      armasFuego:   vals.armasFuego  ?? 0,
      armasBlancas: vals.armasBlancas ?? 0,
      drogas:       vals.drogas       ?? 0,
    }))
}

export async function listarReporteDiario(desde?: string, hasta?: string) {
  const d = desde ?? new Date().toISOString().split('T')[0]
  const h = hasta  ?? d
  const { ofi, inc } = await obtenerReporteDiario(d, h)
  return combinar(ofi, inc)
}

export async function listarReporteSemanal(desde?: string, hasta?: string) {
  const d = desde ?? new Date().toISOString().split('T')[0]
  const h = hasta  ?? d
  const { ofi, inc } = await obtenerReporteSemanal(d, h)
  return combinar(ofi, inc)
}