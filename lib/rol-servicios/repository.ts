import { query } from '@/lib/db'
import {
  rowToBodyCam, rowToEstadoFuerzaConcepto, rowToMedioCanalizacion, rowToRadio,
  rowToRolAsignacion, rowToRolEstadoFuerza, rowToRolObservacion,
  rowToRolServicio, rowToSector, rowToTipoEmergencia, rowToTipoObservacion,
} from './mapper'
import type {
  BodyCam, EstadoFuerzaConcepto, MedioCanalizacion, Radio, RolAsignacion,
  RolEstadoFuerza, RolObservacion, RolServicio, Sector,
  TipoEmergencia, TipoObservacion,
} from './types'

export async function getRolById(id: string): Promise<RolServicio | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM roles_servicio WHERE id = $1 LIMIT 1`,
    [id],
  )
  return result.rows.length ? rowToRolServicio(result.rows[0]) : null
}

export async function getAsignacionesByRolId(rolId: string): Promise<RolAsignacion[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM rol_asignaciones WHERE rol_id = $1 ORDER BY orden`,
    [rolId],
  )
  return result.rows.map(rowToRolAsignacion)
}

export async function getEstadoFuerzaByRolId(rolId: string): Promise<RolEstadoFuerza[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM rol_estado_fuerza WHERE rol_id = $1`,
    [rolId],
  )
  return result.rows.map(rowToRolEstadoFuerza)
}

export async function getObservacionesByRolId(rolId: string): Promise<RolObservacion[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM rol_observaciones WHERE rol_id = $1`,
    [rolId],
  )
  return result.rows.map(rowToRolObservacion)
}

export async function getSectores(): Promise<Sector[]> {
  const result = await query<Record<string, unknown>>(`SELECT * FROM cat_sectores ORDER BY nombre`)
  return result.rows.map(rowToSector)
}

export async function getRadios(): Promise<Radio[]> {
  const result = await query<Record<string, unknown>>(`SELECT * FROM cat_radios ORDER BY codigo`)
  return result.rows.map(rowToRadio)
}

export async function getBodyCams(): Promise<BodyCam[]> {
  const result = await query<Record<string, unknown>>(`SELECT * FROM cat_body_cams ORDER BY codigo`)
  return result.rows.map(rowToBodyCam)
}

export async function getEstadoFuerzaConceptos(): Promise<EstadoFuerzaConcepto[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM cat_estado_fuerza_conceptos ORDER BY orden`,
  )
  return result.rows.map(rowToEstadoFuerzaConcepto)
}

export async function getTiposObservacion(): Promise<TipoObservacion[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM cat_tipos_observacion ORDER BY nombre`,
  )
  return result.rows.map(rowToTipoObservacion)
}

export async function getTiposEmergencia(): Promise<TipoEmergencia[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM cat_tipos_emergencia ORDER BY nombre`,
  )
  return result.rows.map(rowToTipoEmergencia)
}

export async function getMediosCanalizacion(): Promise<MedioCanalizacion[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM cat_medios_canalizacion ORDER BY nombre`,
  )
  return result.rows.map(rowToMedioCanalizacion)
}

export async function getUserRoleName(userId: string): Promise<string | null> {
  const result = await query<{ rolnombre: string }>(
    `SELECT r.nombre AS rolnombre
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [userId],
  )
  return result.rows[0]?.rolnombre ?? null
}
