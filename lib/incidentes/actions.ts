'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { query } from '@/lib/db'
import pool from '@/lib/db'
import { generarFolioIncidente } from './folio'
import { registrarAudit } from './audit'
import { crearReporteCampo } from './service'
import { tienePermiso, Accion } from '@/lib/incidentes/permisos'
import { tryAction, tryActionRaw, AppError, ValidationError, NotFoundError, ForbiddenError, UnauthorizedError } from '@/lib/error-handler'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PRIORIDAD_MAP: Record<string, number> = {
  BAJA: 1, MEDIA: 2, ALTA: 3, CRITICA: 4,
}

async function resolverPrioridadId(tipoIncidenteId: number | null, prioridadForm: number | null): Promise<number | null> {
  if (prioridadForm) return prioridadForm
  if (!tipoIncidenteId) return null
  const result = await query<{ prioridad_catalogo: string | null }>(
    `SELECT prioridad_catalogo FROM cat_tipos_incidente WHERE id = $1 LIMIT 1`,
    [tipoIncidenteId],
  )
  if (!result.rows.length) return null
  const cat = result.rows[0].prioridad_catalogo
  return cat ? (PRIORIDAD_MAP[cat] ?? null) : null
}

// Tipo 7 del Catálogo Nacional de Incidentes de Emergencias (Improcedentes): se registra
// con fines estadísticos pero nunca se canaliza a despacho (regla del estándar SEGOB-CNI).
async function esTipoImprocedente(tipoEmergenciaId: number | null): Promise<boolean> {
  if (!tipoEmergenciaId) return false
  const result = await query<{ codigo: string | null }>(
    `SELECT codigo FROM cat_tipos_emergencia WHERE id = $1 LIMIT 1`,
    [tipoEmergenciaId],
  )
  return result.rows[0]?.codigo === '7'
}

async function notificarMonitoristas(incidenteId: string, folio: string) {
  const monitoristas = await query<{ id: string; name: string }>(
    `SELECT DISTINCT u.id, u.name FROM users u
     INNER JOIN permisos p ON p.usuario_id = u.id
     WHERE p.seccion IN ('solicitudes','detenidos','incidentes_camara')
     AND p.puede_ver = true`,
  )
  if (!monitoristas.rows.length) return

  const values = monitoristas.rows.map((_, i) =>
    `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`
  ).join(', ')
  const params = monitoristas.rows.flatMap(m => [
    m.id, 'incidente_svv',
    `SVV — ${folio}`,
    `Incidente ${folio} — revisar cámaras cercanas.`,
    `/agente_911/ciudadano/incidentes/${incidenteId}`,
  ])
  await query(
    `INSERT INTO notificaciones (user_id, tipo, titulo, mensaje, href) VALUES ${values}`,
    params,
  )
}
async function requireOperador(accion: Accion = 'crear') {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tienePermiso(session.user.id, 'incidentes', accion))) redirect('/dashboard')

  return session
}

const str = (fd: FormData, k: string) => (fd.get(k) as string | null)?.trim() || null
const req = (fd: FormData, k: string) => {
  const v = fd.get(k)
  if (!v) throw new ValidationError(`Campo requerido: ${k}`)
  return String(v).trim()
}
const num = (fd: FormData, k: string) => { const v = fd.get(k); return v ? Number(v) : null }
const bool = (fd: FormData, k: string) => fd.get(k) === 'true' || fd.get(k) === 'on'

// Valores permitidos — validación en servidor, no confiar en cliente
const CANALES = ['911', 'whatsapp', 'radio'] as const
const TIPOS_REPORTE = ['normal', 'extorsion', 'alarma_escolar'] as const
const ESTATUS_INCIDENTE = ['sin_despachar', 'en_despacho', 'en_sitio', 'atendido', 'cerrado_detencion'] as const
type EstatusIncidente = typeof ESTATUS_INCIDENTE[number]
const SEXOS = ['M', 'F', 'NE'] as const
const COORDS_DEFAULT = { lat: 20.3889, lng: -99.9961 }

function validarEnum<T extends string>(valor: string | null, permitidos: readonly T[], campo: string): T {
  if (!valor || !permitidos.includes(valor as T))
    throw new ValidationError(`Valor inválido para ${campo}: ${valor}`)
  return valor as T
}


