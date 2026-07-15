import { query } from '@/lib/db'
import type { AutoridadAdicional, Contestacion, FichaBusquedaDetalle, MedidaDetalle, SeguimientoBusqueda, SolicitudC4, SolicitudInformacion, VisitaDomiciliaria } from './types'
import { rowToAutoridadAdicional, rowToContestacion, rowToFichaBusquedaDetalle, rowToMedidaDetalle, rowToSeguimiento, rowToSolicitud, rowToSolicitudC4, rowToVisita } from './mapper'

export async function getMedidas(filters: {
  autoridad?: string
  prorrogadas?: string
}): Promise<any[]> {
  let sql = `SELECT * FROM medidas_proteccion WHERE 1=1`
  const values: any[] = []
  if (filters.autoridad) { values.push(filters.autoridad); sql += ` AND autoridad = $${values.length}` }
  if (filters.prorrogadas === '1') { values.push(true); sql += ` AND prorrogada = $${values.length}` }
  sql += ` ORDER BY creado_en DESC`
  const result = await query<Record<string, unknown>>(sql, values)
  return result.rows.map(row => ({
    ...row,
    fecha_vencimiento: row.fecha_vencimiento instanceof Date 
      ? row.fecha_vencimiento.toISOString().split('T')[0] 
      : (row.fecha_vencimiento ? String(row.fecha_vencimiento) : null)
  }))
}

export async function getVisitaMedidaIds(): Promise<string[]> {
  const result = await query<{ medida_id: string }>(`SELECT DISTINCT medida_id FROM visitas_domiciliarias`)
  return result.rows.map(v => v.medida_id)
}

export async function getMedidasStats(): Promise<{ fecha_vencimiento: string | null; status: string }[]> {
  const result = await query<{ fecha_vencimiento: unknown; status: string }>(
    `SELECT fecha_vencimiento, status FROM medidas_proteccion`
  )
  return result.rows.map(row => ({
    fecha_vencimiento: row.fecha_vencimiento instanceof Date 
      ? row.fecha_vencimiento.toISOString().split('T')[0] 
      : (row.fecha_vencimiento ? String(row.fecha_vencimiento) : null),
    status: String(row.status ?? '')
  }))
}

export async function getFichasBusqueda(): Promise<any[]> {
  const result = await query<Record<string, unknown>>(`SELECT * FROM fichas_busqueda ORDER BY fecha_activacion DESC`)
  return result.rows
}

export async function listarSolicitudesJuridico(): Promise<SolicitudInformacion[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM solicitudes_informacion WHERE status = $1 ORDER BY creado_en DESC`,
    ['en_juridico']
  )
  return result.rows.map(rowToSolicitud)
}

export async function obtenerSolicitud(id: string): Promise<SolicitudInformacion | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM solicitudes_informacion WHERE id = $1 LIMIT 1`,
    [id]
  )
  return result.rows.length ? rowToSolicitud(result.rows[0]) : null
}

export async function listarSolicitudesC4(solicitudId: string): Promise<SolicitudC4[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM solicitudes_c4_internas WHERE solicitud_id = $1 ORDER BY creado_en ASC`,
    [solicitudId]
  )
  return result.rows.map(rowToSolicitudC4)
}

export async function obtenerContestacion(solicitudId: string): Promise<Contestacion | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM contestaciones WHERE solicitud_id = $1 LIMIT 1`,
    [solicitudId]
  )
  return result.rows.length ? rowToContestacion(result.rows[0]) : null
}

export async function obtenerMedidaDetalle(id: string): Promise<MedidaDetalle | null> {
  const result = await query<any>(
    `SELECT * FROM medidas_proteccion WHERE id = $1 LIMIT 1`,
    [id]
  )
  return result.rows.length ? rowToMedidaDetalle(result.rows[0]) : null
}

export async function listarVisitas(medidaId: string): Promise<VisitaDomiciliaria[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM visitas_domiciliarias WHERE medida_id = $1 ORDER BY fecha_visita DESC`,
    [medidaId]
  )
  return result.rows.map(rowToVisita)
}

export async function listarAutoridadesAdicionales(medidaId: string): Promise<AutoridadAdicional[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM medida_autoridades_adicionales WHERE medida_id = $1 ORDER BY creado_en ASC`,
    [medidaId]
  )
  return result.rows.map(rowToAutoridadAdicional)
}

export async function obtenerFichaBusqueda(id: string): Promise<FichaBusquedaDetalle | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM fichas_busqueda WHERE id = $1 LIMIT 1`,
    [id]
  )
  return result.rows.length ? rowToFichaBusquedaDetalle(result.rows[0]) : null
}

export async function listarSeguimientos(fichaId: string): Promise<SeguimientoBusqueda[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT sb.id, sb.tipo, sb.fecha_hora_envio, sb.archivo_url, sb.registrado_por,
            u.name AS nombre_usuario, u.apellido AS apellido_usuario
     FROM seguimientos_busqueda sb
     LEFT JOIN users u ON sb.registrado_por = u.id
     WHERE sb.ficha_id = $1
     ORDER BY sb.creado_en ASC`,
    [fichaId]
  )
  return result.rows.map(rowToSeguimiento)
}

