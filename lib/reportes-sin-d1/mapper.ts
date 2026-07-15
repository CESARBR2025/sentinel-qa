import type { SinD1Row } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

export { toStr }

export function rowToSinD1(row: Record<string, unknown>): SinD1Row {
  return {
    folio: toStr(row.folio),
    fecha: row.fecha ?? null,
    nombreAfectado: toStr(row.nombre_afectado),
    telefono: toStr(row.telefono),
  }
}