// ─── Alta de incidente ────────────────────────────────────────────────────────
export async function createIncidente(formData: FormData) {
  const session = await requireOperador()

  const canal = validarEnum(str(formData, 'canal'), CANALES, 'canal')
  const tipoReporte = validarEnum(str(formData, 'tipoReporte'), TIPOS_REPORTE, 'tipoReporte')

  // Anonimo y nombre son mutuamente excluyentes
  const anonimo = bool(formData, 'anonimo')
  const nombreReportante = anonimo ? null : str(formData, 'nombreReportante')

  const sexoRaw = str(formData, 'sexo')
  const sexo = sexoRaw ? validarEnum(sexoRaw, SEXOS, 'sexo') : null

  const fechaHoraInicio = req(formData, 'fechaHoraInicio')
  const fechaHoraFin = str(formData, 'fechaHoraFin')

  // Validar que fin no sea anterior a inicio
  if (fechaHoraFin && new Date(fechaHoraFin) < new Date(fechaHoraInicio))
    throw new ValidationError('fechaHoraFin no puede ser anterior a fechaHoraInicio');


  // Estatus inicial: todo incidente nace sin despachar (rondín incluido — siempre escala)
  const estatus = 'sin_despachar'

  const { folio, consecutivo } = await generarFolioIncidente()
  const tipoIncidenteId = num(formData, 'tipoIncidenteId')
  const prioridadId = await resolverPrioridadId(tipoIncidenteId, num(formData, 'prioridadId'))

  const lat = formData.get('latitud') ? String(formData.get('latitud')) : null;
  const lng = formData.get('longitud') ? String(formData.get('longitud')) : null;

  if (lat && lng && Number(lat) === COORDS_DEFAULT.lat && Number(lng) === COORDS_DEFAULT.lng) {
    if (bool(formData, 'requiereDespacho')) {
      throw new ValidationError('Debes colocar el marcador en la ubicación del incidente antes de canalizar')
    }
  }

  if (bool(formData, 'requiereDespacho') && await esTipoImprocedente(num(formData, 'tipoEmergenciaId'))) {
    throw new ValidationError('Un incidente de tipo Improcedentes no se puede canalizar a despacho — solo se registra con fines estadísticos')
  }


  const inc = await query<{ id: string }>(
    `INSERT INTO incidentes (
      folio, folio_consecutivo, canal, tipo_reporte, nombre_reportante,
      anonimo, sexo, edad, es_usuario_frecuente, es_persona_afectada,
      es_migrante, calle, numero_exterior, numero_interior, colonia,
      entre_calles, referencia_ubicacion, municipio, latitud, longitud,
      tipo_emergencia_id, tipo_incidente_id, prioridad_id, descripcion,
      observaciones, fecha_hora_inicio, fecha_hora_fin, grupo_whatsapp,
      nombre_oficial, medio_canalizacion_id, requiere_despacho, estatus,
      capturado_por, folio_cad, svv_notificado, dependencia_id, telefono_reportante
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37)
    RETURNING id`,
    [
      folio, consecutivo, canal, tipoReporte, nombreReportante,
      anonimo, sexo, num(formData, 'edad'),
      bool(formData, 'esUsuarioFrecuente'), bool(formData, 'esPersonaAfectada'),
      bool(formData, 'esMigrante'),
      str(formData, 'calle'), str(formData, 'numero_exterior'), str(formData, 'numero_interior'),
      str(formData, 'colonia'), str(formData, 'entreCalles'), str(formData, 'referenciaUbicacion'),
      str(formData, 'municipio') ?? 'San Juan del Río',
      lat, lng,
      num(formData, 'tipoEmergenciaId'), tipoIncidenteId, prioridadId,
      str(formData, 'descripcion'), str(formData, 'observaciones'),
      fechaHoraInicio, fechaHoraFin,
      canal === 'whatsapp' ? str(formData, 'grupoWhatsapp') : null,
      canal === 'radio' ? str(formData, 'nombreOficial') : null,
      num(formData, 'medioCanalizacionId'), bool(formData, 'requiereDespacho'),
      estatus, session.user.id, str(formData, 'folioCad'), bool(formData, 'svvNotificado'), num(formData, 'dependenciaId'), str(formData, 'telefonoReportante'),
    ],
  )
  const incidenteId = inc.rows[0].id

  const svvNotificado = bool(formData, 'svvNotificado')
  if (prioridadId === 3 || svvNotificado) {
    await notificarMonitoristas(incidenteId, folio)
  }

  const pNombres = formData.getAll('p_nombre') as string[];
  const pSexos = formData.getAll('p_sexo') as string[];
  const pEdades = formData.getAll('p_edad') as string[];

  const personasParaInsertar = pNombres.map((nombre, i) => {
    if (!nombre.trim()) return null;
    return {
      incidenteId,
      nombre: nombre.trim(),
      sexo: (pSexos[i] as 'M' | 'F' | 'NE') || 'NE',
      edad: pEdades[i] ? Number(pEdades[i]) : null,
    };
  }).filter(Boolean);

  if (personasParaInsertar.length > 0) {
    const placeholders = personasParaInsertar.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(', ')
    const values = personasParaInsertar.flatMap(p => [p!.incidenteId, p!.nombre, p!.sexo, p!.edad])
    await query(
      `INSERT INTO incidente_personas_afectadas (incidente_id, nombre, sexo, edad) VALUES ${placeholders}`,
      values,
    )
  }

  if (formData.get('tipoReporte') === 'extorsion') {
    formData.set('incidenteId', incidenteId);
    await createExtorsion(formData);
  }

  if (formData.get('tipoReporte') === 'alarma_escolar') {
    formData.set('incidenteId', incidenteId);
    await createAlarmaEscolar(formData);
  }

  await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidentes', entidadId: incidenteId })

  let targetPath = `/agente_911/ciudadano/incidentes/${incidenteId}`;
  if (canal === 'whatsapp') {
    targetPath = `/agente_911/whatsapp/incidentes/${incidenteId}`;
  } else if (canal === 'radio') {
    targetPath = `/agente_911/rondin/incidentes/${incidenteId}`;
  }

  const despachadorId = str(formData, 'despachadorId')
  if (despachadorId) {
    await query(
      `INSERT INTO notificaciones (user_id, tipo, titulo, mensaje, href) VALUES ($1, $2, $3, $4, $5)`,
      [despachadorId, 'despacho_asignado', `🚨 Nuevo despacho — ${folio}`, `Se te ha asignado el incidente ${folio}. Revisa el tablón de despacho.`, targetPath],
    )
  }

  revalidatePath('/agente_911/whatsapp');
  revalidatePath('/agente_911/rondin');
  revalidatePath('/agente_911/ciudadano');
  revalidatePath('/incidentes');

  redirect(targetPath);
}

/**
 * Versión para cliente sin redirect — devuelve {id, folio}.
 * Se usa desde el modal de confirmación (Formulario911).
 */
