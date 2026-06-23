'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { eq, sql }        from 'drizzle-orm'
import { db }             from '@/lib/db/index'
import { users, roles, incidentes, incidentePersonasAfectadas, incidenteDespacho, incidenteReporteCampo, incidenteExtorsion, incidenteAlarmaEscolar, incidenteDespachoUnidades, incidenteDespachoElementos } from '@/lib/db/schema'
import { generarFolioIncidente } from './folio'
import { registrarAudit }        from './audit'

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function requireOperador() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const [u] = await db
    .select({ rolNombre: roles.nombre })
    .from(users)
    .leftJoin(roles, eq(users.rolId, roles.id))
    .where(eq(users.id, session.user.id))
    .limit(1)

  const rolesPermitidos = ['Administrador', 'Operador']
  if (!u?.rolNombre || !rolesPermitidos.includes(u.rolNombre)) redirect('/dashboard')

  return session
}

const str  = (fd: FormData, k: string) => (fd.get(k) as string | null)?.trim() || null
const req  = (fd: FormData, k: string) => (fd.get(k) as string).trim()
const num  = (fd: FormData, k: string) => { const v = fd.get(k); return v ? Number(v) : null }
const bool = (fd: FormData, k: string) => fd.get(k) === 'true' || fd.get(k) === 'on'

// Valores permitidos — validación en servidor, no confiar en cliente
const CANALES         = ['911', 'whatsapp', 'radio'] as const
const TIPOS_REPORTE   = ['normal', 'extorsion', 'alarma_escolar'] as const
const ESTATUS         = ['sin_despachar', 'en_despacho', 'atendido'] as const
const SEXOS           = ['M', 'F', 'NE'] as const

function validarEnum<T extends string>(valor: string | null, permitidos: readonly T[], campo: string): T {
  if (!valor || !permitidos.includes(valor as T))
    throw new Error(`Valor inválido para ${campo}: ${valor}`)
  return valor as T
}

// ─── Alta de incidente ────────────────────────────────────────────────────────
export async function createIncidente(formData: FormData) {
  const session = await requireOperador()

  const canal       = validarEnum(str(formData, 'canal'),       CANALES,       'canal')
  const tipoReporte = validarEnum(str(formData, 'tipoReporte'), TIPOS_REPORTE, 'tipoReporte')

  // Anonimo y nombre son mutuamente excluyentes
  const anonimo         = bool(formData, 'anonimo')
  const nombreReportante = anonimo ? null : str(formData, 'nombreReportante')

  const sexoRaw = str(formData, 'sexo')
  const sexo    = sexoRaw ? validarEnum(sexoRaw, SEXOS, 'sexo') : null

  const fechaHoraInicio = req(formData, 'fechaHoraInicio')
  const fechaHoraFin    = str(formData, 'fechaHoraFin')

  // Validar que fin no sea anterior a inicio
  if (fechaHoraFin && new Date(fechaHoraFin) < new Date(fechaHoraInicio))
    throw new Error('fechaHoraFin no puede ser anterior a fechaHoraInicio')

  // Estatus inicial según canal
  const estatus = canal === 'radio' ? 'en_despacho' : 'sin_despachar'

  const { folio, consecutivo } = await generarFolioIncidente()

  const [inc] = await db.insert(incidentes).values({
    folio,
    folioConsecutivo:    consecutivo,
    canal,
    tipoReporte,
    nombreReportante,
    anonimo,
    sexo,
    edad:                num(formData, 'edad'),
    esUsuarioFrecuente:  bool(formData, 'esUsuarioFrecuente'),
    esPersonaAfectada:   bool(formData, 'esPersonaAfectada'),
    esMigrante:          bool(formData, 'esMigrante'),
    calle:               str(formData, 'calle'),
    colonia:             str(formData, 'colonia'),
    entreCalles:         str(formData, 'entreCalles'),
    referenciaUbicacion: str(formData, 'referenciaUbicacion'),
    municipio:           str(formData, 'municipio') ?? 'San Juan del Río',
    tipoEmergenciaId:    num(formData, 'tipoEmergenciaId'),
    tipoIncidenteId:     num(formData, 'tipoIncidenteId'),
    prioridadId:         num(formData, 'prioridadId'),
    descripcion:         str(formData, 'descripcion'),
    observaciones:       str(formData, 'observaciones'),
    fechaHoraInicio,
    fechaHoraFin,
    grupoWhatsapp:       canal === 'whatsapp' ? str(formData, 'grupoWhatsapp') : null,
    nombreOficial:       canal === 'radio'    ? str(formData, 'nombreOficial') : null,
    medioCanalizacionId: num(formData, 'medioCanalizacionId'),
    requiereDespacho:    bool(formData, 'requiereDespacho'),
    estatus,
    capturadoPor:        session.user.id,
  }).returning()

  await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidentes', entidadId: inc.id })

  revalidatePath('/incidentes')
  redirect(`/911/whatsapp/incidentes`)
}