// ── Filtered reads for API routes ────────────────────────────────────────

export async function getMedidasFiltradas(
  autoridad?: string | null,
  status?: string | null,
): Promise<any[]> {
  const conditions: string[] = []
  const params: unknown[] = []
  if (autoridad) { conditions.push(`autoridad = $${params.length + 1}`); params.push(autoridad) }
  if (status) { conditions.push(`status = $${params.length + 1}`); params.push(status) }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await query<any>(
    `SELECT id, expediente, n_oficio AS "nOficio", fecha_oficio AS "fechaOficio", fecha_recepcion AS "fechaRecepcion", persona_recepciona AS "personaRecepciona", autoridad, nombre_autoridad AS "nombreAutoridad", delitos, victima, demandado, tipo_medida AS "tipoMedida", domicilio_proteccion AS "domicilioProteccion", colonia, telefono, tiempo_medida AS "tiempoMedida", fecha_vencimiento AS "fechaVencimiento", tipo_apercibimiento AS "tipoApercibimiento", enlace, observaciones, status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn", prorrogada, archivo_prorroga_url AS "archivoProrrogaUrl" FROM medidas_proteccion ${where} ORDER BY fecha_vencimiento`,
    params.length ? params : undefined,
  )
  return result.rows
}

export async function obtenerMedidaDetalleCompleto(id: string): Promise<{
  medida: any
  visitas: any[]
}> {
  const MEDIDA_COLS = `id, expediente, n_oficio AS "nOficio", fecha_oficio AS "fechaOficio", fecha_recepcion AS "fechaRecepcion", persona_recepciona AS "personaRecepciona", autoridad, nombre_autoridad AS "nombreAutoridad", delitos, victima, demandado, tipo_medida AS "tipoMedida", domicilio_proteccion AS "domicilioProteccion", colonia, telefono, tiempo_medida AS "tiempoMedida", fecha_vencimiento AS "fechaVencimiento", tipo_apercibimiento AS "tipoApercibimiento", enlace, observaciones, status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn", prorrogada, archivo_prorroga_url AS "archivoProrrogaUrl"`
  const VISITA_COLS = `id, medida_id AS "medidaId", fecha_visita AS "fechaVisita", hora_visita AS "horaVisita", resultado, apercibimiento_aplicado AS "apercibimientoAplicado", registrado_por AS "registradoPor", creado_en AS "creadoEn"`

  const [medida, visitas] = await Promise.all([
    query<any>(`SELECT ${MEDIDA_COLS} FROM medidas_proteccion WHERE id = $1 LIMIT 1`, [id]).then(r => r.rows[0]),
    query<any>(`SELECT ${VISITA_COLS} FROM visitas_domiciliarias WHERE medida_id = $1 ORDER BY fecha_visita`, [id]).then(r => r.rows),
  ])
  return { medida: medida ?? null, visitas }
}

export async function listarVisitasConAlias(medidaId: string): Promise<any[]> {
  const result = await query<any>(
    `SELECT id, medida_id AS "medidaId", fecha_visita AS "fechaVisita", hora_visita AS "horaVisita", resultado, apercibimiento_aplicado AS "apercibimientoAplicado", registrado_por AS "registradoPor", creado_en AS "creadoEn" FROM visitas_domiciliarias WHERE medida_id = $1 ORDER BY fecha_visita`,
    [medidaId],
  )
  return result.rows
}

export async function getFichasActivas(): Promise<{ id: string; fecha_activacion: string }[]> {
  const result = await query<{ id: string; fecha_activacion: string }>(
    `SELECT id, fecha_activacion FROM fichas_busqueda WHERE status = 'activa'`,
  )
  return result.rows
}

export async function getSeguimientoTipos(fichaId: string): Promise<{ tipo: string }[]> {
  const result = await query<{ tipo: string }>(
    `SELECT tipo FROM seguimientos_busqueda WHERE ficha_id = $1`,
    [fichaId],
  )
  return result.rows
}