export async function createIncidenteCliente(formData: FormData) {
  const session = await requireOperador()

  const canal = validarEnum(str(formData, 'canal'), CANALES, 'canal')
  const tipoReporte = validarEnum(str(formData, 'tipoReporte'), TIPOS_REPORTE, 'tipoReporte')

  const anonimo = bool(formData, 'anonimo')
  const nombreReportante = anonimo ? null : str(formData, 'nombreReportante')

  const sexoRaw = str(formData, 'sexo')
  const sexo = sexoRaw ? validarEnum(sexoRaw, SEXOS, 'sexo') : null

  const fechaHoraInicio = req(formData, 'fechaHoraInicio')
  const fechaHoraFin = str(formData, 'fechaHoraFin')

  if (fechaHoraFin && new Date(fechaHoraFin) < new Date(fechaHoraInicio))
    throw new ValidationError('fechaHoraFin no puede ser anterior a fechaHoraInicio');

  const estatus = 'sin_despachar'

  const { folio, consecutivo } = await generarFolioIncidente()
  const tipoIncidenteId = num(formData, 'tipoIncidenteId')
  const prioridadId = await resolverPrioridadId(tipoIncidenteId, num(formData, 'prioridadId'))

  const lat = formData.get('latitud') ? String(formData.get('latitud')) : null;
  const lng = formData.get('longitud') ? String(formData.get('longitud')) : null;

  if (lat && lng && Number(lat) === COORDS_DEFAULT.lat && Number(lng) === COORDS_DEFAULT.lng) {
    if (bool(formData, 'requiereDespacho')) {
      throw new ValidationError('Debes colocar el marcador en la ubicación del incidente antes de canalizar')
    }
  }

  if (bool(formData, 'requiereDespacho') && await esTipoImprocedente(num(formData, 'tipoEmergenciaId'))) {
    throw new ValidationError('Un incidente de tipo Improcedentes no se puede canalizar a despacho — solo se registra con fines estadísticos')
  }

  const inc = await query<{ id: string }>(
    `INSERT INTO incidentes (
      folio, folio_consecutivo, canal, tipo_reporte, nombre_reportante,
      anonimo, sexo, edad, es_usuario_frecuente, es_persona_afectada,
      es_migrante, calle, numero_exterior, numero_interior, colonia,
      entre_calles, referencia_ubicacion, municipio, latitud, longitud,
      tipo_emergencia_id, tipo_incidente_id, prioridad_id, descripcion,
      observaciones, fecha_hora_inicio, fecha_hora_fin, grupo_whatsapp,
      nombre_oficial, medio_canalizacion_id, requiere_despacho, estatus,
      capturado_por, folio_cad, svv_notificado, dependencia_id, telefono_reportante
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37)
    RETURNING id`,
    [
      folio, consecutivo, canal, tipoReporte, nombreReportante,
      anonimo, sexo, num(formData, 'edad'),
      bool(formData, 'esUsuarioFrecuente'), bool(formData, 'esPersonaAfectada'),
      bool(formData, 'esMigrante'),
      str(formData, 'calle'), str(formData, 'numero_exterior'), str(formData, 'numero_interior'),
      str(formData, 'colonia'), str(formData, 'entreCalles'), str(formData, 'referenciaUbicacion'),
      str(formData, 'municipio') ?? 'San Juan del Río',
      lat, lng,
      num(formData, 'tipoEmergenciaId'), tipoIncidenteId, prioridadId,
      str(formData, 'descripcion'), str(formData, 'observaciones'),
      fechaHoraInicio, fechaHoraFin,
      canal === 'whatsapp' ? str(formData, 'grupoWhatsapp') : null,
      canal === 'radio' ? str(formData, 'nombreOficial') : null,
      num(formData, 'medioCanalizacionId'), bool(formData, 'requiereDespacho'),
      estatus, session.user.id, str(formData, 'folioCad'), bool(formData, 'svvNotificado'), num(formData, 'dependenciaId'), str(formData, 'telefonoReportante'),
    ],
  )
  const incidenteId = inc.rows[0].id

  const svvNotificado = bool(formData, 'svvNotificado')
  if (prioridadId === 3 || svvNotificado) {
    await notificarMonitoristas(incidenteId, folio)
  }

  const despachadorId = str(formData, 'despachadorId')
  if (despachadorId) {
    await query(
      `INSERT INTO notificaciones (user_id, tipo, titulo, mensaje, href) VALUES ($1, $2, $3, $4, $5)`,
      [despachadorId, 'despacho_asignado', `🚨 Nuevo despacho — ${folio}`, `Se te ha asignado el incidente ${folio}. Revisa el tablón de despacho.`, `/agente_911/ciudadano/incidentes/${incidenteId}`],
    )
  }

  const pNombres = formData.getAll('p_nombre') as string[];
  const pSexos = formData.getAll('p_sexo') as string[];
  const pEdades = formData.getAll('p_edad') as string[];

  const personasParaInsertar = pNombres.map((nombre, i) => {
    if (!nombre.trim()) return null;
    return {
      incidenteId,
      nombre: nombre.trim(),
      sexo: (pSexos[i] as 'M' | 'F' | 'NE') || 'NE',
      edad: pEdades[i] ? Number(pEdades[i]) : null,
    };
  }).filter(Boolean);

  if (personasParaInsertar.length > 0) {
    const placeholders = personasParaInsertar.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(', ')
    const values = personasParaInsertar.flatMap(p => [p!.incidenteId, p!.nombre, p!.sexo, p!.edad])
    await query(
      `INSERT INTO incidente_personas_afectadas (incidente_id, nombre, sexo, edad) VALUES ${placeholders}`,
      values,
    )
  }

  if (formData.get('tipoReporte') === 'extorsion') {
    formData.set('incidenteId', incidenteId);
    await createExtorsion(formData);
  }

  if (formData.get('tipoReporte') === 'alarma_escolar') {
    formData.set('incidenteId', incidenteId);
    await createAlarmaEscolar(formData);
  }

  await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidentes', entidadId: incidenteId })

  revalidatePath('/agente_911/whatsapp');
  revalidatePath('/agente_911/rondin');
  revalidatePath('/agente_911/ciudadano');
  revalidatePath('/incidentes');

  return { id: incidenteId, folio }
}
// ─── Personas afectadas ───────────────────────────────────────────────────────
export async function addPersonaAfectada(formData: FormData) {
  const session = await requireOperador()

  const incidenteId = req(formData, 'incidenteId')
  const sexoRaw = str(formData, 'sexo')
  const sexo = sexoRaw ? validarEnum(sexoRaw, SEXOS, 'sexo') : null

  await tryActionRaw(async () => {
    const incResult = await query<{ estatus: string }>(
      `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
      [incidenteId],
    )
    if (!incResult.rows[0]) throw new NotFoundError('Incidente no encontrado')
    const est1 = incResult.rows[0].estatus
    if (est1 === 'atendido' || est1 === 'cerrado_detencion') throw new ValidationError('No se puede modificar un incidente cerrado')

    await query(
      `INSERT INTO incidente_personas_afectadas (incidente_id, nombre, sexo, edad) VALUES ($1, $2, $3, $4)`,
      [incidenteId, str(formData, 'nombre'), sexo, num(formData, 'edad')],
    )

    await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidente_personas_afectadas', entidadId: incidenteId })
  })

  revalidatePath(`/incidentes/${incidenteId}`)
}

export async function deletePersonaAfectada(formData: FormData) {
  const session = await requireOperador('eliminar')

  const id = req(formData, 'id')
  const incidenteId = req(formData, 'incidenteId')

  await tryActionRaw(async () => {
    const incResult = await query<{ estatus: string }>(
      `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
      [incidenteId],
    )
    if (!incResult.rows[0]) throw new NotFoundError('Incidente no encontrado')
    const est2 = incResult.rows[0].estatus
    if (est2 === 'atendido' || est2 === 'cerrado_detencion') throw new ValidationError('No se puede modificar un incidente cerrado')

    await query(`DELETE FROM incidente_personas_afectadas WHERE id = $1`, [id])
    await registrarAudit({ userId: session.user.id, accion: 'DELETE', entidad: 'incidente_personas_afectadas', entidadId: id, payload: { incidenteId } })
  })

  revalidatePath(`/incidentes/${incidenteId}`)
}


