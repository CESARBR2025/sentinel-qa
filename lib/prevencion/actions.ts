'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq, sql }        from 'drizzle-orm'
import { db }             from '@/lib/db/index'
import { addDays, addMonths, isBefore, parseISO, format } from 'date-fns'
import { promises as fs } from 'fs'
import path               from 'path'
import {
  medidasProteccion, visitasDomiciliarias,
  fichasBusqueda, seguimientosBusqueda,
  solicitudesInformacion, solicitudesC4Internas, contestaciones,
  medidaAutoridadesAdicionales,
} from '@/lib/db/schema'
import { tieneAccesoSeccion, tienePermiso, Seccion, Accion } from '@/lib/prevencion/permisos'

async function requireAcceso(seccion: Seccion, accion: Accion) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autenticado')
  if (!(await tieneAccesoSeccion(session.user.id, seccion))) throw new Error('Sin permiso')
  if (!(await tienePermiso(session.user.id, seccion, accion))) throw new Error('Sin permiso')
  return session
}

export async function createMedida(formData: FormData) {
  const session = await requireAcceso('medidas', 'crear')

  const str = (k: string): string | null =>
    (formData.get(k) as string | null)?.trim() || null

  const req = (k: string): string =>
    (formData.get(k) as string).trim()

  const [row] = await db.insert(medidasProteccion).values({
    expediente:          req('expediente'),
    nOficio:             req('nOficio'),
    fechaOficio:         req('fechaOficio'),
    fechaRecepcion:      req('fechaRecepcion'),
    personaRecepciona:   req('personaRecepciona'),
    autoridad:           req('autoridad'),
    nombreAutoridad:     str('nombreAutoridad'),
    delitos:             str('delitos'),
    victima:             req('victima'),
    demandado:           str('demandado'),
    tipoMedida:          str('tipoMedida'),
    domicilioProteccion: req('domicilioProteccion'),
    colonia:             str('colonia'),
    telefono:            str('telefono'),
    tiempoMedida:        str('tiempoMedida'),
    fechaVencimiento:    str('fechaVencimiento'),
    tipoApercibimiento:  str('tipoApercibimiento'),
    enlace:              str('enlace'),
    observaciones:       str('observaciones'),
    creadoPor:           session.user.id,
  }).returning({ id: medidasProteccion.id })

  revalidatePath('/prevencion/medidas')
  redirect(`/prevencion/medidas/${row.id}`)
}

export async function createVisita(medidaId: string, formData: FormData) {
  const session = await requireAcceso('medidas', 'editar')

  await db.insert(visitasDomiciliarias).values({
    medidaId,
    fechaVisita:            (formData.get('fechaVisita') as string).trim(),
    horaVisita:             (formData.get('horaVisita') as string).trim(),
    resultado:              (formData.get('resultado') as string | null)?.trim() || null,
    apercibimientoAplicado: formData.get('apercibimientoAplicado') === '1',
    registradoPor:          session.user.id,
  })

  revalidatePath(`/prevencion/medidas/${medidaId}`)
}

export async function addAutoridadMedida(formData: FormData) {
  const session = await requireAcceso('medidas', 'editar')

  const medidaId   = (formData.get('medidaId')   as string).trim()
  const autoridad  = (formData.get('autoridad')  as string).trim()
  const nOficio    = (formData.get('nOficio')    as string | null)?.trim() || null
  const fechaOficioRaw = (formData.get('fechaOficio') as string | null)?.trim() || null

  await db.insert(medidaAutoridadesAdicionales).values({
    medidaId,
    autoridad,
    nOficio,
    fechaOficio: fechaOficioRaw || null,
    creadoPor:   session.user.id,
  })

  revalidatePath(`/prevencion/medidas/${medidaId}`)
}

export async function createProrroga(formData: FormData) {
  await requireAcceso('medidas', 'editar')

  const medidaId = (formData.get('medidaId') as string).trim()
  const cantidad = Number(formData.get('cantidad'))
  const unidad   = formData.get('unidad') as 'dias' | 'meses'
  const archivo  = formData.get('archivo') as File | null

  const [medida] = await db
    .select({ fechaVencimiento: medidasProteccion.fechaVencimiento, expediente: medidasProteccion.expediente })
    .from(medidasProteccion)
    .where(eq(medidasProteccion.id, medidaId))
    .limit(1)

  if (!medida) throw new Error('Medida no encontrada')

  // Extend from today if already expired, otherwise from current end date
  const today = new Date()
  const base  = medida.fechaVencimiento ? parseISO(medida.fechaVencimiento) : today
  const start = isBefore(base, today) ? today : base
  const newDate = unidad === 'dias' ? addDays(start, cantidad) : addMonths(start, cantidad)

  // Save uploaded file locally if provided
  let archivoPath: string | null = null
  if (archivo && archivo.size > 0) {
    const folio    = medida.expediente.replace(/[^a-zA-Z0-9_-]/g, '_')
    const ext      = path.extname(archivo.name) || '.bin'
    const filename = `${Date.now()}${ext}`
    const dir      = path.join(process.cwd(), 'uploads', 'medidas_proteccion', folio, 'prorroga')
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, filename), Buffer.from(await archivo.arrayBuffer()))
    archivoPath = `uploads/medidas_proteccion/${folio}/prorroga/${filename}`
  }

  await db.update(medidasProteccion)
    .set({
      fechaVencimiento:   format(newDate, 'yyyy-MM-dd'),
      prorrogada:         true,
      archivoProrrogaUrl: archivoPath,
      actualizadoEn:      sql`now()`,
    })
    .where(eq(medidasProteccion.id, medidaId))

  revalidatePath(`/prevencion/medidas/${medidaId}`)
  revalidatePath('/prevencion/medidas')
}

