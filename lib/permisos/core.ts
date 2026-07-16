import { query } from '@/lib/db'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getUserWithRole } from '@/lib/auth/helpers'

export type Accion = 'ver' | 'crear' | 'editar' | 'eliminar'

export interface PermisoSeccion {
  puede_ver: boolean
  puede_crear: boolean
  puede_editar: boolean
  puede_eliminar: boolean
}

export interface PermisoRow extends PermisoSeccion {
  id: string
  usuario_id: string
  seccion: string
}

export const PERMISO_COMPLETO: PermisoSeccion = { puede_ver: true, puede_crear: true, puede_editar: true, puede_eliminar: true }
export const PERMISO_NINGUNO: PermisoSeccion = { puede_ver: false, puede_crear: false, puede_editar: false, puede_eliminar: false }

function mapaBase<S extends string>(secciones: readonly S[], base: PermisoSeccion): Record<S, PermisoSeccion> {
  const mapa = {} as Record<S, PermisoSeccion>
  for (const s of secciones) mapa[s] = { ...base }
  return mapa
}

// Sin fila para un usuario+sección = SIN acceso a esa sección. Cada rol solo tiene
// fila para las secciones de su propio módulo (copiadas de permisos_plantillas al
// asignar el rol) — deny-by-default es lo que mantiene aislados a los roles entre sí.
// roles.es_admin es la única excepción: acceso completo sin tocar "permisos".
export async function obtenerPermisosUsuario<S extends string>(usuarioId: string, secciones: readonly S[]): Promise<Record<S, PermisoSeccion>> {
  const usuario = await getUserWithRole(usuarioId)
  if (usuario?.esAdmin) return mapaBase(secciones, PERMISO_COMPLETO)

  const r = await query<Record<string, unknown>>(
    `SELECT seccion, puede_ver, puede_crear, puede_editar, puede_eliminar FROM permisos WHERE usuario_id = $1`,
    [usuarioId],
  )
  const mapa = mapaBase(secciones, PERMISO_NINGUNO)
  for (const row of r.rows) {
    const seccion = String(row.seccion) as S
    if ((secciones as readonly string[]).includes(seccion)) {
      mapa[seccion] = {
        puede_ver: Boolean(row.puede_ver),
        puede_crear: Boolean(row.puede_crear),
        puede_editar: Boolean(row.puede_editar),
        puede_eliminar: Boolean(row.puede_eliminar),
      }
    }
  }
  return mapa
}

export async function tienePermiso(usuarioId: string, seccion: string, accion: Accion): Promise<boolean> {
  const permisos = await obtenerPermisosUsuario(usuarioId, [seccion])
  const p = permisos[seccion]
  if (accion === 'ver') return p.puede_ver
  if (accion === 'crear') return p.puede_crear
  if (accion === 'editar') return p.puede_editar
  return p.puede_eliminar
}