/**
 * Rondín escalado — REGLA DE NEGOCIO: todo reporte de rondín genera solicitud
 * de despacho. El resultado (acciones, detenidos, cateo) lo captura el oficial
 * despachado al cerrar con su reporte de campo (ofi_reportes_campo).
 */
export async function createRondinEscalado(formData: FormData) {
  console.log('[RONDIN] ===== INICIO =====')
  console.log('[RONDIN] formData keys:', [...formData.keys()].join(', '))
  console.log('[RONDIN] formData entries:', JSON.stringify(Object.fromEntries(formData.entries())))

  try {
    const session = await requireOperador()
    console.log('[RONDIN] session OK:', session.user.id)

    const fechaHoraInicio = req(formData, 'fechaHoraInicio')
    console.log('[RONDIN] fechaHoraInicio:', fechaHoraInicio)

    const folioForm = str(formData, 'folio')
    const consecutivoForm = num(formData, 'folioConsecutivo')
    console.log('[RONDIN] folioForm:', folioForm, 'consecutivoForm:', consecutivoForm)
        const { folio, consecutivo } = (folioForm && consecutivoForm)
          ? { folio: folioForm, consecutivo: consecutivoForm }
          : await generarFolioIncidente()
        console.log('[RONDIN] folio usado:', folio, 'consecutivo:', consecutivo)
        const tipoIncidenteId = num(formData, 'tipoIncidenteId')
        const prioridadId = await resolverPrioridadId(tipoIncidenteId, num(formData, 'prioridadId'))

        const lat = formData.get('latitud') ? String(formData.get('latitud')) : null
        const lng = formData.get('longitud') ? String(formData.get('longitud')) : null

        const anonimo = bool(formData, 'anonimo')
        const nombreOficial = str(formData, 'nombreOficial')
        console.log('[RONDIN] anonimo:', anonimo, 'nombreOficial:', nombreOficial)

        const esImprocedente = await esTipoImprocedente(num(formData, 'tipoEmergenciaId'))
        console.log('[RONDIN] esImprocedente:', esImprocedente)

        const { incidenteId, esOficial } = await tryActionRaw(async () => {
          const cliente = await pool.connect()
          try {
            await cliente.query('BEGIN')

            const inc = await cliente.query<{ id: string }>(
              `INSERT INTO incidentes (
                folio, folio_consecutivo, canal, tipo_reporte, nombre_reportante,
                anonimo, calle, colonia, entre_calles, referencia_ubicacion,
                municipio, latitud, longitud,
                tipo_emergencia_id, tipo_incidente_id, prioridad_id,
                descripcion, observaciones, fecha_hora_inicio,
                nombre_oficial, requiere_despacho, estatus, origen_rondin, capturado_por, folio_cad, svv_notificado, dependencia_id, telefono_reportante
              ) VALUES ($1,$2,'radio','normal',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'sin_despachar',true,$20,$21,false,23,null)
              RETURNING id`,
              [
                folio, consecutivo,
                anonimo ? null : str(formData, 'nombreReportante'),
                anonimo,
                str(formData, 'calle'), str(formData, 'colonia'),
                str(formData, 'entreCalles'), str(formData, 'referenciaUbicacion'),
                str(formData, 'municipio') ?? 'San Juan del Río',
                lat, lng,
                num(formData, 'tipoEmergenciaId'), tipoIncidenteId, prioridadId,
            str(formData, 'descripcion'), str(formData, 'observaciones'),
            fechaHoraInicio,
            nombreOficial,
            !esImprocedente,
            session.user.id, str(formData, 'folioCad'),
          ],
        )
        const incId = inc.rows[0].id
        console.log('[RONDIN] incidente creado ID:', incId)

        const ofi = await cliente.query<{ id: string; no_nomina: string | null }>(
          `SELECT id, no_nomina FROM ofi_oficiales WHERE user_id = $1 AND ofi_estatus = 'activo' LIMIT 1`,
          [session.user.id],
        )
        const oficialId = ofi.rows[0]?.id ?? null
        const oficialNomina = ofi.rows[0]?.no_nomina ?? null
        console.log('[RONDIN] oficial match:', { oficialId, oficialNomina })

        if (esImprocedente) {
          console.log('[RONDIN] tipo Improcedentes: se omite creación de despacho — solo registro estadístico')
        } else {
          const despacho = await cliente.query<{ id: string }>(
            `INSERT INTO incidente_despacho (incidente_id, despachado_por) VALUES ($1, $2) RETURNING id`,
            [incId, session.user.id],
          )
          await cliente.query(
            `INSERT INTO incidente_despacho_elementos (despacho_id, elemento_ext_id, elemento_nomina, elemento_nombre, oficial_id, es_prioritario)
             VALUES ($1, $2, $3, $4, $5, true)`,
            [despacho.rows[0].id, oficialNomina, oficialNomina, nombreOficial, oficialId],
          )
          console.log('[RONDIN] despacho + elementos INSERT OK')
        }

        await cliente.query('COMMIT')
        console.log('[RONDIN] TRANSACTION COMMITTED')
        return { incidenteId: incId, esOficial: oficialId !== null }
      } catch (err) {
        await cliente.query('ROLLBACK')
        console.error('[RONDIN] TRANSACTION ROLLBACK:', err)
        throw err
      } finally {
        cliente.release()
      }
    })

    console.log('[RONDIN] tryActionRaw result:', { incidenteId, esOficial })

    await registrarAudit({
      userId: session.user.id,
      accion: 'CREATE',
      entidad: 'incidentes',
      entidadId: incidenteId,
      payload: { origen: 'rondin_escalado', prioritario: nombreOficial },
    })
    console.log('[RONDIN] audit registrado')

    if (prioridadId === 3) {
      await notificarMonitoristas(incidenteId, folio)
    }

    revalidatePath('/agente_911/rondin')
    revalidatePath('/oficial/despachos')
    revalidatePath('/incidentes')

    console.log('[RONDIN] redirigiendo a:', esOficial ? `/oficial/rondin?exito=1&folio=${encodeURIComponent(folio)}` : `/agente_911/rondin/incidentes/${incidenteId}`)
    if (esOficial) redirect(`/oficial/rondin?exito=1&folio=${encodeURIComponent(folio)}`)
    redirect(`/agente_911/rondin/incidentes/${incidenteId}`)
  } catch (err) {
    if (err instanceof Error && 'digest' in err && String(err.digest).startsWith('NEXT_REDIRECT')) throw err
    console.error('[RONDIN] ERROR GLOBAL:', err)
    throw err
  }
}

