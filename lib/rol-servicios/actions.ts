'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq, sql }        from 'drizzle-orm'
import { db }             from '@/lib/db/index'
import { users, roles, rolesServicio, rolAsignaciones, rolEstadoFuerza, rolObservaciones } from '@/lib/db/schema'

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return session
}

// ─── Folio ────────────────────────────────────────────────────────────────────
async function generarFolio(): Promise<{ folio: string; consecutivo: number }> {
  const año = new Date().getFullYear()
  // Cuenta los roles del año actual para obtener el consecutivo
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(rolesServicio)
    .where(sql`extract(year from creado_en) = ${año}`)
  const consecutivo = (count ?? 0) + 1
  const folio = `SSPM/SS/${String(consecutivo).padStart(3, '0')}/${año}`
  return { folio, consecutivo }
}

// ─── Crear Rol ────────────────────────────────────────────────────────────────
export async function createRol(formData: FormData) {
  const session = await requireSession()

  const { folio, consecutivo } = await generarFolio()

  const [rol] = await db.insert(rolesServicio).values({
    folio,
    folioConsecutivo:  consecutivo,
    turno:             formData.get('turno') as string,
    horarioInicio:     (formData.get('horarioInicio') as string) || null,
    horarioFin:        (formData.get('horarioFin')    as string) || null,
    responsableTurno:  (formData.get('responsableTurno') as string) || null,
    sectorId:          formData.get('sectorId') ? Number(formData.get('sectorId')) : null,
    fecha:             formData.get('fecha') as string,
    fundamentoLegal:   (formData.get('fundamentoLegal') as string) || null,
    status:            'borrador',
    creadoPor:         session.user.id,
  }).returning({ id: rolesServicio.id })

  redirect(`/rol-servicios/${rol.id}`)
}

// ─── Actualizar encabezado ────────────────────────────────────────────────────
export async function updateEncabezadoRol(formData: FormData) {
  await requireSession()

  const id = formData.get('id') as string
  await db.update(rolesServicio).set({
    turno:            formData.get('turno') as string,
    horarioInicio:    (formData.get('horarioInicio') as string) || null,
    horarioFin:       (formData.get('horarioFin')    as string) || null,
    responsableTurno: (formData.get('responsableTurno') as string) || null,
    sectorId:         formData.get('sectorId') ? Number(formData.get('sectorId')) : null,
    fecha:            formData.get('fecha') as string,
    fundamentoLegal:  (formData.get('fundamentoLegal') as string) || null,
    actualizadoEn:    sql`now()`,
  }).where(eq(rolesServicio.id, id))

  revalidatePath(`/rol-servicios/${id}`)
}

// ─── Asignaciones (Cuadrantes / Extraordinarios) ──────────────────────────────
export async function createAsignacion(formData: FormData) {
  await requireSession()

  const rolId = formData.get('rolId') as string

  await db.insert(rolAsignaciones).values({
    rolId,
    seccion:        formData.get('seccion') as string,
    // snapshot unidad
    unidadExtId:    (formData.get('unidadExtId')  as string) || null,
    unidadPlaca:    (formData.get('unidadPlaca')  as string) || null,
    // snapshot elemento
    elementoExtId:  (formData.get('elementoExtId')  as string) || null,
    elementoNomina: (formData.get('elementoNomina') as string) || null,
    elementoNombre: (formData.get('elementoNombre') as string) || null,
    // zona manual
    zona:           (formData.get('zona')    as string) || null,
    servicio:       (formData.get('servicio') as string) || null,
    // equipo
    radioId:        formData.get('radioId')   ? Number(formData.get('radioId'))   : null,
    bodyCamId:      formData.get('bodyCamId') ? Number(formData.get('bodyCamId')) : null,
    orden:          formData.get('orden')     ? Number(formData.get('orden'))     : 0,
  })

  revalidatePath(`/rol-servicios/${rolId}`)
}

export async function deleteAsignacion(formData: FormData) {
  await requireSession()

  const id    = formData.get('id')    as string
  const rolId = formData.get('rolId') as string

  await db.delete(rolAsignaciones).where(eq(rolAsignaciones.id, id))
  revalidatePath(`/rol-servicios/${rolId}`)
}

// ─── Estado de Fuerza ─────────────────────────────────────────────────────────
export async function upsertEstadoFuerza(formData: FormData) {
  await requireSession()

  const rolId      = formData.get('rolId')      as string
  const conceptoId = Number(formData.get('conceptoId'))
  const cantidad   = Number(formData.get('cantidad') ?? 0)

  await db.insert(rolEstadoFuerza)
    .values({ rolId, conceptoId, cantidad })
    .onConflictDoUpdate({
      target: [rolEstadoFuerza.rolId, rolEstadoFuerza.conceptoId],
      set:    { cantidad },
    })

  revalidatePath(`/rol-servicios/${rolId}`)
}

// ─── Observaciones ────────────────────────────────────────────────────────────
export async function createObservacion(formData: FormData) {
  await requireSession()

  const rolId = formData.get('rolId') as string

  await db.insert(rolObservaciones).values({
    rolId,
    tipoId:      Number(formData.get('tipoId')),
    descripcion: (formData.get('descripcion') as string) || null,
  })

  revalidatePath(`/rol-servicios/${rolId}`)
}

export async function deleteObservacion(formData: FormData) {
  await requireSession()

  const id    = formData.get('id')    as string
  const rolId = formData.get('rolId') as string

  await db.delete(rolObservaciones).where(eq(rolObservaciones.id, id))
  revalidatePath(`/rol-servicios/${rolId}`)
}

// ─── Firmas y cierre ──────────────────────────────────────────────────────────
export async function guardarFirmas(formData: FormData) {
  const session = await requireSession()

  const id                   = formData.get('id') as string
  const firmaResponsableUrl  = formData.get('firmaResponsableUrl')  as string
  const firmaJefeSectorialUrl = formData.get('firmaJefeSectorialUrl') as string

  if (!firmaResponsableUrl || !firmaJefeSectorialUrl) {
    throw new Error('Se requieren ambas firmas para cerrar el rol')
  }

  await db.update(rolesServicio).set({
    firmaResponsableUrl,
    firmaJefeSectorialUrl,
    firmadoPor:    session.user.id,
    firmadoEn:     sql`now()`,
    status:        'cerrado',
    actualizadoEn: sql`now()`,
  }).where(eq(rolesServicio.id, id))

  revalidatePath(`/rol-servicios/${id}`)
}