// ─── Personas afectadas ───────────────────────────────────────────────────────
export async function addPersonaAfectada(formData: FormData) {
  const session = await requireOperador()

  const incidenteId = req(formData, 'incidenteId')
  const sexoRaw     = str(formData, 'sexo')
  const sexo        = sexoRaw ? validarEnum(sexoRaw, SEXOS, 'sexo') : null

  // Verificar que el incidente existe y no está cerrado
  const [inc] = await db.select({ estatus: incidentes.estatus }).from(incidentes).where(eq(incidentes.id, incidenteId)).limit(1)
  if (!inc) throw new Error('Incidente no encontrado')
  if (inc.estatus === 'atendido') throw new Error('No se puede modificar un incidente atendido')

  await db.insert(incidentePersonasAfectadas).values({
    incidenteId,
    nombre: str(formData, 'nombre'),
    sexo,
    edad:   num(formData, 'edad'),
  })

  await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidente_personas_afectadas', entidadId: incidenteId })
  revalidatePath(`/incidentes/${incidenteId}`)
}

export async function deletePersonaAfectada(formData: FormData) {
  const session = await requireOperador()

  const id          = req(formData, 'id')
  const incidenteId = req(formData, 'incidenteId')

  const [inc] = await db.select({ estatus: incidentes.estatus }).from(incidentes).where(eq(incidentes.id, incidenteId)).limit(1)
  if (!inc) throw new Error('Incidente no encontrado')
  if (inc.estatus === 'atendido') throw new Error('No se puede modificar un incidente atendido')

  await db.delete(incidentePersonasAfectadas).where(eq(incidentePersonasAfectadas.id, id))
  await registrarAudit({ userId: session.user.id, accion: 'DELETE', entidad: 'incidente_personas_afectadas', entidadId: id, payload: { incidenteId } })
  revalidatePath(`/incidentes/${incidenteId}`)
}

// ─── Despacho ─────────────────────────────────────────────────────────────────
export async function createDespacho(formData: FormData) {
  const session     = await requireOperador()
  const incidenteId = req(formData, 'incidenteId')

  const [inc] = await db.select({ estatus: incidentes.estatus })
    .from(incidentes).where(eq(incidentes.id, incidenteId)).limit(1)
  if (!inc) throw new Error('Incidente no encontrado')
  if (inc.estatus !== 'sin_despachar') throw new Error('El incidente no está en estado sin_despachar')

  const [existe] = await db.select({ id: incidenteDespacho.id })
    .from(incidenteDespacho).where(eq(incidenteDespacho.incidenteId, incidenteId)).limit(1)
  if (existe) throw new Error('El incidente ya tiene un despacho asignado')

  // El front manda JSON arrays en campos 'unidades' y 'elementos'
  const unidades: { extId: string; placa: string }[]  = JSON.parse(formData.get('unidades') as string ?? '[]')
  const elementos: { extId: string; nomina: string; nombre: string }[] = JSON.parse(formData.get('elementos') as string ?? '[]')

  if (unidades.length  === 0) throw new Error('Se requiere al menos una unidad')
  if (elementos.length === 0) throw new Error('Se requiere al menos un elemento')

  await db.transaction(async tx => {
    const [despacho] = await tx.insert(incidenteDespacho).values({
      incidenteId,
      despachadorPor: session.user.id,
    }).returning()

    await tx.insert(incidenteDespachoUnidades).values(
      unidades.map(u => ({ despachoId: despacho.id, unidadExtId: u.extId, unidadPlaca: u.placa }))
    )

    await tx.insert(incidenteDespachoElementos).values(
      elementos.map(e => ({ despachoId: despacho.id, elementoExtId: e.extId, elementoNomina: e.nomina, elementoNombre: e.nombre }))
    )

    await tx.update(incidentes)
      .set({ estatus: 'en_despacho', actualizadoEn: sql`now()` })
      .where(eq(incidentes.id, incidenteId))
  })

  await registrarAudit({ userId: session.user.id, accion: 'UPDATE', entidad: 'incidentes', entidadId: incidenteId, payload: { estatus_anterior: 'sin_despachar', estatus_nuevo: 'en_despacho' } })
  revalidatePath(`/incidentes/${incidenteId}`)
}

