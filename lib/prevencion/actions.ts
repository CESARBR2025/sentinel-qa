'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq }             from 'drizzle-orm'
import { db }             from '@/lib/db/index'
import {
  medidasProteccion, visitasDomiciliarias,
  fichasBusqueda, seguimientosBusqueda,
  solicitudesInformacion, solicitudesC4Internas, contestaciones,
} from '@/lib/db/schema'

export async function createMedida(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autenticado')

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
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autenticado')

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

// ── Búsquedas / Protocolo Alba ────────────────────────────────────────────────

export async function createFicha(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autenticado')

  const str = (k: string): string | null =>
    (formData.get(k) as string | null)?.trim() || null

  const fechaActivacionRaw = (formData.get('fechaActivacion') as string).trim()
  const fechaAceptacionRaw  = str('fechaAceptacion')
  const edadRaw             = str('edad')

  const [row] = await db.insert(fichasBusqueda).values({
    tipo:                 (formData.get('tipo') as string).trim(),
    folio:                str('folio'),
    enlace:               str('enlace'),
    fechaActivacion:      new Date(fechaActivacionRaw),
    carpetaInvestigacion: str('carpetaInvestigacion'),
    nombreDesaparecida:   (formData.get('nombreDesaparecida') as string).trim(),
    edad:                 edadRaw ? parseInt(edadRaw) : null,
    fechaAceptacion:      fechaAceptacionRaw ? new Date(fechaAceptacionRaw) : null,
    rtAtiende:            str('rtAtiende'),
    elementoNovedades:    str('elementoNovedades'),
    creadoPor:            session.user.id,
  }).returning({ id: fichasBusqueda.id })

  revalidatePath('/prevencion/busquedas')
  redirect(`/prevencion/busquedas/${row.id}`)
}

export async function createSeguimiento(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autenticado')

  const fichaId = (formData.get('fichaId') as string).trim()
  const tipo    = (formData.get('tipo') as string).trim()

  await db.insert(seguimientosBusqueda).values({
    fichaId,
    tipo,
    fechaHoraEnvio: new Date(),
    registradoPor:  session.user.id,
  })

  revalidatePath(`/prevencion/busquedas/${fichaId}`)
}

export async function cancelarFicha(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autenticado')

  const fichaId = (formData.get('fichaId') as string).trim()

  await db.update(fichasBusqueda)
    .set({
      status:           'cancelada',
      fechaCancelacion:  new Date((formData.get('fechaCancelacion') as string).trim()),
      fiscalCancela:    (formData.get('fiscalCancela') as string).trim(),
      motivoCancelacion: (formData.get('motivoCancelacion') as string | null)?.trim() || null,
    })
    .where(eq(fichasBusqueda.id, fichaId))

  revalidatePath(`/prevencion/busquedas/${fichaId}`)
  revalidatePath('/prevencion/busquedas')
}

// ── Área Jurídica ─────────────────────────────────────────────────────────────

export async function createSolicitud(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autenticado')

  const str = (k: string): string | null =>
    (formData.get(k) as string | null)?.trim() || null

  const req = (k: string): string =>
    (formData.get(k) as string).trim()

  const fechaAceptacionRaw = str('fechaAceptacion')

  const [row] = await db.insert(solicitudesInformacion).values({
    enlace:               str('enlace'),
    oficio:               req('oficio'),
    fechaActivacion:      new Date(req('fechaActivacion')),
    autoridad:            req('autoridad'),
    fiscalSolicita:       str('fiscalSolicita'),
    delito:               str('delito'),
    carpetaInvestigacion: str('carpetaInvestigacion'),
    solicitudTexto:       str('solicitudTexto'),
    fechaAceptacion:      fechaAceptacionRaw ? new Date(fechaAceptacionRaw) : null,
    status:               'en_juridico',
    creadoPor:            session.user.id,
  }).returning({ id: solicitudesInformacion.id })

  revalidatePath('/prevencion/juridico')
  redirect(`/prevencion/juridico/solicitudes/${row.id}`)
}

export async function createSolicitudC4(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autenticado')

  const solicitudId = (formData.get('solicitudId') as string).trim()

  await db.insert(solicitudesC4Internas).values({
    solicitudId,
    descripcionEvidencias: (formData.get('descripcionEvidencias') as string).trim(),
    creadoPor:             session.user.id,
  })

  revalidatePath(`/prevencion/juridico/solicitudes/${solicitudId}`)
}

export async function createContestacion(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autenticado')

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
    .set({ status: 'completado', actualizadoEn: new Date() })
    .where(eq(solicitudesInformacion.id, solicitudId))

  revalidatePath(`/prevencion/juridico/solicitudes/${solicitudId}`)
  revalidatePath('/prevencion/juridico')
}
