import { NextResponse } from 'next/server'
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

export async function tieneAccesoSeccion(usuarioId: string, seccion: Seccion): Promise<boolean> {
  return core.tienePermiso(usuarioId, seccion, 'ver')
}

export async function verificarAccesoPrevencionApi(usuarioId: string, seccion: Seccion, accion: Accion): Promise<NextResponse | null> {
  if (!(await core.tienePermiso(usuarioId, seccion, accion))) {
    return NextResponse.json({ error: 'Sin permiso' }, { status: 403 })
  }
  return null
}
