import type { PatrullaCatalogo } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  const s = String(val)
  return s.length ? s : null
}

export function rowToPatrullaCatalogo(row: Record<string, unknown>): PatrullaCatalogo {
  return {
    id: String(row.id ?? ''),
    placa: toStr(row.placa),
    numSerie: String(row.num_serie ?? ''),
    departamento: toStr(row.departamento),
    caracteristicas: toStr(row.caracteristicas),
    marca: toStr(row.marca),
    modelo: toStr(row.modelo),
    gps: toStr(row.gps),
    radio: toStr(row.radio),
    camaras: toStr(row.camaras),
    activo: Boolean(row.activo),
    sincronizadoEn: toStr(row.sincronizado_en),
  }
}
