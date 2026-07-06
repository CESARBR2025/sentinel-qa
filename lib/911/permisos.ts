import { query } from '@/lib/db'
import * as core from '@/lib/permisos/core'

export const SECCIONES = ['911_ciudadano', '911_whatsapp', '911_rondin', '911_despacho'] as const
export type Seccion = typeof SECCIONES[number]
export type Accion = core.Accion
export type PermisoSeccion = core.PermisoSeccion

export async function tienePermiso(usuarioId: string, seccion: Seccion, accion: Accion): Promise<boolean> {
  return core.tienePermiso(usuarioId, seccion, accion)
}

export async function guardarPermiso(usuarioId: string, seccion: Seccion, permiso: PermisoSeccion): Promise<void> {
  return core.guardarPermiso(usuarioId, seccion, permiso)
}

export async function obtenerPlantillaRol(rolId: number): Promise<Record<Seccion, PermisoSeccion>> {
  return core.obtenerPlantillaRol(rolId, SECCIONES)
}

export async function guardarPlantillaSeccion(rolId: number, seccion: Seccion, permiso: PermisoSeccion): Promise<void> {
  return core.guardarPlantillaSeccion(rolId, seccion, permiso)
}

// Cada canal de captura tiene su propio rol dedicado (ver descripciones en tabla roles).
const ROLES_PERMITIDOS: Record<Seccion, string[]> = {
  '911_ciudadano': ['Administrador', 'Operador 911'],
  '911_whatsapp':  ['Administrador', 'Operador 911'],
  '911_rondin':    ['Administrador', 'Bitacorista'],
  '911_despacho':  ['Administrador', 'Despachador'],
}

export async function obtenerRolNombre(usuarioId: string): Promise<string | null> {
  const r = await query<{ nombre: string }>(
    `SELECT r.nombre FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = $1 LIMIT 1`, [usuarioId],
  )
  return r.rows[0]?.nombre ?? null
}

export async function tieneAccesoSeccion(usuarioId: string, seccion: Seccion): Promise<boolean> {
  const rolNombre = await obtenerRolNombre(usuarioId)
  return ROLES_PERMITIDOS[seccion].includes(rolNombre ?? '')
}

// Acceso al hub /911: cualquier rol que tenga acceso a al menos un canal.
export async function tieneAccesoHub(usuarioId: string): Promise<boolean> {
  const rolNombre = await obtenerRolNombre(usuarioId)
  return SECCIONES.some(s => ROLES_PERMITIDOS[s].includes(rolNombre ?? ''))
}