// Todas las filas de permisos de un usuario, de cualquier módulo (para pantallas de admin genéricas).
export async function listarPermisosPorUsuario(usuarioId: string): Promise<PermisoRow[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, usuario_id, seccion, puede_ver, puede_crear, puede_editar, puede_eliminar FROM permisos WHERE usuario_id = $1`,
    [usuarioId],
  )
  return r.rows.map(row => ({
    id: String(row.id),
    usuario_id: String(row.usuario_id),
    seccion: String(row.seccion),
    puede_ver: Boolean(row.puede_ver),
    puede_crear: Boolean(row.puede_crear),
    puede_editar: Boolean(row.puede_editar),
    puede_eliminar: Boolean(row.puede_eliminar),
  }))
}

export async function guardarPermiso(usuarioId: string, seccion: string, permiso: PermisoSeccion): Promise<void> {
  await query(
    `INSERT INTO permisos (usuario_id, seccion, puede_ver, puede_crear, puede_editar, puede_eliminar)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (usuario_id, seccion) DO UPDATE SET
       puede_ver = EXCLUDED.puede_ver,
       puede_crear = EXCLUDED.puede_crear,
       puede_editar = EXCLUDED.puede_editar,
       puede_eliminar = EXCLUDED.puede_eliminar`,
    [usuarioId, seccion, permiso.puede_ver, permiso.puede_crear, permiso.puede_editar, permiso.puede_eliminar],
  )
}

// Plantilla por rol: al asignarle un rol a un usuario se copian estos defaults a "permisos".
export async function obtenerPlantillaRol<S extends string>(rolId: number, secciones: readonly S[]): Promise<Record<S, PermisoSeccion>> {
  const r = await query<Record<string, unknown>>(
    `SELECT seccion, puede_ver, puede_crear, puede_editar, puede_eliminar FROM permisos_plantillas WHERE rol_id = $1`,
    [rolId],
  )
  const mapa = mapaBase(secciones, PERMISO_NINGUNO)
  for (const row of r.rows) {
    const seccion = String(row.seccion) as S
    if ((secciones as readonly string[]).includes(seccion)) {
      mapa[seccion] = {
        puede_ver: Boolean(row.puede_ver),
        puede_crear: Boolean(row.puede_crear),
        puede_editar: Boolean(row.puede_editar),
        puede_eliminar: Boolean(row.puede_eliminar),
      }
    }
  }
  return mapa
}

export async function tienePlantillaRol(rolId: number): Promise<boolean> {
  const r = await query<{ c: number }>(`SELECT count(*)::int as c FROM permisos_plantillas WHERE rol_id = $1`, [rolId])
  return (r.rows[0]?.c ?? 0) > 0
}

export async function guardarPlantillaSeccion(rolId: number, seccion: string, permiso: PermisoSeccion): Promise<void> {
  await query(
    `INSERT INTO permisos_plantillas (rol_id, seccion, puede_ver, puede_crear, puede_editar, puede_eliminar)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (rol_id, seccion) DO UPDATE SET
       puede_ver = EXCLUDED.puede_ver,
       puede_crear = EXCLUDED.puede_crear,
       puede_editar = EXCLUDED.puede_editar,
       puede_eliminar = EXCLUDED.puede_eliminar`,
    [rolId, seccion, permiso.puede_ver, permiso.puede_crear, permiso.puede_editar, permiso.puede_eliminar],
  )
}

// Copia TODA la plantilla del rol (de cualquier módulo) a la fila del usuario en "permisos".
// Antes solo copiaba una lista fija de secciones de monitorista — ahora copia lo que sea
// que tenga la plantilla, sin importar qué módulo la definió.
export async function aplicarPlantillaRol(usuarioId: string, rolId: number | null): Promise<void> {
  if (!rolId) return
  const plantilla = await query<Record<string, unknown>>(
    `SELECT seccion, puede_ver, puede_crear, puede_editar, puede_eliminar FROM permisos_plantillas WHERE rol_id = $1`,
    [rolId],
  )
  for (const row of plantilla.rows) {
    await guardarPermiso(usuarioId, String(row.seccion), {
      puede_ver: Boolean(row.puede_ver),
      puede_crear: Boolean(row.puede_crear),
      puede_editar: Boolean(row.puede_editar),
      puede_eliminar: Boolean(row.puede_eliminar),
    })
  }
}

async function requireAdmin(): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const usuario = await getUserWithRole(session.user.id)
  if (!usuario?.esAdmin) redirect('/dashboard')
}

// Genérico: guarda permisos de usuario para cualquier módulo, según la lista de secciones
// que venga en el hidden input "secciones" (CSV). Usado por /admin/usuarios/[id].
export async function guardarPermisosSeccionesAction(formData: FormData): Promise<void> {
  'use server'
  await requireAdmin()

  const usuarioId = formData.get('usuarioId') as string
  const secciones = ((formData.get('secciones') as string) ?? '').split(',').filter(Boolean)
  if (!usuarioId || secciones.length === 0) return

  for (const seccion of secciones) {
    await guardarPermiso(usuarioId, seccion, {
      puede_ver: formData.get(`${seccion}_ver`) === 'on',
      puede_crear: formData.get(`${seccion}_crear`) === 'on',
      puede_editar: formData.get(`${seccion}_editar`) === 'on',
      puede_eliminar: formData.get(`${seccion}_eliminar`) === 'on',
    })
  }

  revalidatePath(`/admin/usuarios/${usuarioId}`)
  redirect(`/admin/usuarios/${usuarioId}?exito=1#permisos`)
}

// Genérico: guarda la plantilla de un rol para cualquier módulo. Usado por
// /admin/roles/[id]/plantilla-permisos.
export async function guardarPlantillaSeccionesAction(formData: FormData): Promise<void> {
  'use server'
  await requireAdmin()

  const rolId = Number(formData.get('rolId'))
  const secciones = ((formData.get('secciones') as string) ?? '').split(',').filter(Boolean)
  if (!rolId || secciones.length === 0) return

  for (const seccion of secciones) {
    await guardarPlantillaSeccion(rolId, seccion, {
      puede_ver: formData.get(`${seccion}_ver`) === 'on',
      puede_crear: formData.get(`${seccion}_crear`) === 'on',
      puede_editar: formData.get(`${seccion}_editar`) === 'on',
      puede_eliminar: formData.get(`${seccion}_eliminar`) === 'on',
    })
  }

  revalidatePath(`/admin/roles/${rolId}/plantilla-permisos`)
  redirect(`/admin/roles/${rolId}/plantilla-permisos?exito=1`)
}
