import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import * as core from '@/lib/permisos/core'

export const SECCIONES = ['incidentes', 'incidentes_camaras', 'modulo_incidentes'] as const
export type Seccion = typeof SECCIONES[number]
export type Accion = core.Accion
export type PermisoSeccion = core.PermisoSeccion

export async function obtenerPermisosUsuario(usuarioId: string): Promise<Record<Seccion, PermisoSeccion>> {
  return core.obtenerPermisosUsuario(usuarioId, SECCIONES)
}

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

const ROLES_PERMITIDOS = ['Administrador', 'Operador', 'Oficial de Campo']

// Chequeo para API routes (retorna un NextResponse 401/403 si no pasa, o null si todo bien).
export async function verificarAccesoIncidentesApi(usuarioId: string, accion: Accion): Promise<NextResponse | null> {
  const rolResult = await query<{ nombre: string }>(
    `SELECT r.nombre FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = $1 LIMIT 1`, [usuarioId],
  )
  if (!ROLES_PERMITIDOS.includes(rolResult.rows[0]?.nombre ?? '')) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }
  if (!(await tienePermiso(usuarioId, 'incidentes', accion))) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }
  return null
}
