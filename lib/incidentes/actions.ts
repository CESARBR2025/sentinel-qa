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
async function requireOperador(accion: Accion = 'crear') {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  if (!(await tienePermiso(session.user.id, 'incidentes', accion))) redirect('/dashboard')

  return session
}

const str = (fd: FormData, k: string) => (fd.get(k) as string | null)?.trim() || null
const req = (fd: FormData, k: string) => (fd.get(k) as string).trim()
const num = (fd: FormData, k: string) => { const v = fd.get(k); return v ? Number(v) : null }
const bool = (fd: FormData, k: string) => fd.get(k) === 'true' || fd.get(k) === 'on'

// Valores permitidos — validación en servidor, no confiar en cliente
const CANALES = ['911', 'whatsapp', 'radio'] as const
const TIPOS_REPORTE = ['normal', 'extorsion', 'alarma_escolar'] as const
const ESTATUS_INCIDENTE = ['sin_despachar', 'en_despacho', 'en_sitio', 'atendido', 'cerrado_detencion'] as const
type EstatusIncidente = typeof ESTATUS_INCIDENTE[number]
const SEXOS = ['M', 'F', 'NE'] as const

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

  const lat = formData.get('latitud') ? String(formData.get('latitud')) : null;
  const lng = formData.get('longitud') ? String(formData.get('longitud')) : null;


  const inc = await query<{ id: string }>(
    `INSERT INTO incidentes (
      folio, folio_consecutivo, canal, tipo_reporte, nombre_reportante,
      anonimo, sexo, edad, es_usuario_frecuente, es_persona_afectada,
      es_migrante, calle, numero_exterior, numero_interior, colonia,
      entre_calles, referencia_ubicacion, municipio, latitud, longitud,
      tipo_emergencia_id, tipo_incidente_id, prioridad_id, descripcion,
      observaciones, fecha_hora_inicio, fecha_hora_fin, grupo_whatsapp,
      nombre_oficial, medio_canalizacion_id, requiere_despacho, estatus,
      capturado_por
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33)
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
      num(formData, 'tipoEmergenciaId'), num(formData, 'tipoIncidenteId'), num(formData, 'prioridadId'),
      str(formData, 'descripcion'), str(formData, 'observaciones'),
      fechaHoraInicio, fechaHoraFin,
      canal === 'whatsapp' ? str(formData, 'grupoWhatsapp') : null,
      canal === 'radio' ? str(formData, 'nombreOficial') : null,
      num(formData, 'medioCanalizacionId'), bool(formData, 'requiereDespacho'),
      estatus, session.user.id,
    ],
  )
  const incidenteId = inc.rows[0].id

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

  const lat = formData.get('latitud') ? String(formData.get('latitud')) : null;
  const lng = formData.get('longitud') ? String(formData.get('longitud')) : null;

  const inc = await query<{ id: string }>(
    `INSERT INTO incidentes (
      folio, folio_consecutivo, canal, tipo_reporte, nombre_reportante,
      anonimo, sexo, edad, es_usuario_frecuente, es_persona_afectada,
      es_migrante, calle, numero_exterior, numero_interior, colonia,
      entre_calles, referencia_ubicacion, municipio, latitud, longitud,
      tipo_emergencia_id, tipo_incidente_id, prioridad_id, descripcion,
      observaciones, fecha_hora_inicio, fecha_hora_fin, grupo_whatsapp,
      nombre_oficial, medio_canalizacion_id, requiere_despacho, estatus,
      capturado_por
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33)
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
      num(formData, 'tipoEmergenciaId'), num(formData, 'tipoIncidenteId'), num(formData, 'prioridadId'),
      str(formData, 'descripcion'), str(formData, 'observaciones'),
      fechaHoraInicio, fechaHoraFin,
      canal === 'whatsapp' ? str(formData, 'grupoWhatsapp') : null,
      canal === 'radio' ? str(formData, 'nombreOficial') : null,
      num(formData, 'medioCanalizacionId'), bool(formData, 'requiereDespacho'),
      estatus, session.user.id,
    ],
  )
  const incidenteId = inc.rows[0].id

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
  const session = await requireOperador()

  const fechaHoraInicio = req(formData, 'fechaHoraInicio')
  const { folio, consecutivo } = await generarFolioIncidente()

  const lat = formData.get('latitud') ? String(formData.get('latitud')) : null
  const lng = formData.get('longitud') ? String(formData.get('longitud')) : null

  const anonimo = bool(formData, 'anonimo')

  const incidenteId = await tryActionRaw(async () => {
    const inc = await query<{ id: string }>(
      `INSERT INTO incidentes (
        folio, folio_consecutivo, canal, tipo_reporte, nombre_reportante,
        anonimo, calle, colonia, entre_calles, referencia_ubicacion,
        municipio, latitud, longitud,
        tipo_emergencia_id, tipo_incidente_id, prioridad_id,
        descripcion, observaciones, fecha_hora_inicio,
        nombre_oficial, requiere_despacho, estatus, origen_rondin, capturado_por
      ) VALUES ($1,$2,'radio','normal',$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,true,'sin_despachar',true,$19)
      RETURNING id`,
      [
        folio, consecutivo,
        anonimo ? null : str(formData, 'nombreReportante'),
        anonimo,
        str(formData, 'calle'), str(formData, 'colonia'),
        str(formData, 'entreCalles'), str(formData, 'referenciaUbicacion'),
        str(formData, 'municipio') ?? 'San Juan del Río',
        lat, lng,
        num(formData, 'tipoEmergenciaId'), num(formData, 'tipoIncidenteId'), num(formData, 'prioridadId'),
        str(formData, 'descripcion'), str(formData, 'observaciones'),
        fechaHoraInicio,
        str(formData, 'nombreOficial'),
        session.user.id,
      ],
    )
    return inc.rows[0].id
  })

  await registrarAudit({ userId: session.user.id, accion: 'CREATE', entidad: 'incidentes', entidadId: incidenteId, payload: { origen: 'rondin_escalado' } })

  revalidatePath('/agente_911/rondin')
  revalidatePath('/incidentes')

  redirect(`/agente_911/rondin/incidentes/${incidenteId}`)
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
      if (existe.rows[0]) throw new ValidationError('El incidente ya tiene un despacho asignado')

      const unidades: { extId: string; placa: string }[] = JSON.parse(formData.get('unidades') as string ?? '[]')
      const elementos: { extId: string; nomina: string; nombre: string }[] = JSON.parse(formData.get('elementos') as string ?? '[]')

      if (unidades.length === 0) throw new ValidationError('Se requiere al menos una unidad')
      if (elementos.length === 0) throw new ValidationError('Se requiere al menos un elemento')

      await cliente.query('BEGIN')

      const despacho = await cliente.query<{ id: string }>(
        `INSERT INTO incidente_despacho (incidente_id, despachado_por) VALUES ($1, $2) RETURNING id`,
        [incidenteId, session.user.id],
      )
      const despachoId = despacho.rows[0].id

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
  revalidatePath(`/incidentes/${incidenteId}`)
}

