'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { query }          from '@/lib/db'
import { addDays, addMonths, isBefore, parseISO, format } from 'date-fns'
import { promises as fs } from 'fs'
import path               from 'path'
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

  const row = await query<{ id: string }>(
    `INSERT INTO medidas_proteccion (
      expediente, n_oficio, fecha_oficio, fecha_recepcion, persona_recepciona,
      autoridad, nombre_autoridad, delitos, victima, demandado,
      tipo_medida, domicilio_proteccion, colonia, telefono, tiempo_medida,
      fecha_vencimiento, tipo_apercibimiento, enlace, observaciones, creado_por
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
    RETURNING id`,
    [
      req('expediente'), req('nOficio'), req('fechaOficio'), req('fechaRecepcion'),
      req('personaRecepciona'), req('autoridad'), str('nombreAutoridad'),
      str('delitos'), req('victima'), str('demandado'),
      str('tipoMedida'), req('domicilioProteccion'), str('colonia'),
      str('telefono'), str('tiempoMedida'),
      str('fechaVencimiento'), str('tipoApercibimiento'), str('enlace'),
      str('observaciones'), session.user.id,
    ],
  )

  revalidatePath('/prevencion/medidas')
  redirect(`/prevencion/medidas/${row.rows[0].id}`)
}