// ─── Reporte de campo ─────────────────────────────────────────────────────────
export async function createReporteCampo(formData: FormData) {
  const session = await requireOperador()

  const incidenteId = req(formData, 'incidenteId')

  const [inc] = await db.select({ estatus: incidentes.estatus }).from(incidentes).where(eq(incidentes.id, incidenteId)).limit(1)
  if (!inc) throw new Error('Incidente no encontrado')
  if (inc.estatus === 'atendido') throw new Error('El incidente ya está atendido')
  if (inc.estatus === 'sin_despachar') throw new Error('El incidente debe estar en_despacho antes de reportar')

  const [reporteExistente] = await db.select({ id: incidenteReporteCampo.id }).from(incidenteReporteCampo).where(eq(incidenteReporteCampo.incidenteId, incidenteId)).limit(1)
  if (reporteExistente) throw new Error('El incidente ya tiene un reporte de campo')

  const montoRaw  = num(formData, 'montoRobo')
  if (montoRaw !== null && (montoRaw < 0 || !Number.isInteger(montoRaw)))
    throw new Error('montoRobo debe ser un entero positivo')

  await db.transaction(async tx => {
    await tx.insert(incidenteReporteCampo).values({
      incidenteId,
      contenidoReporte:        str(formData, 'contenidoReporte'),
      lugarCalle:              str(formData, 'lugarCalle'),
      lugarColonia:            str(formData, 'lugarColonia'),
      lugarEntreCalles:        str(formData, 'lugarEntreCalles'),
      lugarReferencia:         str(formData, 'lugarReferencia'),
      datosPositivosNegativos: str(formData, 'datosPositivosNegativos'),
      accionesRealizadas:      str(formData, 'accionesRealizadas'),
      hayDetencion:            bool(formData, 'hayDetencion'),
      nombreDetenidos:         str(formData, 'nombreDetenidos'),
      autoridadRecibe:         str(formData, 'autoridadRecibe'),
      expedienteCi:            str(formData, 'expedienteCi'),
      delitoFalta:             str(formData, 'delitoFalta'),
      montoRobo:               montoRaw,
      objetosRecuperados:      str(formData, 'objetosRecuperados'),
      vehiculosRecuperados:    str(formData, 'vehiculosRecuperados'),
      tipoVehiculo:            str(formData, 'tipoVehiculo'),
      destinoVehiculo:         str(formData, 'destinoVehiculo'),
      hayCateo:                bool(formData, 'hayCateo'),
      domicilioCateado:        str(formData, 'domicilioCateado'),
      resultadoCateo:          str(formData, 'resultadoCateo'),
      policiaCargo:            str(formData, 'policiaCargo'),
      personalIngresoCi:       str(formData, 'personalIngresoCi'),
      capturadoPor:            session.user.id,
    })

    await tx.update(incidentes)
      .set({ estatus: 'atendido', actualizadoEn: sql`now()` })
      .where(eq(incidentes.id, incidenteId))
  })

  await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidente_reporte_campo', entidadId: incidenteId, payload: { estatus_anterior: inc.estatus, estatus_nuevo: 'atendido' } })
  revalidatePath(`/incidentes/${incidenteId}`)
}

// ─── Extorsión ────────────────────────────────────────────────────────────────
export async function createExtorsion(formData: FormData) {
  const session = await requireOperador()

  const incidenteId = req(formData, 'incidenteId')

  const [inc] = await db.select({ tipoReporte: incidentes.tipoReporte, estatus: incidentes.estatus }).from(incidentes).where(eq(incidentes.id, incidenteId)).limit(1)
  if (!inc) throw new Error('Incidente no encontrado')
  if (inc.tipoReporte !== 'extorsion') throw new Error('El incidente no es de tipo extorsion')
  if (inc.estatus === 'atendido') throw new Error('No se puede modificar un incidente atendido')

  await db.insert(incidenteExtorsion).values({
    incidenteId,
    telefonoExtorsion: str(formData, 'telefonoExtorsion'),
    grupoDelictivo:    str(formData, 'grupoDelictivo'),
    modusOperandi:     str(formData, 'modusOperandi'),
    unidadResultado:   str(formData, 'unidadResultado'),
    folioReporte:      str(formData, 'folioReporte'),
    fecha:             str(formData, 'fecha'),
  })

  await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidente_extorsion', entidadId: incidenteId })
  revalidatePath(`/incidentes/${incidenteId}`)
}

// ─── Alarma escolar ───────────────────────────────────────────────────────────
export async function createAlarmaEscolar(formData: FormData) {
  const session = await requireOperador()

  const incidenteId = req(formData, 'incidenteId')

  const [inc] = await db.select({ tipoReporte: incidentes.tipoReporte, estatus: incidentes.estatus }).from(incidentes).where(eq(incidentes.id, incidenteId)).limit(1)
  if (!inc) throw new Error('Incidente no encontrado')
  if (inc.tipoReporte !== 'alarma_escolar') throw new Error('El incidente no es de tipo alarma_escolar')
  if (inc.estatus === 'atendido') throw new Error('No se puede modificar un incidente atendido')

  const activaciones = num(formData, 'activaciones') ?? 0
  if (activaciones < 0) throw new Error('activaciones no puede ser negativo')

  await db.insert(incidenteAlarmaEscolar).values({
    incidenteId,
    establecimiento:    str(formData, 'establecimiento'),
    direccion:          str(formData, 'direccion'),
    inmueble:           str(formData, 'inmueble'),
    responsable:        str(formData, 'responsable'),
    reporteDescripcion: str(formData, 'reporteDescripcion'),
    horaCanalizacion:   str(formData, 'horaCanalizacion'),
    unidadArribo:       str(formData, 'unidadArribo'),
    horaArribo:         str(formData, 'horaArribo'),
    nombreResponsable:  str(formData, 'nombreResponsable'),
    nombreVerificador:  str(formData, 'nombreVerificador'),
    activaciones,
  })

  await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidente_alarma_escolar', entidadId: incidenteId })
  revalidatePath(`/incidentes/${incidenteId}`)
}