// ── Búsquedas / Protocolo Alba ────────────────────────────────────────────────

export async function createFicha(formData: FormData) {
  const session = await requireAcceso('busquedas', 'crear')

  const str = (k: string): string | null =>
    (formData.get(k) as string | null)?.trim() || null

  const fechaActivacionRaw = (formData.get('fechaActivacion') as string).trim()
  const fechaAceptacionRaw  = str('fechaAceptacion')
  const edadRaw             = str('edad')

  const [row] = await db.insert(fichasBusqueda).values({
    tipo:                 (formData.get('tipo') as string).trim(),
    folio:                str('folio'),
    enlace:               str('enlace'),
    fechaActivacion:      fechaActivacionRaw,
    carpetaInvestigacion: str('carpetaInvestigacion'),
    nombreDesaparecida:   (formData.get('nombreDesaparecida') as string).trim(),
    edad:                 edadRaw ? parseInt(edadRaw) : null,
    fechaAceptacion:      fechaAceptacionRaw ?? null,
    rtAtiende:            str('rtAtiende'),
    elementoNovedades:    str('elementoNovedades'),
    creadoPor:            session.user.id,
  }).returning({ id: fichasBusqueda.id })

  revalidatePath('/prevencion/busquedas')
  redirect(`/prevencion/busquedas/${row.id}`)
}

export async function createSeguimiento(formData: FormData) {
  const session = await requireAcceso('busquedas', 'editar')

  const fichaId = (formData.get('fichaId') as string).trim()
  const tipo    = (formData.get('tipo') as string).trim()
  const archivo = formData.get('archivo') as File | null

  let archivoUrl: string | null = null
  if (archivo && archivo.size > 0) {
    const ext      = path.extname(archivo.name) || '.bin'
    const filename = `${tipo}_${Date.now()}${ext}`
    const dir      = path.join(process.cwd(), 'uploads', 'busquedas', fichaId, 'seguimientos')
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, filename), Buffer.from(await archivo.arrayBuffer()))
    archivoUrl = `uploads/busquedas/${fichaId}/seguimientos/${filename}`
  }

  await db.insert(seguimientosBusqueda).values({
    fichaId,
    tipo,
    fechaHoraEnvio: sql`now()`,
    registradoPor:  session.user.id,
    archivoUrl,
  })

  revalidatePath(`/prevencion/busquedas/${fichaId}`)
}

export async function cancelarFicha(formData: FormData) {
  await requireAcceso('busquedas', 'editar')

  const fichaId = (formData.get('fichaId') as string).trim()

  await db.update(fichasBusqueda)
    .set({
      status:           'cancelada',
      fechaCancelacion:  (formData.get('fechaCancelacion') as string).trim(),
      fiscalCancela:    (formData.get('fiscalCancela') as string).trim(),
      motivoCancelacion: (formData.get('motivoCancelacion') as string | null)?.trim() || null,
    })
    .where(eq(fichasBusqueda.id, fichaId))

  revalidatePath(`/prevencion/busquedas/${fichaId}`)
  revalidatePath('/prevencion/busquedas')
}

// ── Área Jurídica ─────────────────────────────────────────────────────────────

export async function createSolicitud(formData: FormData) {
  const session = await requireAcceso('solicitudes', 'crear')

  const str = (k: string): string | null =>
    (formData.get(k) as string | null)?.trim() || null

  const req = (k: string): string =>
    (formData.get(k) as string).trim()

  const fechaAceptacionRaw = str('fechaAceptacion')

  const [row] = await db.insert(solicitudesInformacion).values({
    enlace:               str('enlace'),
    oficio:               req('oficio'),
    fechaActivacion:      req('fechaActivacion'),
    autoridad:            req('autoridad'),
    fiscalSolicita:       str('fiscalSolicita'),
    delito:               str('delito'),
    carpetaInvestigacion: str('carpetaInvestigacion'),
    solicitudTexto:       str('solicitudTexto'),
    fechaAceptacion:      fechaAceptacionRaw ?? null,
    status:               'en_juridico',
    creadoPor:            session.user.id,
  }).returning({ id: solicitudesInformacion.id })

  revalidatePath('/prevencion/juridico')
  redirect(`/prevencion/juridico/solicitudes/${row.id}`)
}

export async function createSolicitudC4(formData: FormData) {
  const session = await requireAcceso('solicitudes', 'editar')

  const solicitudId = (formData.get('solicitudId') as string).trim()

  await db.insert(solicitudesC4Internas).values({
    solicitudId,
    descripcionEvidencias: (formData.get('descripcionEvidencias') as string).trim(),
    creadoPor:             session.user.id,
  })

  revalidatePath(`/prevencion/juridico/solicitudes/${solicitudId}`)
}

export async function createContestacion(formData: FormData) {
  const session = await requireAcceso('solicitudes', 'editar')

  const solicitudId = (formData.get('solicitudId') as string).trim()
  const str = (k: string): string | null =>
    (formData.get(k) as string | null)?.trim() || null

  await db.insert(contestaciones).values({
    solicitudId,
    fechaContestacion:   (formData.get('fechaContestacion') as string).trim(),
    archivoPdfUrl:       str('archivoPdfUrl'),
    fechaEntrega:        str('fechaEntrega'),
    horaEntrega:         str('horaEntrega'),
    nombreQuienRecibio:  str('nombreQuienRecibio'),
    creadoPor:           session.user.id,
  })

  await db.update(solicitudesInformacion)
    .set({ status: 'completado', actualizadoEn: sql`now()` })
    .where(eq(solicitudesInformacion.id, solicitudId))

  revalidatePath(`/prevencion/juridico/solicitudes/${solicitudId}`)
  revalidatePath('/prevencion/juridico')
}
