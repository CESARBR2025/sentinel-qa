import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import * as core from '@/lib/permisos/core'

export const SECCIONES = ['busquedas', 'medidas', 'solicitudes'] as const
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

// "Operador Víctimas" es el rol dedicado a búsquedas/medidas (ver lib/db/seed.ts).
// "Jurídico" es el dedicado a solicitudes de información.
const ROLES_PERMITIDOS: Record<Seccion, string[]> = {
  busquedas: ['Administrador', 'Operador Víctimas'],
  medidas: ['Administrador', 'Operador Víctimas'],
  solicitudes: ['Administrador', 'Jurídico'],
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

export async function verificarAccesoPrevencionApi(usuarioId: string, seccion: Seccion, accion: Accion): Promise<NextResponse | null> {
  if (!(await tieneAccesoSeccion(usuarioId, seccion))) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }
  if (!(await tienePermiso(usuarioId, seccion, accion))) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }
  return null
}