/** @deprecated El rondín ya no se auto-cierra: usar createRondinEscalado. Se conserva solo por referencia histórica. */
export async function createRecorridoCompleto(formData: FormData) {
  const session = await requireOperador()

  // Insertar incidente sin redirect
  const inc = await tryActionRaw(async () => insertarIncidente(formData, session))

  // Insertar reporte de campo
  const vehiculosRaw = str(formData, 'vehiculos')
  const vehiculos = vehiculosRaw ? JSON.parse(vehiculosRaw) : []
  const montoRaw = num(formData, 'montoRobo')

  await tryActionRaw(async () => {
    await crearReporteCampo({
      incidenteId: inc.id,
      contenidoReporte: str(formData, 'contenidoReporte'),
      lugarCalle: str(formData, 'calle'),
      lugarColonia: str(formData, 'colonia'),
      lugarEntreCalles: str(formData, 'entreCalles'),
      lugarReferencia: str(formData, 'referenciaUbicacion'),
      datosPositivosNegativos: str(formData, 'datosPositivosNegativos'),
      accionesRealizadas: str(formData, 'accionesRealizadas'),
      hayDetencion: bool(formData, 'hayDetencion'),
      nombreDetenidos: str(formData, 'nombreDetenidos'),
      autoridadRecibe: str(formData, 'autoridadRecibe'),
      expedienteCi: str(formData, 'expedienteCi'),
      delitoFalta: str(formData, 'delitoFalta'),
      hayRobo: bool(formData, 'hayRobo'),
      montoRobo: montoRaw,
      objetosRecuperados: str(formData, 'objetosRecuperados'),
      hayVehiculo: bool(formData, 'hayVehiculo'),
      vehiculos,
      hayCateo: bool(formData, 'hayCateo'),
      domicilioCateado: str(formData, 'domicilioCateado'),
      cateoCalle: str(formData, 'cateoCalle'),
      cateoColonia: str(formData, 'cateoColonia'),
      cateoLatitud: str(formData, 'cateoLatitud'),
      cateoLongitud: str(formData, 'cateoLongitud'),
      resultadoCateo: str(formData, 'resultadoCateo'),
      policiaACargo: str(formData, 'policiaCargo'),
      personalIngresoCi: str(formData, 'personalIngresoCi'),
      capturadoPor: session.user.id,
      hayOrdenAprehension: bool(formData, 'hay_orden_aprehension'),
      ordenesAprehension: JSON.parse(str(formData, 'ordenes_aprehension') ?? '[]'),
      hayHidrocarburo: bool(formData, 'hay_hidrocarburo'),
      hidrocarburos: JSON.parse(str(formData, 'hidrocarburos') ?? '[]'),
      hayArmaFuego: bool(formData, 'hay_arma_fuego'),
      armasFuego: JSON.parse(str(formData, 'armas_fuego') ?? '[]'),
      hayDroga: bool(formData, 'hay_droga'),
      drogas: JSON.parse(str(formData, 'drogas') ?? '[]'),
      observaciones: str(formData, 'observaciones'),
      apoyoFiestasPatronales: bool(formData, 'apoyo_fiestas_patronales'),
      operativosMetropolitano: bool(formData, 'operativos_metropolitano'),
      eco8: bool(formData, 'eco8'),
      alcoholimetria: bool(formData, 'alcoholimetria'),
      motocicletas: bool(formData, 'motocicletas'),
      apoyoActuarios: bool(formData, 'apoyo_actuarios'),
      apoyoCateosFgr: bool(formData, 'apoyo_cateos_fgr'),
      apoyoCateosFge: bool(formData, 'apoyo_cateos_fge'),
    })
  })

  revalidatePath('/911/rondin')
  revalidatePath('/incidentes')
  redirect(`/911/rondin/incidentes/${inc.id}`)
}