// ─── Marcar en sitio ──────────────────────────────────────────────────────────
export async function marcarEnSitio(incidenteId: string) {
  const session = await requireOperador()

  await tryActionRaw(async () => {
    const inc = await query<{ estatus: string }>(
      `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
      [incidenteId],
    )
    if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
    if (inc.rows[0].estatus !== 'en_despacho') throw new ValidationError('El incidente debe estar en_despacho para marcar en sitio')

    await query(
      `UPDATE incidentes SET estatus = 'en_sitio', actualizado_en = NOW() WHERE id = $1`,
      [incidenteId],
    )
  })

  await registrarAudit({ userId: session.user.id, accion: 'UPDATE', entidad: 'incidentes', entidadId: incidenteId, payload: { estatus_anterior: 'en_despacho', estatus_nuevo: 'en_sitio' } })
  revalidatePath(`/incidentes/${incidenteId}`)
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
      capturado_por
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33)
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
      num(formData, 'tipoEmergenciaId'), num(formData, 'tipoIncidenteId'), num(formData, 'prioridadId'),
      str(formData, 'descripcion'), str(formData, 'observaciones'),
      fechaHoraInicio, fechaHoraFin,
      canal === 'whatsapp' ? str(formData, 'grupoWhatsapp') : null,
      canal === 'radio' ? str(formData, 'nombreOficial') : null,
      num(formData, 'medioCanalizacionId'), bool(formData, 'requiereDespacho'),
      estatus, session.user.id,
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
