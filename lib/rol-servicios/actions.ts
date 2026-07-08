'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { query }          from '@/lib/db'

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return session
}

// ─── Folio ────────────────────────────────────────────────────────────────────
async function generarFolio(): Promise<{ folio: string; consecutivo: number }> {
  const año = new Date().getFullYear()
  await query(`SELECT pg_advisory_xact_lock($1)`, [año + 1000])
  const result = await query<{ next: number }>(
    `SELECT COALESCE(MAX(folio_consecutivo), 0) + 1 AS next
     FROM roles_servicio
     WHERE EXTRACT(YEAR FROM creado_en) = $1`,
    [año],
  )
  const consecutivo = result.rows[0].next
  const folio = `SSPM/SS/${String(consecutivo).padStart(3, '0')}/${año}`
  return { folio, consecutivo }
}

// ─── Crear Rol ────────────────────────────────────────────────────────────────
export async function createRol(formData: FormData) {
  const session = await requireSession()

  const { folio, consecutivo } = await generarFolio()

  const rol = await query<{ id: string }>(
    `INSERT INTO roles_servicio
     (folio, folio_consecutivo, turno, horario_inicio, horario_fin,
      responsable_turno, sector_id, fecha, fundamento_legal, status, creado_por)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'borrador', $10)
     RETURNING id`,
    [
      folio, consecutivo,
      formData.get('turno') as string,
      (formData.get('horarioInicio') as string) || null,
      (formData.get('horarioFin')    as string) || null,
      (formData.get('responsableTurno') as string) || null,
      formData.get('sectorId') ? Number(formData.get('sectorId')) : null,
      formData.get('fecha') as string,
      (formData.get('fundamentoLegal') as string) || null,
      session.user.id,
    ],
  )

  redirect(`/rol-servicios/${rol.rows[0].id}`)
}

// ─── Actualizar encabezado ────────────────────────────────────────────────────
export async function updateEncabezadoRol(formData: FormData) {
  await requireSession()

  const id = formData.get('id') as string
  await query(
    `UPDATE roles_servicio SET
      turno = $1, horario_inicio = $2, horario_fin = $3,
      responsable_turno = $4, sector_id = $5, fecha = $6,
      fundamento_legal = $7, actualizado_en = now()
     WHERE id = $8`,
    [
      formData.get('turno') as string,
      (formData.get('horarioInicio') as string) || null,
      (formData.get('horarioFin')    as string) || null,
      (formData.get('responsableTurno') as string) || null,
      formData.get('sectorId') ? Number(formData.get('sectorId')) : null,
      formData.get('fecha') as string,
      (formData.get('fundamentoLegal') as string) || null,
      id,
    ],
  )

  revalidatePath(`/rol-servicios/${id}`)
}

// ─── Asignaciones (Cuadrantes / Extraordinarios) ──────────────────────────────
export async function createAsignacion(formData: FormData) {
  await requireSession()

  const rolId = formData.get('rolId') as string

  await query(
    `INSERT INTO rol_asignaciones
     (rol_id, seccion, unidad_ext_id, unidad_placa,
      elemento_ext_id, elemento_nomina, elemento_nombre,
      zona, servicio, radio_id, body_cam_id, orden)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      rolId,
      formData.get('seccion') as string,
      (formData.get('unidadExtId')  as string) || null,
      (formData.get('unidadPlaca')  as string) || null,
      (formData.get('elementoExtId')  as string) || null,
      (formData.get('elementoNomina') as string) || null,
      (formData.get('elementoNombre') as string) || null,
      (formData.get('zona')    as string) || null,
      (formData.get('servicio') as string) || null,
      formData.get('radioId')   ? Number(formData.get('radioId'))   : null,
      formData.get('bodyCamId') ? Number(formData.get('bodyCamId')) : null,
      formData.get('orden')     ? Number(formData.get('orden'))     : 0,
    ],
  )

  revalidatePath(`/rol-servicios/${rolId}`)
}

export async function deleteAsignacion(formData: FormData) {
  await requireSession()

  const id    = formData.get('id')    as string
  const rolId = formData.get('rolId') as string

  await query(`DELETE FROM rol_asignaciones WHERE id = $1`, [id])
  revalidatePath(`/rol-servicios/${rolId}`)
}

// ─── Estado de Fuerza ─────────────────────────────────────────────────────────
export async function upsertEstadoFuerza(formData: FormData) {
  await requireSession()

  const rolId      = formData.get('rolId')      as string
  const conceptoId = Number(formData.get('conceptoId'))
  const cantidad   = Number(formData.get('cantidad') ?? 0)

  await query(
    `INSERT INTO rol_estado_fuerza (rol_id, concepto_id, cantidad)
     VALUES ($1, $2, $3)
     ON CONFLICT (rol_id, concepto_id)
     DO UPDATE SET cantidad = EXCLUDED.cantidad`,
    [rolId, conceptoId, cantidad],
  )

  revalidatePath(`/rol-servicios/${rolId}`)
}

// ─── Observaciones ────────────────────────────────────────────────────────────
export async function createObservacion(formData: FormData) {
  await requireSession()

  const rolId = formData.get('rolId') as string

  await query(
    `INSERT INTO rol_observaciones (rol_id, tipo_id, descripcion)
     VALUES ($1, $2, $3)`,
    [
      rolId,
      Number(formData.get('tipoId')),
      (formData.get('descripcion') as string) || null,
    ],
  )

  revalidatePath(`/rol-servicios/${rolId}`)
}

export async function deleteObservacion(formData: FormData) {
  await requireSession()

  const id    = formData.get('id')    as string
  const rolId = formData.get('rolId') as string

  await query(`DELETE FROM rol_observaciones WHERE id = $1`, [id])
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

  await query(
    `UPDATE roles_servicio SET
      firma_responsable_url = $1, firma_jefe_sectorial_url = $2,
      firmado_por = $3, firmado_en = now(),
      status = 'cerrado', actualizado_en = now()
     WHERE id = $4`,
    [firmaResponsableUrl, firmaJefeSectorialUrl, session.user.id, id],
  )

  revalidatePath(`/rol-servicios/${id}`)
}