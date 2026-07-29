import type { Patrulla, PatrullaAsignacion, UnidadConTripulacion } from './types'

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

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null
  const n = Number(val)
  return Number.isFinite(n) ? n : null
}

// Agrupa las filas oficial-por-fila de listarUnidadesConTripulacionRaw() en
// una unidad por patrulla. La primera fila de cada grupo trae la ubicación
// más reciente (el repository ya ordena por ultima_ubicacion_en DESC).
export function agruparUnidadesConTripulacion(rows: Record<string, unknown>[]): UnidadConTripulacion[] {
  const porPatrulla = new Map<string, UnidadConTripulacion>()

  for (const row of rows) {
    const id = String(row.id ?? '')
    if (!porPatrulla.has(id)) {
      porPatrulla.set(id, {
        id,
        numeroUnidad: String(row.numero_unidad ?? ''),
        placas: String(row.placas ?? ''),
        oficiales: [],
        ultimaLat: null,
        ultimaLng: null,
        ultimaUbicacionEn: null,
        ocupada: false,
      })
    }
    const unidad = porPatrulla.get(id)!

    const oficialId = toStr(row.oficial_id)
    if (oficialId) {
      const nombre = [toStr(row.oficial_name), toStr(row.oficial_apellido)].filter(Boolean).join(' ')
      unidad.oficiales.push({ id: oficialId, nombre: nombre || 'Sin nombre', noNomina: toStr(row.no_nomina) })
    }

    if (unidad.ultimaUbicacionEn === null && row.ultima_ubicacion_en) {
      unidad.ultimaLat = toNum(row.ultima_lat)
      unidad.ultimaLng = toNum(row.ultima_lng)
      unidad.ultimaUbicacionEn = toStr(row.ultima_ubicacion_en)
    }
  }

  return Array.from(porPatrulla.values())
}
