import { obtenerReporteDiario, obtenerReporteSemanal } from './repository'

function toNum(v: unknown) { return Number(v ?? 0) }
function toStr(v: unknown) {
  if (v instanceof Date) return v.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return String(v ?? '—')
}

function combinar(ofi: Record<string, unknown>[], inc: Record<string, unknown>[]) {
  const map = new Map<string, Record<string, number>>()
  const keys = ['carcel','fiscalia','fgr','cateo_fge','cateo_fgr','operativos','fiestas','vehiculos','armas_fuego','armas_blancas','drogas']

  for (const r of [...ofi, ...inc]) {
    const fecha = toStr(r.fecha)
    if (!map.has(fecha)) map.set(fecha, Object.fromEntries(keys.map(k => [k, 0])))
    const row = map.get(fecha)!
    for (const k of keys) row[k] += toNum(r[k])
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fecha, vals]) => ({
      fecha,
      carcel:       vals.carcel       ?? 0,
      fiscalia:     vals.fiscalia     ?? 0,
      fgr:          vals.fgr          ?? 0,
      cateo_fge:    vals.cateo_fge    ?? 0,
      cateo_fgr:    vals.cateo_fgr    ?? 0,
      operativos:   vals.operativos   ?? 0,
      fiestas:      vals.fiestas      ?? 0,
      vehiculos:    vals.vehiculos    ?? 0,
      armas_fuego:  vals.armas_fuego  ?? 0,
      armas_blancas: vals.armas_blancas ?? 0,
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