// ─── Despacho ─────────────────────────────────────────────────────────────────
export async function createDespacho(formData: FormData) {
  const session = await requireOperador()
  const incidenteId = req(formData, 'incidenteId')

  await tryActionRaw(async () => {
    const cliente = await pool.connect()
    try {
      const inc = await cliente.query<{ estatus: string }>(
        `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
        [incidenteId],
      )
      if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
      if (inc.rows[0].estatus !== 'sin_despachar') throw new ValidationError('El incidente no está en estado sin_despachar')

      const existe = await cliente.query<{ id: string }>(
        `SELECT id FROM incidente_despacho WHERE incidente_id = $1 LIMIT 1`,
        [incidenteId],
      )

      const unidades: { extId: string; placa: string }[] = JSON.parse(formData.get('unidades') as string ?? '[]')
      const elementos: { extId: string; nomina: string; nombre: string }[] = JSON.parse(formData.get('elementos') as string ?? '[]')

      await cliente.query('BEGIN')

      // Si ya existe un despacho (rondín con prioritario), reusarlo; si no, crear uno nuevo
      let despachoId: string
      if (existe.rows[0]) {
        despachoId = existe.rows[0].id
      } else {
        if (unidades.length === 0) throw new ValidationError('Se requiere al menos una unidad')
        if (elementos.length === 0) throw new ValidationError('Se requiere al menos un elemento')
        const despacho = await cliente.query<{ id: string }>(
          `INSERT INTO incidente_despacho (incidente_id, despachado_por) VALUES ($1, $2) RETURNING id`,
          [incidenteId, session.user.id],
        )
        despachoId = despacho.rows[0].id
      }

      for (const u of unidades) {
        await cliente.query(
          `INSERT INTO incidente_despacho_unidades (despacho_id, unidad_ext_id, unidad_placa) VALUES ($1, $2, $3)`,
          [despachoId, u.extId, u.placa],
        )
      }

      for (const e of elementos) {
        // Match automático nómina → oficial con cuenta en el sistema (NULL si es elemento externo)
        await cliente.query(
          `INSERT INTO incidente_despacho_elementos (despacho_id, elemento_ext_id, elemento_nomina, elemento_nombre, oficial_id)
           VALUES ($1, $2, $3, $4, (SELECT id FROM ofi_oficiales WHERE no_nomina = $3 AND ofi_estatus = 'activo' LIMIT 1))`,
          [despachoId, e.extId, e.nomina, e.nombre],
        )
      }

      await cliente.query(
        `UPDATE incidentes SET estatus = 'en_despacho', actualizado_en = NOW() WHERE id = $1`,
        [incidenteId],
      )

      await cliente.query('COMMIT')
    } catch (err) {
      await cliente.query('ROLLBACK')
      throw err
    } finally {
      cliente.release()
    }
  })

  await registrarAudit({ userId: session.user.id, accion: 'UPDATE', entidad: 'incidentes', entidadId: incidenteId, payload: { estatus_anterior: 'sin_despachar', estatus_nuevo: 'en_despacho' } })
  revalidatePath('/incidentes')
  revalidatePath('/agente_911/despacho')
}

// ─── Refuerzos ────────────────────────────────────────────────────────────────
/** Agrega unidades/elementos ADICIONALES a un folio ya activo (911 o rondín) sin re-despachar ni cerrar. */
export async function enviarRefuerzos(formData: FormData) {
  const session = await requireOperador()
  const incidenteId = req(formData, 'incidenteId')

  await tryActionRaw(async () => {
    const cliente = await pool.connect()
    try {
      const inc = await cliente.query<{ estatus: string }>(
        `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
        [incidenteId],
      )
      if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
      if (inc.rows[0].estatus !== 'en_despacho' && inc.rows[0].estatus !== 'en_sitio')
        throw new ValidationError('Solo se pueden enviar refuerzos a un folio activo (en despacho o en sitio)')

      const desp = await cliente.query<{ id: string }>(
        `SELECT id FROM incidente_despacho WHERE incidente_id = $1 LIMIT 1`,
        [incidenteId],
      )
      if (!desp.rows[0]) throw new ValidationError('El incidente no tiene despacho para reforzar')
      const despachoId = desp.rows[0].id

      const unidades: { extId: string; placa: string }[] = JSON.parse(formData.get('unidades') as string ?? '[]')
      const elementos: { extId: string; nomina: string; nombre: string }[] = JSON.parse(formData.get('elementos') as string ?? '[]')

      if (unidades.length === 0 && elementos.length === 0)
        throw new ValidationError('Agrega al menos una unidad o un elemento de refuerzo')

      await cliente.query('BEGIN')

      for (const u of unidades) {
        await cliente.query(
          `INSERT INTO incidente_despacho_unidades (despacho_id, unidad_ext_id, unidad_placa, es_refuerzo) VALUES ($1, $2, $3, true)`,
          [despachoId, u.extId, u.placa],
        )
      }
      for (const e of elementos) {
        await cliente.query(
          `INSERT INTO incidente_despacho_elementos (despacho_id, elemento_ext_id, elemento_nomina, elemento_nombre, oficial_id, es_refuerzo)
           VALUES ($1, $2, $3, $4, (SELECT id FROM ofi_oficiales WHERE no_nomina = $3 AND ofi_estatus = 'activo' LIMIT 1), true)`,
          [despachoId, e.extId, e.nomina, e.nombre],
        )
      }

      await cliente.query(
        `UPDATE incidentes SET actualizado_en = NOW() WHERE id = $1`,
        [incidenteId],
      )

      await cliente.query('COMMIT')
    } catch (err) {
      await cliente.query('ROLLBACK')
      throw err
    } finally {
      cliente.release()
    }
  })

  await registrarAudit({ userId: session.user.id, accion: 'UPDATE', entidad: 'incidente_despacho', entidadId: incidenteId, payload: { refuerzo: true } })
  revalidatePath(`/incidentes/${incidenteId}`)
}

