import type { Patrulla, PatrullaAsignacion } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  return String(val)
}

function toBool(val: unknown): boolean {
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') return val === 'true'
  return Boolean(val)
}

export function rowToPatrulla(row: Record<string, unknown>): Patrulla {
  return {
    id: String(row.id ?? ''),
    numeroUnidad: String(row.numero_unidad ?? ''),
    placas: String(row.placas ?? ''),
    descripcion: String(row.descripcion ?? ''),
    activo: toBool(row.activo),
    sincronizadoEn: toStr(row.sincronizado_en) ?? '',
  }
}

export function rowToPatrullaAsignacion(row: Record<string, unknown>): PatrullaAsignacion {
  return {
    id: String(row.id ?? ''),
    numeroUnidad: String(row.numero_unidad ?? ''),
    placas: String(row.placas ?? ''),
    descripcion: String(row.descripcion ?? ''),
  }
}
