'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { query }          from '@/lib/db'
import { getUserWithRole } from '@/lib/auth/helpers'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const usuario = await getUserWithRole(session.user.id)
  if (!usuario?.esAdmin) redirect('/dashboard')
  return session
}

const str = (fd: FormData, k: string): string | null =>
  (fd.get(k) as string | null)?.trim() || null
const req = (fd: FormData, k: string): string =>
  (fd.get(k) as string).trim()

type TablaCatalogo = 'cat_sectores' | 'cat_radios' | 'cat_body_cams'
  | 'cat_estado_fuerza_conceptos' | 'cat_tipos_observacion'
  | 'cat_tipos_emergencia' | 'cat_medios_canalizacion'

async function toggleCatalogo(tabla: TablaCatalogo, path: string, formData: FormData) {
  await requireAdmin()
  await query(
    `UPDATE ${tabla} SET activo = NOT activo WHERE id = $1`,
    [Number(req(formData, 'id'))],
  )
  revalidatePath(path)
}

// ─── Sectores ─────────────────────────────────────────────────────────────────
export async function createSector(formData: FormData) {
  await requireAdmin()
  await query(
    `INSERT INTO cat_sectores (nombre, clave) VALUES ($1, $2)`,
    [req(formData, 'nombre'), req(formData, 'clave')],
  )
  revalidatePath('/admin/catalogos/sectores')
}

export const toggleSector = (formData: FormData) =>
  toggleCatalogo('cat_sectores', '/admin/catalogos/sectores', formData)

// ─── Radios ───────────────────────────────────────────────────────────────────
export async function createRadio(formData: FormData) {
  await requireAdmin()
  await query(
    `INSERT INTO cat_radios (codigo, tipo, estado) VALUES ($1, $2, $3)`,
    [req(formData, 'codigo'), str(formData, 'tipo'), req(formData, 'estado')],
  )
  revalidatePath('/admin/catalogos/radios')
}

export const toggleRadio = (formData: FormData) =>
  toggleCatalogo('cat_radios', '/admin/catalogos/radios', formData)

// ─── Body Cams ────────────────────────────────────────────────────────────────
export async function createBodyCam(formData: FormData) {
  await requireAdmin()
  await query(
    `INSERT INTO cat_body_cams (codigo, estado) VALUES ($1, $2)`,
    [req(formData, 'codigo'), req(formData, 'estado')],
  )
  revalidatePath('/admin/catalogos/body-cams')
}

export const toggleBodyCam = (formData: FormData) =>
  toggleCatalogo('cat_body_cams', '/admin/catalogos/body-cams', formData)

// ─── Conceptos de Estado de Fuerza ────────────────────────────────────────────
export async function createConcepto(formData: FormData) {
  await requireAdmin()
  await query(
    `INSERT INTO cat_estado_fuerza_conceptos (nombre, codigo, grupo, orden) VALUES ($1, $2, $3, $4)`,
    [req(formData, 'nombre'), req(formData, 'codigo'), str(formData, 'grupo'), Number(str(formData, 'orden') ?? '0')],
  )
  revalidatePath('/admin/catalogos/estado-fuerza')
}

export const toggleConcepto = (formData: FormData) =>
  toggleCatalogo('cat_estado_fuerza_conceptos', '/admin/catalogos/estado-fuerza', formData)

// ─── Tipos de Observación ─────────────────────────────────────────────────────
export async function createTipoObservacion(formData: FormData) {
  await requireAdmin()
  await query(
    `INSERT INTO cat_tipos_observacion (nombre, codigo) VALUES ($1, $2)`,
    [req(formData, 'nombre'), req(formData, 'codigo')],
  )
  revalidatePath('/admin/catalogos/observaciones')
}

export const toggleTipoObservacion = (formData: FormData) =>
  toggleCatalogo('cat_tipos_observacion', '/admin/catalogos/observaciones', formData)

// ─── Tipos de Emergencia ──────────────────────────────────────────────────────
export async function createTipoEmergencia(formData: FormData) {
  await requireAdmin()
  await query(
    `INSERT INTO cat_tipos_emergencia (clave, nombre) VALUES ($1, $2)`,
    [req(formData, 'clave'), req(formData, 'nombre')],
  )
  revalidatePath('/admin/catalogos/tipos-emergencia')
}

export const toggleTipoEmergencia = (formData: FormData) =>
  toggleCatalogo('cat_tipos_emergencia', '/admin/catalogos/tipos-emergencia', formData)

// ─── Medios de Canalización ───────────────────────────────────────────────────
export async function createMedioCanalizacion(formData: FormData) {
  await requireAdmin()
  await query(
    `INSERT INTO cat_medios_canalizacion (clave, nombre) VALUES ($1, $2)`,
    [req(formData, 'clave'), req(formData, 'nombre')],
  )
  revalidatePath('/admin/catalogos/medios-canalizacion')
}

export const toggleMedioCanalizacion = (formData: FormData) =>
  toggleCatalogo('cat_medios_canalizacion', '/admin/catalogos/medios-canalizacion', formData)