// ─── Hora de salida/llegada por unidad despachada ──────────────────────────────
/** Timestamp por unidad (no por incidente) — alinea con form-003 del estándar SEGOB-CNI. Idempotente: no sobrescribe una hora ya registrada. */
export async function marcarHoraUnidadDespacho(unidadId: string, campo: 'salida' | 'llegada') {
  const session = await requireOperador()
  const columna = campo === 'salida' ? 'hora_salida' : 'hora_llegada'

  const incidenteId = await tryActionRaw(async () => {
    const row = await query<{ incidente_id: string }>(
      `SELECT i.id AS incidente_id FROM incidente_despacho_unidades du
       JOIN incidente_despacho d ON du.despacho_id = d.id
       JOIN incidentes i ON d.incidente_id = i.id
       WHERE du.id = $1 LIMIT 1`,
      [unidadId],
    )
    if (!row.rows[0]) throw new NotFoundError('Unidad de despacho no encontrada')

    await query(
      `UPDATE incidente_despacho_unidades SET ${columna} = COALESCE(${columna}, NOW()) WHERE id = $1`,
      [unidadId],
    )
    return row.rows[0].incidente_id
  })

  await registrarAudit({ userId: session.user.id, accion: 'UPDATE', entidad: 'incidente_despacho_unidades', entidadId: unidadId, payload: { campo: columna } })
  revalidatePath(`/incidentes/${incidenteId}`)
  revalidatePath('/incidentes')
}

// ─── Cerrar por detención (desde D1) ──────────────────────────────────────────
export async function cerrarPorDetencion(incidenteId: string) {
  const session = await requireOperador()

  await tryActionRaw(async () => {
    const inc = await query<{ estatus: string }>(
      `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
      [incidenteId],
    )
    if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
    const est = inc.rows[0].estatus
    if (est !== 'en_sitio' && est !== 'en_despacho') throw new ValidationError('El incidente no está en estado válido para cierre por detención')

    await query(
      `UPDATE incidentes SET estatus = 'cerrado_detencion', actualizado_en = NOW() WHERE id = $1`,
      [incidenteId],
    )
  })

  await registrarAudit({ userId: session.user.id, accion: 'UPDATE', entidad: 'incidentes', entidadId: incidenteId, payload: { estatus_nuevo: 'cerrado_detencion' } })
  revalidatePath(`/incidentes/${incidenteId}`)
}

// ─── Reporte de campo ─────────────────────────────────────────────────────────
export async function createReporteCampo(formData: FormData) {
  const session = await requireOperador()

  const vehiculosRaw = str(formData, 'vehiculos')
  const vehiculos = vehiculosRaw ? JSON.parse(vehiculosRaw) : []

  const montoRaw = num(formData, 'montoRobo')

  await tryActionRaw(async () => {
    const { estatusAnterior } = await crearReporteCampo({
      incidenteId: req(formData, 'incidenteId'),
      contenidoReporte: str(formData, 'contenidoReporte'),
      lugarCalle: str(formData, 'lugarCalle'),
      lugarColonia: str(formData, 'lugarColonia'),
      lugarEntreCalles: str(formData, 'lugarEntreCalles'),
      lugarReferencia: str(formData, 'lugarReferencia'),
      datosPositivosNegativos: str(formData, 'datosPositivosNegativos'),
      accionesRealizadas: str(formData, 'accionesRealizadas'),
      hayDetencion: bool(formData, 'hayDetencion'),
      nombreDetenidos: str(formData, 'nombreDetenidos'),
      autoridadRecibe: str(formData, 'autoridadRecibe'),
      expedienteCi: str(formData, 'expedienteCi'),
      delitoFalta: str(formData, 'delitoFalta'),
      hayRobo: bool(formData, 'hayRobo'),
      montoRobo: montoRaw,
      objetosRecuperados: str(formData, 'objetosRecuperados'),
      hayVehiculo: bool(formData, 'hayVehiculo'),
      vehiculos,
      hayCateo: bool(formData, 'hayCateo'),
      domicilioCateado: str(formData, 'domicilioCateado'),
      cateoCalle: str(formData, 'cateoCalle'),
      cateoColonia: str(formData, 'cateoColonia'),
      cateoLatitud: str(formData, 'cateoLatitud'),
      cateoLongitud: str(formData, 'cateoLongitud'),
      resultadoCateo: str(formData, 'resultadoCateo'),
      policiaACargo: str(formData, 'policiaCargo'),
      personalIngresoCi: str(formData, 'personalIngresoCi'),
      capturadoPor: session.user.id,
      hayOrdenAprehension: bool(formData, 'hay_orden_aprehension'),
      ordenesAprehension: JSON.parse(str(formData, 'ordenes_aprehension') ?? '[]'),
      hayHidrocarburo: bool(formData, 'hay_hidrocarburo'),
      hidrocarburos: JSON.parse(str(formData, 'hidrocarburos') ?? '[]'),
      hayArmaFuego: bool(formData, 'hay_arma_fuego'),
      armasFuego: JSON.parse(str(formData, 'armas_fuego') ?? '[]'),
      hayDroga: bool(formData, 'hay_droga'),
      drogas: JSON.parse(str(formData, 'drogas') ?? '[]'),
      observaciones: str(formData, 'observaciones'),
      apoyoFiestasPatronales: bool(formData, 'apoyo_fiestas_patronales'),
      operativosMetropolitano: bool(formData, 'operativos_metropolitano'),
      eco8: bool(formData, 'eco8'),
      alcoholimetria: bool(formData, 'alcoholimetria'),
      motocicletas: bool(formData, 'motocicletas'),
      apoyoActuarios: bool(formData, 'apoyo_actuarios'),
      apoyoCateosFgr: bool(formData, 'apoyo_cateos_fgr'),
      apoyoCateosFge: bool(formData, 'apoyo_cateos_fge'),
    })
  })

  const incidenteId = req(formData, 'incidenteId')

  revalidatePath(`/incidentes/${incidenteId}`)
}

// Versión sin redirect — para uso interno
async function insertarIncidente(formData: FormData, session: Awaited<ReturnType<typeof requireOperador>>) {
  const canal = validarEnum(str(formData, 'canal'), CANALES, 'canal')
  const tipoReporte = validarEnum(str(formData, 'tipoReporte'), TIPOS_REPORTE, 'tipoReporte')

  const anonimo = bool(formData, 'anonimo')
  const nombreReportante = anonimo ? null : str(formData, 'nombreReportante')

  const sexoRaw = str(formData, 'sexo')
  const sexo = sexoRaw ? validarEnum(sexoRaw, SEXOS, 'sexo') : null

  const fechaHoraInicio = req(formData, 'fechaHoraInicio')
  const fechaHoraFin = str(formData, 'fechaHoraFin')

  if (fechaHoraFin && new Date(fechaHoraFin) < new Date(fechaHoraInicio))
    throw new ValidationError('fechaHoraFin no puede ser anterior a fechaHoraInicio')

  const estatus = canal === 'radio' ? 'en_despacho' : 'sin_despachar'
  const { folio, consecutivo } = await generarFolioIncidente()
  const tipoIncidenteId = num(formData, 'tipoIncidenteId')
  const prioridadId = await resolverPrioridadId(tipoIncidenteId, num(formData, 'prioridadId'))

  const lat = formData.get('latitud') ? String(formData.get('latitud')) : null
  const lng = formData.get('longitud') ? String(formData.get('longitud')) : null

  const inc = await query<{ id: string }>(
    `INSERT INTO incidentes (
      folio, folio_consecutivo, canal, tipo_reporte, nombre_reportante,
      anonimo, sexo, edad, es_usuario_frecuente, es_persona_afectada,
      es_migrante, calle, numero_exterior, numero_interior, colonia,
      entre_calles, referencia_ubicacion, municipio, latitud, longitud,
      tipo_emergencia_id, tipo_incidente_id, prioridad_id, descripcion,
      observaciones, fecha_hora_inicio, fecha_hora_fin, grupo_whatsapp,
      nombre_oficial, medio_canalizacion_id, requiere_despacho, estatus,
      capturado_por, folio_cad, svv_notificado, dependencia_id, telefono_reportante
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37)
    RETURNING id`,
    [
      folio, consecutivo, canal, tipoReporte, nombreReportante,
      anonimo, sexo, num(formData, 'edad'),
      bool(formData, 'esUsuarioFrecuente'), bool(formData, 'esPersonaAfectada'),
      bool(formData, 'esMigrante'),
      str(formData, 'calle'), str(formData, 'numero_exterior'), str(formData, 'numero_interior'),
      str(formData, 'colonia'), str(formData, 'entreCalles'), str(formData, 'referenciaUbicacion'),
      str(formData, 'municipio') ?? 'San Juan del Río',
      lat, lng,
      num(formData, 'tipoEmergenciaId'), tipoIncidenteId, prioridadId,
      str(formData, 'descripcion'), str(formData, 'observaciones'),
      fechaHoraInicio, fechaHoraFin,
      canal === 'whatsapp' ? str(formData, 'grupoWhatsapp') : null,
      canal === 'radio' ? str(formData, 'nombreOficial') : null,
      num(formData, 'medioCanalizacionId'), bool(formData, 'requiereDespacho'),
      estatus, session.user.id, str(formData, 'folioCad'), bool(formData, 'svvNotificado'), num(formData, 'dependenciaId'), str(formData, 'telefonoReportante'),
    ],
  )
  const result = { id: inc.rows[0].id }

  await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidentes', entidadId: result.id })

  return result
}

// ─── Extorsión ────────────────────────────────────────────────────────────────
export async function createExtorsion(formData: FormData) {
  const session = await requireOperador()

  const incidenteId = req(formData, 'incidenteId')

  await tryActionRaw(async () => {
    const inc = await query<{ tipo_reporte: string; estatus: string }>(
      `SELECT tipo_reporte, estatus FROM incidentes WHERE id = $1 LIMIT 1`,
      [incidenteId],
    )
    if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
    if (inc.rows[0].tipo_reporte !== 'extorsion') throw new ValidationError('El incidente no es de tipo extorsion')
    const est3 = inc.rows[0].estatus
    if (est3 === 'atendido' || est3 === 'cerrado_detencion') throw new ValidationError('No se puede modificar un incidente cerrado')

    await query(
      `INSERT INTO incidente_extorsion (incidente_id, telefono_extorsion, grupo_delictivo, modus_operandi, unidad_resultado, folio_reporte, fecha) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        incidenteId,
        str(formData, 'telefonoExtorsion'), str(formData, 'grupoDelictivo'),
        str(formData, 'modusOperandi'), str(formData, 'unidadResultado'),
        str(formData, 'folioReporte'), str(formData, 'fecha'),
      ],
    )

    await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidente_extorsion', entidadId: incidenteId })
  })

  revalidatePath(`/incidentes/${incidenteId}`)
}

