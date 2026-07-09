import type { IncidenteCamara, TotalesCamara } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

function toNum(val: unknown): number {
  if (val === null || val === undefined) return 0
  const n = Number(val)
  return isNaN(n) ? 0 : n
}

function toNumNullable(val: unknown): number | null {
  if (val === null || val === undefined) return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

export function rowToIncidenteCamara(row: Record<string, unknown>): IncidenteCamara {
  return {
    id: String(row.id ?? ''),
    fecha: toStr(row.fecha),
    turno: toStr(row.turno),
    personasSinNovedad: toNum(row.personas_sin_novedad),
    conAntecedentes: toNum(row.personas_con_antecedentes),
    vehiculosRevisar: toNum(row.vehiculos_revisar),
    vehiculosRepuve: toNum(row.vehiculos_repuve),
    persecuciones: toNum(row.persecuciones),
    asegurados: toNum(row.asegurados_camara),
    recuperados: toNum(row.vehiculos_recuperados),
    incendios: toNum(row.incendios),
    hechosTransito: toNum(row.hechos_transito),
    motosRevisadas: toNum(row.motos_revisadas),
    totalPersonasRevisadas: toNum(row.total_personas_revisadas),
    registradoPor: toStr(row.registrado_por),
    createdAt: toStr(row.created_at),
  }
}

export function rowToTotalesCamara(row: Record<string, unknown>): TotalesCamara {
  return {
    totalSinNovedad: toNumNullable(row.total_sin_novedad),
    totalConAntecedentes: toNumNullable(row.total_con_antecedentes),
    totalVehiculos: toNumNullable(row.total_vehiculos),
    totalPersecuciones: toNumNullable(row.total_persecuciones),
    totalAsegurados: toNumNullable(row.total_asegurados),
    totalRecuperados: toNumNullable(row.total_recuperados),
    totalPersonas: toNumNullable(row.total_personas),
  }
}
