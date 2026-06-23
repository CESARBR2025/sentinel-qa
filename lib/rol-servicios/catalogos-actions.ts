'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq }             from 'drizzle-orm'
import { db }             from '@/lib/db/index'
import { users, roles } from '@/lib/db/schema'
import {
  catSectores, catRadios, catBodyCams,
  catEstadoFuerzaConceptos, catTiposObservacion,
  catTiposEmergencia, catMediosCanalizacion,
} from '@/lib/db/schema'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  const [u] = await db
    .select({ rolNombre: roles.nombre })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .where(eq(users.id, session.user.id))
    .limit(1)
  if (u?.rolNombre !== 'Administrador') redirect('/dashboard')
  return session
}

const str = (fd: FormData, k: string): string | null =>
  (fd.get(k) as string | null)?.trim() || null
const req = (fd: FormData, k: string): string =>
  (fd.get(k) as string).trim()

// ─── Sectores ─────────────────────────────────────────────────────────────────
export async function createSector(formData: FormData) {
  await requireAdmin()
  await db.insert(catSectores).values({
    nombre: req(formData, 'nombre'),
    clave:  req(formData, 'clave'),
  })
  revalidatePath('/admin/catalogos/sectores')
}

export async function toggleSector(formData: FormData) {
  await requireAdmin()
  const id     = Number(req(formData, 'id'))
  const activo = req(formData, 'activo') === 'true'
  await db.update(catSectores).set({ activo: !activo }).where(eq(catSectores.id, id))
  revalidatePath('/admin/catalogos/sectores')
}

// ─── Radios ───────────────────────────────────────────────────────────────────
export async function createRadio(formData: FormData) {
  await requireAdmin()
  await db.insert(catRadios).values({
    codigo: req(formData, 'codigo'),
    tipo:   str(formData, 'tipo'),
    estado: req(formData, 'estado'),
  })
  revalidatePath('/admin/catalogos/radios')
}

export async function toggleRadio(formData: FormData) {
  await requireAdmin()
  const id     = Number(req(formData, 'id'))
  const activo = req(formData, 'activo') === 'true'
  await db.update(catRadios).set({ activo: !activo }).where(eq(catRadios.id, id))
  revalidatePath('/admin/catalogos/radios')
}

// ─── Body Cams ────────────────────────────────────────────────────────────────
export async function createBodyCam(formData: FormData) {
  await requireAdmin()
  await db.insert(catBodyCams).values({
    codigo: req(formData, 'codigo'),
    estado: req(formData, 'estado'),
  })
  revalidatePath('/admin/catalogos/body-cams')
}

export async function toggleBodyCam(formData: FormData) {
  await requireAdmin()
  const id     = Number(req(formData, 'id'))
  const activo = req(formData, 'activo') === 'true'
  await db.update(catBodyCams).set({ activo: !activo }).where(eq(catBodyCams.id, id))
  revalidatePath('/admin/catalogos/body-cams')
}

// ─── Conceptos de Estado de Fuerza ────────────────────────────────────────────
export async function createConcepto(formData: FormData) {
  await requireAdmin()
  await db.insert(catEstadoFuerzaConceptos).values({
    nombre: req(formData, 'nombre'),
    codigo: req(formData, 'codigo'),
    grupo:  str(formData, 'grupo'),
    orden:  Number(str(formData, 'orden') ?? '0'),
  })
  revalidatePath('/admin/catalogos/estado-fuerza')
}

export async function toggleConcepto(formData: FormData) {
  await requireAdmin()
  const id     = Number(req(formData, 'id'))
  const activo = req(formData, 'activo') === 'true'
  await db.update(catEstadoFuerzaConceptos).set({ activo: !activo }).where(eq(catEstadoFuerzaConceptos.id, id))
  revalidatePath('/admin/catalogos/estado-fuerza')
}

// ─── Tipos de Observación ─────────────────────────────────────────────────────
export async function createTipoObservacion(formData: FormData) {
  await requireAdmin()
  await db.insert(catTiposObservacion).values({
    nombre: req(formData, 'nombre'),
    codigo: req(formData, 'codigo'),
  })
  revalidatePath('/admin/catalogos/observaciones')
}

export async function toggleTipoObservacion(formData: FormData) {
  await requireAdmin()
  const id     = Number(req(formData, 'id'))
  const activo = req(formData, 'activo') === 'true'
  await db.update(catTiposObservacion).set({ activo: !activo }).where(eq(catTiposObservacion.id, id))
  revalidatePath('/admin/catalogos/observaciones')
}

// Agregar a lib/rol-servicios/catalogos-actions.ts

// ─── Tipos de Emergencia ──────────────────────────────────────────────────────
export async function createTipoEmergencia(formData: FormData) {
  await requireAdmin()
  await db.insert(catTiposEmergencia).values({
    clave:  req(formData, 'clave'),
    nombre: req(formData, 'nombre'),
  })
  revalidatePath('/admin/catalogos/tipos-emergencia')
}

export async function toggleTipoEmergencia(formData: FormData) {
  await requireAdmin()
  const id     = Number(req(formData, 'id'))
  const activo = req(formData, 'activo') === 'true'
  await db.update(catTiposEmergencia).set({ activo: !activo }).where(eq(catTiposEmergencia.id, id))
  revalidatePath('/admin/catalogos/tipos-emergencia')
}

// ─── Medios de Canalización ───────────────────────────────────────────────────
export async function createMedioCanalizacion(formData: FormData) {
  await requireAdmin()
  await db.insert(catMediosCanalizacion).values({
    clave:  req(formData, 'clave'),
    nombre: req(formData, 'nombre'),
  })
  revalidatePath('/admin/catalogos/medios-canalizacion')
}

export async function toggleMedioCanalizacion(formData: FormData) {
  await requireAdmin()
  const id     = Number(req(formData, 'id'))
  const activo = req(formData, 'activo') === 'true'
  await db.update(catMediosCanalizacion).set({ activo: !activo }).where(eq(catMediosCanalizacion.id, id))
  revalidatePath('/admin/catalogos/medios-canalizacion')
}