export async function createVisita(medidaId: string, formData: FormData) {
  const session = await requireAcceso('medidas', 'editar')

  await query(
    `INSERT INTO visitas_domiciliarias (medida_id, fecha_visita, hora_visita, resultado, apercibimiento_aplicado, registrado_por)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      medidaId,
      (formData.get('fechaVisita') as string).trim(),
      (formData.get('horaVisita') as string).trim(),
      (formData.get('resultado') as string | null)?.trim() || null,
      formData.get('apercibimientoAplicado') === '1',
      session.user.id,
    ],
  )

  revalidatePath(`/prevencion/medidas/${medidaId}`)
}

export async function addAutoridadMedida(formData: FormData) {
  const session = await requireAcceso('medidas', 'editar')

  const medidaId   = (formData.get('medidaId')   as string).trim()
  const autoridad  = (formData.get('autoridad')  as string).trim()
  const nOficio    = (formData.get('nOficio')    as string | null)?.trim() || null
  const fechaOficioRaw = (formData.get('fechaOficio') as string | null)?.trim() || null

  await query(
    `INSERT INTO medida_autoridades_adicionales (medida_id, autoridad, n_oficio, fecha_oficio, creado_por)
     VALUES ($1, $2, $3, $4, $5)`,
    [medidaId, autoridad, nOficio, fechaOficioRaw || null, session.user.id],
  )

  revalidatePath(`/prevencion/medidas/${medidaId}`)
}

export async function createProrroga(formData: FormData) {
  await requireAcceso('medidas', 'editar')

  const medidaId = (formData.get('medidaId') as string).trim()
  const cantidad = Number(formData.get('cantidad'))
  const unidad   = formData.get('unidad') as 'dias' | 'meses'
  const archivo  = formData.get('archivo') as File | null

  const medida = await query<{ fecha_vencimiento: string | null; expediente: string }>(
    `SELECT fecha_vencimiento, expediente FROM medidas_proteccion WHERE id = $1 LIMIT 1`,
    [medidaId],
  )
  if (!medida.rows[0]) throw new Error('Medida no encontrada')

  const today = new Date()
  const base  = medida.rows[0].fecha_vencimiento ? parseISO(medida.rows[0].fecha_vencimiento) : today
  const start = isBefore(base, today) ? today : base
  const newDate = unidad === 'dias' ? addDays(start, cantidad) : addMonths(start, cantidad)

  let archivoPath: string | null = null
  if (archivo && archivo.size > 0) {
    const folio    = medida.rows[0].expediente.replace(/[^a-zA-Z0-9_-]/g, '_')
    const ext      = path.extname(archivo.name) || '.bin'
    const filename = `${Date.now()}${ext}`
    const dir      = path.join(process.cwd(), 'uploads', 'medidas_proteccion', folio, 'prorroga')
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, filename), Buffer.from(await archivo.arrayBuffer()))
    archivoPath = `uploads/medidas_proteccion/${folio}/prorroga/${filename}`
  }

  await query(
    `UPDATE medidas_proteccion SET fecha_vencimiento = $1, prorrogada = true, archivo_prorroga_url = $2, actualizado_en = NOW() WHERE id = $3`,
    [format(newDate, 'yyyy-MM-dd'), archivoPath, medidaId],
  )

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

  const row = await query<{ id: string }>(
    `INSERT INTO fichas_busqueda (
      tipo, folio, enlace, fecha_activacion, carpeta_investigacion,
      nombre_desaparecida, edad, fecha_aceptacion, rt_atiende, elemento_novedades, creado_por
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING id`,
    [
      (formData.get('tipo') as string).trim(),
      str('folio'), str('enlace'),
      fechaActivacionRaw, str('carpetaInvestigacion'),
      (formData.get('nombreDesaparecida') as string).trim(),
      edadRaw ? parseInt(edadRaw) : null,
      fechaAceptacionRaw ?? null,
      str('rtAtiende'), str('elementoNovedades'),
      session.user.id,
    ],
  )

  revalidatePath('/prevencion/busquedas')
  redirect(`/prevencion/busquedas/${row.rows[0].id}`)
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

  await query(
    `INSERT INTO seguimientos_busqueda (ficha_id, tipo, fecha_hora_envio, registrado_por, archivo_url)
     VALUES ($1, $2, NOW(), $3, $4)`,
    [fichaId, tipo, session.user.id, archivoUrl],
  )

  revalidatePath(`/prevencion/busquedas/${fichaId}`)
}

export async function cancelarFicha(formData: FormData) {
  await requireAcceso('busquedas', 'editar')

  const fichaId = (formData.get('fichaId') as string).trim()

  await query(
    `UPDATE fichas_busqueda SET status = 'cancelada', fecha_cancelacion = $1, fiscal_cancela = $2, motivo_cancelacion = $3 WHERE id = $4`,
    [
      (formData.get('fechaCancelacion') as string).trim(),
      (formData.get('fiscalCancela') as string).trim(),
      (formData.get('motivoCancelacion') as string | null)?.trim() || null,
      fichaId,
    ],
  )

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

  const row = await query<{ id: string }>(
    `INSERT INTO solicitudes_informacion (
      enlace, oficio, fecha_activacion, autoridad, fiscal_solicita,
      delito, carpeta_investigacion, solicitud_texto, fecha_aceptacion, status, creado_por
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING id`,
    [
      str('enlace'), req('oficio'), req('fechaActivacion'),
      req('autoridad'), str('fiscalSolicita'), str('delito'),
      str('carpetaInvestigacion'), str('solicitudTexto'),
      fechaAceptacionRaw ?? null, 'en_juridico', session.user.id,
    ],
  )

  revalidatePath('/prevencion/juridico')
  redirect(`/prevencion/juridico/solicitudes/${row.rows[0].id}`)
}

export async function createSolicitudC4(formData: FormData) {
  const session = await requireAcceso('solicitudes', 'editar')

  const solicitudId = (formData.get('solicitudId') as string).trim()

  await query(
    `INSERT INTO solicitudes_c4_internas (solicitud_id, descripcion_evidencias, creado_por)
     VALUES ($1, $2, $3)`,
    [
      solicitudId,
      (formData.get('descripcionEvidencias') as string).trim(),
      session.user.id,
    ],
  )

  revalidatePath(`/prevencion/juridico/solicitudes/${solicitudId}`)
}

export async function createContestacion(formData: FormData) {
  const session = await requireAcceso('solicitudes', 'editar')

  const solicitudId = (formData.get('solicitudId') as string).trim()
  const str = (k: string): string | null =>
    (formData.get(k) as string | null)?.trim() || null

  await query(
    `INSERT INTO contestaciones (solicitud_id, fecha_contestacion, archivo_pdf_url, fecha_entrega, hora_entrega, nombre_quien_recibio, creado_por)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      solicitudId,
      (formData.get('fechaContestacion') as string).trim(),
      str('archivoPdfUrl'), str('fechaEntrega'), str('horaEntrega'),
      str('nombreQuienRecibio'), session.user.id,
    ],
  )

  await query(
    `UPDATE solicitudes_informacion SET status = 'completado', actualizado_en = NOW() WHERE id = $1`,
    [solicitudId],
  )

  revalidatePath(`/prevencion/juridico/solicitudes/${solicitudId}`)
  revalidatePath('/prevencion/juridico')
}

// ── API route mutations (called from route handlers, no revalidate/redirect) ──

export async function createMedidaApi(body: Record<string, unknown>): Promise<any> {
  const created = await query(
    `INSERT INTO medidas_proteccion (expediente, n_oficio, fecha_oficio, fecha_recepcion, persona_recepciona, autoridad, nombre_autoridad, delitos, victima, demandado, tipo_medida, domicilio_proteccion, colonia, telefono, tiempo_medida, fecha_vencimiento, tipo_apercibimiento, enlace, observaciones) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING id, expediente, n_oficio AS "nOficio", fecha_oficio AS "fechaOficio", fecha_recepcion AS "fechaRecepcion", persona_recepciona AS "personaRecepciona", autoridad, nombre_autoridad AS "nombreAutoridad", delitos, victima, demandado, tipo_medida AS "tipoMedida", domicilio_proteccion AS "domicilioProteccion", colonia, telefono, tiempo_medida AS "tiempoMedida", fecha_vencimiento AS "fechaVencimiento", tipo_apercibimiento AS "tipoApercibimiento", enlace, observaciones`,
    [body.expediente, body.nOficio, body.fechaOficio, body.fechaRecepcion, body.personaRecepciona, body.autoridad, body.nombreAutoridad, body.delitos, body.victima, body.demandado, body.tipoMedida, body.domicilioProteccion, body.colonia, body.telefono, body.tiempoMedida, body.fechaVencimiento, body.tipoApercibimiento, body.enlace, body.observaciones],
  )
  return created.rows[0]
}

export async function updateMedidaApi(id: string, body: Record<string, unknown>): Promise<any> {
  const CAMPO_MAP: Record<string, string> = {
    expediente: 'expediente', nOficio: 'n_oficio', fechaOficio: 'fecha_oficio',
    fechaRecepcion: 'fecha_recepcion', personaRecepciona: 'persona_recepciona',
    autoridad: 'autoridad', nombreAutoridad: 'nombre_autoridad', delitos: 'delitos',
    victima: 'victima', demandado: 'demandado', tipoMedida: 'tipo_medida',
    domicilioProteccion: 'domicilio_proteccion', colonia: 'colonia', telefono: 'telefono',
    tiempoMedida: 'tiempo_medida', fechaVencimiento: 'fecha_vencimiento',
    tipoApercibimiento: 'tipo_apercibimiento', enlace: 'enlace', observaciones: 'observaciones',
    status: 'status', prorrogada: 'prorrogada', archivoProrrogaUrl: 'archivo_prorroga_url',
  }
  const MEDIDA_COLS = `id, expediente, n_oficio AS "nOficio", fecha_oficio AS "fechaOficio", fecha_recepcion AS "fechaRecepcion", persona_recepciona AS "personaRecepciona", autoridad, nombre_autoridad AS "nombreAutoridad", delitos, victima, demandado, tipo_medida AS "tipoMedida", domicilio_proteccion AS "domicilioProteccion", colonia, telefono, tiempo_medida AS "tiempoMedida", fecha_vencimiento AS "fechaVencimiento", tipo_apercibimiento AS "tipoApercibimiento", enlace, observaciones, status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn", prorrogada, archivo_prorroga_url AS "archivoProrrogaUrl"`

  const sets: string[] = []
  const vals: unknown[] = [id]
  for (const [key, val] of Object.entries(body)) {
    const col = CAMPO_MAP[key]
    if (!col) continue
    sets.push(`${col} = $${vals.length + 1}`)
    vals.push(val)
  }
  sets.push('actualizado_en = NOW()')
  const updated = await query(
    `UPDATE medidas_proteccion SET ${sets.join(', ')} WHERE id = $1 RETURNING ${MEDIDA_COLS}`,
    vals,
  )
  return updated.rows[0]
}

export async function updateMedidaStatusApi(id: string, status: string): Promise<any> {
  const MEDIDA_COLS = `id, expediente, n_oficio AS "nOficio", fecha_oficio AS "fechaOficio", fecha_recepcion AS "fechaRecepcion", persona_recepciona AS "personaRecepciona", autoridad, nombre_autoridad AS "nombreAutoridad", delitos, victima, demandado, tipo_medida AS "tipoMedida", domicilio_proteccion AS "domicilioProteccion", colonia, telefono, tiempo_medida AS "tiempoMedida", fecha_vencimiento AS "fechaVencimiento", tipo_apercibimiento AS "tipoApercibimiento", enlace, observaciones, status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn", prorrogada, archivo_prorroga_url AS "archivoProrrogaUrl"`
  const updated = await query(
    `UPDATE medidas_proteccion SET status = $2, actualizado_en = $3 WHERE id = $1 RETURNING ${MEDIDA_COLS}`,
    [id, status, new Date().toISOString()],
  )
  return updated.rows[0]
}

export async function createVisitaApi(medidaId: string, body: Record<string, unknown>): Promise<any> {
  const created = await query(
    `INSERT INTO visitas_domiciliarias (medida_id, fecha_visita, hora_visita, resultado, apercibimiento_aplicado) VALUES ($1,$2,$3,$4,$5) RETURNING id, medida_id AS "medidaId", fecha_visita AS "fechaVisita", hora_visita AS "horaVisita", resultado, apercibimiento_aplicado AS "apercibimientoAplicado", registrado_por AS "registradoPor", creado_en AS "creadoEn"`,
    [medidaId, body.fechaVisita, body.horaVisita, body.resultado, body.apercibimientoAplicado ?? false],
  )
  return created.rows[0]
}

export async function createFichaApi(body: Record<string, unknown>): Promise<any> {
  const FICHA_COLS = `id, tipo, folio, enlace, fecha_activacion AS "fechaActivacion", carpeta_investigacion AS "carpetaInvestigacion", nombre_desaparecida AS "nombreDesaparecida", edad, fecha_aceptacion AS "fechaAceptacion", rt_atiende AS "rtAtiende", elemento_novedades AS "elementoNovedades", status, fecha_cancelacion AS "fechaCancelacion", fiscal_cancela AS "fiscalCancela", motivo_cancelacion AS "motivoCancelacion", creado_por AS "creadoPor", creado_en AS "creadoEn"`
  const created = await query(
    `INSERT INTO fichas_busqueda (tipo, folio, enlace, fecha_activacion, carpeta_investigacion, nombre_desaparecida, edad, fecha_aceptacion, rt_atiende, elemento_novedades) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING ${FICHA_COLS}`,
    [body.tipo, body.folio, body.enlace, body.fechaActivacion, body.carpetaInvestigacion, body.nombreDesaparecida, body.edad, body.fechaAceptacion, body.rtAtiende, body.elementoNovedades],
  )
  return created.rows[0]
}

export async function updateFichaApi(id: string, body: Record<string, unknown>): Promise<any> {
  const CAMPO_MAP: Record<string, string> = {
    tipo: 'tipo', folio: 'folio', enlace: 'enlace',
    fechaActivacion: 'fecha_activacion', carpetaInvestigacion: 'carpeta_investigacion',
    nombreDesaparecida: 'nombre_desaparecida', edad: 'edad',
    fechaAceptacion: 'fecha_aceptacion', rtAtiende: 'rt_atiende',
    elementoNovedades: 'elemento_novedades', status: 'status',
    fechaCancelacion: 'fecha_cancelacion', fiscalCancela: 'fiscal_cancela',
    motivoCancelacion: 'motivo_cancelacion',
  }
  const FICHA_COLS = `id, tipo, folio, enlace, fecha_activacion AS "fechaActivacion", carpeta_investigacion AS "carpetaInvestigacion", nombre_desaparecida AS "nombreDesaparecida", edad, fecha_aceptacion AS "fechaAceptacion", rt_atiende AS "rtAtiende", elemento_novedades AS "elementoNovedades", status, fecha_cancelacion AS "fechaCancelacion", fiscal_cancela AS "fiscalCancela", motivo_cancelacion AS "motivoCancelacion", creado_por AS "creadoPor", creado_en AS "creadoEn"`

  const sets: string[] = []
  const vals: unknown[] = [id]
  for (const [key, val] of Object.entries(body)) {
    const col = CAMPO_MAP[key]
    if (!col) continue
    sets.push(`${col} = $${vals.length + 1}`)
    vals.push(val)
  }
  const updated = await query(
    `UPDATE fichas_busqueda SET ${sets.join(', ')} WHERE id = $1 RETURNING ${FICHA_COLS}`,
    vals,
  )
  return updated.rows[0]
}

export async function cancelarFichaApi(id: string, body: Record<string, unknown>): Promise<any> {
  const FICHA_COLS = `id, tipo, folio, enlace, fecha_activacion AS "fechaActivacion", carpeta_investigacion AS "carpetaInvestigacion", nombre_desaparecida AS "nombreDesaparecida", edad, fecha_aceptacion AS "fechaAceptacion", rt_atiende AS "rtAtiende", elemento_novedades AS "elementoNovedades", status, fecha_cancelacion AS "fechaCancelacion", fiscal_cancela AS "fiscalCancela", motivo_cancelacion AS "motivoCancelacion", creado_por AS "creadoPor", creado_en AS "creadoEn"`
  const updated = await query(
    `UPDATE fichas_busqueda SET status = 'cancelada', fecha_cancelacion = $2, fiscal_cancela = $3, motivo_cancelacion = $4 WHERE id = $1 RETURNING ${FICHA_COLS}`,
    [id, body.fechaCancelacion ?? new Date(), body.fiscalCancela, body.motivoCancelacion],
  )
  return updated.rows[0]
}

export async function createSeguimientoApi(fichaId: string, body: Record<string, unknown>): Promise<any> {
  const created = await query(
    `INSERT INTO seguimientos_busqueda (ficha_id, tipo, fecha_hora_envio) VALUES ($1, $2, $3) RETURNING id, ficha_id AS "fichaId", tipo, fecha_hora_envio AS "fechaHoraEnvio", registrado_por AS "registradoPor", creado_en AS "creadoEn", archivo_url AS "archivoUrl"`,
    [fichaId, body.tipo, body.fechaHoraEnvio ?? new Date()],
  )
  return created.rows[0]
}

export async function createSolicitudApi(body: Record<string, unknown>): Promise<any> {
  const SOL_COLS = `id, enlace, oficio, fecha_activacion AS "fechaActivacion", autoridad, fiscal_solicita AS "fiscalSolicita", delito, carpeta_investigacion AS "carpetaInvestigacion", solicitud_texto AS "solicitudTexto", fecha_aceptacion AS "fechaAceptacion", status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn"`
  const created = await query(
    `INSERT INTO solicitudes_informacion (enlace, oficio, fecha_activacion, autoridad, fiscal_solicita, delito, carpeta_investigacion, solicitud_texto, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING ${SOL_COLS}`,
    [body.enlace, body.oficio, body.fechaActivacion ?? new Date(), body.autoridad, body.fiscalSolicita, body.delito, body.carpetaInvestigacion, body.solicitudTexto, body.status ?? 'en_juridico'],
  )
  return created.rows[0]
}

export async function updateSolicitudApi(id: string, body: Record<string, unknown>): Promise<any> {
  const CAMPO_MAP: Record<string, string> = {
    enlace: 'enlace', oficio: 'oficio', fechaActivacion: 'fecha_activacion',
    autoridad: 'autoridad', fiscalSolicita: 'fiscal_solicita', delito: 'delito',
    carpetaInvestigacion: 'carpeta_investigacion', solicitudTexto: 'solicitud_texto',
    fechaAceptacion: 'fecha_aceptacion', status: 'status',
  }
  const SOL_COLS = `id, enlace, oficio, fecha_activacion AS "fechaActivacion", autoridad, fiscal_solicita AS "fiscalSolicita", delito, carpeta_investigacion AS "carpetaInvestigacion", solicitud_texto AS "solicitudTexto", fecha_aceptacion AS "fechaAceptacion", status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn"`

  const sets: string[] = []
  const vals: unknown[] = [id]
  for (const [key, val] of Object.entries(body)) {
    const col = CAMPO_MAP[key]
    if (!col) continue
    sets.push(`${col} = $${vals.length + 1}`)
    vals.push(val)
  }
  sets.push('actualizado_en = NOW()')
  const updated = await query(
    `UPDATE solicitudes_informacion SET ${sets.join(', ')} WHERE id = $1 RETURNING ${SOL_COLS}`,
    vals,
  )
  return updated.rows[0]
}

export async function createSolicitudC4Api(solicitudId: string, body: Record<string, unknown>): Promise<any> {
  const C4_COLS = `id, solicitud_id AS "solicitudId", descripcion_evidencias AS "descripcionEvidencias", status, creado_por AS "creadoPor", creado_en AS "creadoEn"`
  const created = await query(
    `INSERT INTO solicitudes_c4_internas (solicitud_id, descripcion_evidencias, status) VALUES ($1, $2, 'pendiente') RETURNING ${C4_COLS}`,
    [solicitudId, body.descripcionEvidencias],
  )
  return created.rows[0]
}

export async function createContestacionApi(solicitudId: string, body: Record<string, unknown>): Promise<any> {
  const CONT_COLS = `id, solicitud_id AS "solicitudId", fecha_contestacion AS "fechaContestacion", archivo_pdf_url AS "archivoPdfUrl", fecha_entrega AS "fechaEntrega", hora_entrega AS "horaEntrega", nombre_quien_recibio AS "nombreQuienRecibio", creado_por AS "creadoPor", creado_en AS "creadoEn"`
  const created = await query(
    `INSERT INTO contestaciones (solicitud_id, fecha_contestacion, archivo_pdf_url, fecha_entrega, hora_entrega, nombre_quien_recibio) VALUES ($1,$2,$3,$4,$5,$6) RETURNING ${CONT_COLS}`,
    [solicitudId, body.fechaContestacion, body.archivoPdfUrl, body.fechaEntrega, body.horaEntrega, body.nombreQuienRecibio],
  )
  await query(
    `UPDATE solicitudes_informacion SET status = 'completado', actualizado_en = $2 WHERE id = $1`,
    [solicitudId, new Date().toISOString()],
  )
  return created.rows[0]
}