// ─── Alarma escolar ───────────────────────────────────────────────────────────
export async function createAlarmaEscolar(formData: FormData) {
  const session = await requireOperador()

  const incidenteId = req(formData, 'incidenteId')

  await tryActionRaw(async () => {
    const inc = await query<{ tipo_reporte: string; estatus: string }>(
      `SELECT tipo_reporte, estatus FROM incidentes WHERE id = $1 LIMIT 1`,
      [incidenteId],
    )
    if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
    if (inc.rows[0].tipo_reporte !== 'alarma_escolar') throw new ValidationError('El incidente no es de tipo alarma_escolar')
    const est4 = inc.rows[0].estatus
    if (est4 === 'atendido' || est4 === 'cerrado_detencion') throw new ValidationError('No se puede modificar un incidente cerrado')

    const activaciones = num(formData, 'activaciones') ?? 0
    if (activaciones < 0) throw new ValidationError('activaciones no puede ser negativo')

    await query(
      `INSERT INTO incidente_alarma_escolar (incidente_id, establecimiento, direccion, inmueble, responsable, reporte_descripcion, hora_canalizacion, unidad_arribo, hora_arribo, nombre_responsable, nombre_verificador, activaciones) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        incidenteId,
        str(formData, 'establecimiento'), str(formData, 'direccion'),
        str(formData, 'inmueble'), str(formData, 'responsable'),
        str(formData, 'reporteDescripcion'), str(formData, 'horaCanalizacion'),
        str(formData, 'unidadArribo'), str(formData, 'horaArribo'),
        str(formData, 'nombreResponsable'), str(formData, 'nombreVerificador'),
        activaciones,
      ],
    )

    await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidente_alarma_escolar', entidadId: incidenteId })
  })

  revalidatePath(`/incidentes/${incidenteId}`)
}