export async function getFichasBusquedaFiltradas(
  tipo?: string | null,
  status?: string | null,
): Promise<any[]> {
  const conditions: string[] = []
  const params: unknown[] = []
  if (tipo) { conditions.push(`tipo = $${params.length + 1}`); params.push(tipo) }
  if (status) { conditions.push(`status = $${params.length + 1}`); params.push(status) }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await query<any>(
    `SELECT id, tipo, folio, enlace, fecha_activacion AS "fechaActivacion", carpeta_investigacion AS "carpetaInvestigacion", nombre_desaparecida AS "nombreDesaparecida", edad, fecha_aceptacion AS "fechaAceptacion", rt_atiende AS "rtAtiende", elemento_novedades AS "elementoNovedades", status, fecha_cancelacion AS "fechaCancelacion", fiscal_cancela AS "fiscalCancela", motivo_cancelacion AS "motivoCancelacion", creado_por AS "creadoPor", creado_en AS "creadoEn" FROM fichas_busqueda ${where} ORDER BY fecha_activacion`,
    params.length ? params : undefined,
  )
  return result.rows
}

export async function obtenerFichaDetalle(id: string): Promise<{
  ficha: any
  seguimientos: any[]
}> {
  const FICHA_COLS = `id, tipo, folio, enlace, fecha_activacion AS "fechaActivacion", carpeta_investigacion AS "carpetaInvestigacion", nombre_desaparecida AS "nombreDesaparecida", edad, fecha_aceptacion AS "fechaAceptacion", rt_atiende AS "rtAtiende", elemento_novedades AS "elementoNovedades", status, fecha_cancelacion AS "fechaCancelacion", fiscal_cancela AS "fiscalCancela", motivo_cancelacion AS "motivoCancelacion", creado_por AS "creadoPor", creado_en AS "creadoEn"`
  const SEG_COLS = `id, ficha_id AS "fichaId", tipo, fecha_hora_envio AS "fechaHoraEnvio", registrado_por AS "registradoPor", creado_en AS "creadoEn", archivo_url AS "archivoUrl"`

  const [ficha, seguimientos] = await Promise.all([
    query<any>(`SELECT ${FICHA_COLS} FROM fichas_busqueda WHERE id = $1 LIMIT 1`, [id]).then(r => r.rows[0]),
    query<any>(`SELECT ${SEG_COLS} FROM seguimientos_busqueda WHERE ficha_id = $1 ORDER BY fecha_hora_envio`, [id]).then(r => r.rows),
  ])
  return { ficha: ficha ?? null, seguimientos }
}

export async function listarSolicitudesFiltradas(
  status?: string | null,
  autoridad?: string | null,
): Promise<any[]> {
  const conditions: string[] = []
  const params: unknown[] = []
  if (status) { conditions.push(`status = $${params.length + 1}`); params.push(status) }
  if (autoridad) { conditions.push(`autoridad = $${params.length + 1}`); params.push(autoridad) }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const result = await query<any>(
    `SELECT id, enlace, oficio, fecha_activacion AS "fechaActivacion", autoridad, fiscal_solicita AS "fiscalSolicita", delito, carpeta_investigacion AS "carpetaInvestigacion", solicitud_texto AS "solicitudTexto", fecha_aceptacion AS "fechaAceptacion", status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn" FROM solicitudes_informacion ${where} ORDER BY fecha_activacion`,
    params.length ? params : undefined,
  )
  return result.rows
}

export async function obtenerSolicitudDetalle(id: string): Promise<{
  solicitud: any
  solicitudesC4: any[]
  contestacion: any
}> {
  const SOL_COLS = `id, enlace, oficio, fecha_activacion AS "fechaActivacion", autoridad, fiscal_solicita AS "fiscalSolicita", delito, carpeta_investigacion AS "carpetaInvestigacion", solicitud_texto AS "solicitudTexto", fecha_aceptacion AS "fechaAceptacion", status, creado_por AS "creadoPor", creado_en AS "creadoEn", actualizado_en AS "actualizadoEn"`
  const C4_COLS = `id, solicitud_id AS "solicitudId", descripcion_evidencias AS "descripcionEvidencias", status, creado_por AS "creadoPor", creado_en AS "creadoEn"`
  const CONT_COLS = `id, solicitud_id AS "solicitudId", fecha_contestacion AS "fechaContestacion", archivo_pdf_url AS "archivoPdfUrl", fecha_entrega AS "fechaEntrega", hora_entrega AS "horaEntrega", nombre_quien_recibio AS "nombreQuienRecibio", creado_por AS "creadoPor", creado_en AS "creadoEn"`

  const [solicitud, solicitudesC4, contestacion] = await Promise.all([
    query<any>(`SELECT ${SOL_COLS} FROM solicitudes_informacion WHERE id = $1 LIMIT 1`, [id]).then(r => r.rows[0]),
    query<any>(`SELECT ${C4_COLS} FROM solicitudes_c4_internas WHERE solicitud_id = $1 ORDER BY creado_en`, [id]).then(r => r.rows),
    query<any>(`SELECT ${CONT_COLS} FROM contestaciones WHERE solicitud_id = $1 LIMIT 1`, [id]).then(r => r.rows[0]),
  ])
  return { solicitud: solicitud ?? null, solicitudesC4, contestacion: contestacion ?? null }
}
