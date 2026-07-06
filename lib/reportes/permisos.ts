import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import * as core from '@/lib/permisos/core'

export const SECCIONES = ['formato_n_coordinacion'] as const
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

// Formato N a Coordinación: gestionado desde el panel de administración.
const ROLES_PERMITIDOS = ['Administrador', 'Analisis']

export async function tieneAccesoFormatoN(usuarioId: string): Promise<boolean> {
  const r = await query<{ nombre: string }>(
    `SELECT r.nombre FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = $1 LIMIT 1`, [usuarioId],
  )
  return ROLES_PERMITIDOS.includes(r.rows[0]?.nombre ?? '')
}

export async function verificarAccesoFormatoNApi(usuarioId: string, accion: Accion): Promise<NextResponse | null> {
  if (!(await tieneAccesoFormatoN(usuarioId))) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }
  if (!(await tienePermiso(usuarioId, 'formato_n_coordinacion', accion))) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }
  return null
}
