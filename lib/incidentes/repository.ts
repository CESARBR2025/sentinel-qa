import { query } from '@/lib/db'
import type { IncidenteFiltros, IncidenteListItem, IncidenteConDespacho, IncidentePendiente, IncidenteGeoFiltros, IncidenteGeo, KpiIncidencias, IncidenteDetalleCompleto, PersonaAfectadaRow, DespachoRow, ReporteCampoRow, ExtorsionRow, AlarmaEscolarRow, DespachoUnidadRow, DespachoElementoRow, IncidenteBasico, DespachoCompleto, ReporteCampoDetalle } from './types'
import { rowToIncidenteListItem, rowToIncidenteConDespachoBase, rowToIncidentePendiente, rowToIncidenteGeo, rowToIncidenteDetalleCompletoBase, rowToPersonaAfectada, rowToDespacho, rowToReporteCampo, rowToExtorsion, rowToAlarmaEscolar, rowToDespachoUnidad, rowToDespachoElemento, rowToIncidenteBasico, rowToReporteCampoDetalle } from './mapper'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  return String(val)
}

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null
  const n = Number(val)
  return Number.isFinite(n) ? n : null
}

export async function listarIncidentesConFiltros(filtros: IncidenteFiltros): Promise<IncidenteListItem[]> {
  const conditions: string[] = []
  const params: unknown[] = []
  const { canal, estatus, desde, hasta, folio, tipoIncidenteId, prioridadId } = filtros
  if (canal) { conditions.push(`i.canal = $${params.length + 1}`); params.push(canal) }
  if (estatus) { conditions.push(`i.estatus = $${params.length + 1}`); params.push(estatus) }
  if (desde) { conditions.push(`i.fecha_hora_inicio >= $${params.length + 1}`); params.push(desde) }
  if (hasta) { conditions.push(`i.fecha_hora_inicio <= $${params.length + 1}`); params.push(hasta) }
  if (folio) { conditions.push(`i.folio ILIKE $${params.length + 1}`); params.push(`%${folio}%`) }
  if (tipoIncidenteId) { conditions.push(`i.tipo_incidente_id = $${params.length + 1}`); params.push(tipoIncidenteId) }
  if (prioridadId) { conditions.push(`i.prioridad_id = $${params.length + 1}`); params.push(prioridadId) }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const result = await query<Record<string, unknown>>(
    `SELECT i.id, i.folio, i.canal, i.tipo_reporte, i.estatus, i.fecha_hora_inicio, i.colonia, cti.nombre AS tipo_incidente_nombre, cp.clave AS prioridad_nombre, u.name AS capturado_por_nombre FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN users u ON i.capturado_por = u.id ${where} ORDER BY i.creado_en DESC LIMIT 200`,
    params.length ? params : undefined,
  )
  return result.rows.map(rowToIncidenteListItem)
}

// ─── KPI geolocalizado ──────────────────────────────────────────────────────
// La coordenada del reporte de campo (ofi_reportes_campo) es la más exacta al
// lugar del suceso, así que gana sobre la capturada al generar el incidente.
const JOIN_GEO = `LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
  LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
  LEFT JOIN users u ON i.capturado_por = u.id
  LEFT JOIN ofi_reportes_campo orc ON i.id = orc.incidente_id`

const COORD_LAT = `COALESCE(orc.ofi_latitud, i.latitud)`
const COORD_LNG = `COALESCE(orc.ofi_longitud, i.longitud)`
const TIENE_COORD = `${COORD_LAT} IS NOT NULL AND ${COORD_LNG} IS NOT NULL`

function construirWhereGeo(filtros: IncidenteGeoFiltros): { where: string; params: unknown[] } {
  const conditions = ['i.fecha_hora_inicio >= $1', 'i.fecha_hora_inicio <= $2']
  const params: unknown[] = [filtros.desde, filtros.hasta]
  const { estatus, canal, prioridadId, tipoIncidenteId } = filtros
  if (estatus) { conditions.push(`i.estatus = $${params.length + 1}`); params.push(estatus) }
  if (canal) { conditions.push(`i.canal = $${params.length + 1}`); params.push(canal) }
  if (prioridadId) { conditions.push(`i.prioridad_id = $${params.length + 1}`); params.push(prioridadId) }
  if (tipoIncidenteId) { conditions.push(`i.tipo_incidente_id = $${params.length + 1}`); params.push(tipoIncidenteId) }
  return { where: `WHERE ${conditions.join(' AND ')}`, params }
}

export async function listarIncidentesGeo(filtros: IncidenteGeoFiltros): Promise<IncidenteGeo[]> {
  const { where, params } = construirWhereGeo(filtros)
  const result = await query<Record<string, unknown>>(
    `SELECT i.id, i.folio, i.canal, i.estatus, i.fecha_hora_inicio, i.calle, i.colonia, i.entre_calles,
      i.referencia_ubicacion, i.descripcion, i.origen_rondin,
      ${COORD_LAT} AS latitud,
      ${COORD_LNG} AS longitud,
      CASE
        WHEN orc.ofi_latitud IS NOT NULL AND orc.ofi_longitud IS NOT NULL THEN 'reporte_campo'
        WHEN i.latitud IS NOT NULL AND i.longitud IS NOT NULL THEN 'incidente'
      END AS origen_coordenada,
      cti.nombre AS tipo_incidente_nombre, cp.nombre AS prioridad_nombre, cp.orden AS prioridad_orden,
      u.name AS capturado_por_nombre
    FROM incidentes i
    ${JOIN_GEO}
    ${where}
    ORDER BY i.fecha_hora_inicio DESC
    LIMIT 1000`,
    params,
  )
  return result.rows.map(rowToIncidenteGeo)
}

export async function obtenerKpiIncidencias(filtros: IncidenteGeoFiltros): Promise<KpiIncidencias> {
  const { where, params } = construirWhereGeo(filtros)

  const [totalesResult, estatusResult, prioridadResult] = await Promise.all([
    query<Record<string, unknown>>(
      `SELECT count(*) AS total,
        count(*) FILTER (WHERE ${TIENE_COORD}) AS con_ubicacion,
        count(*) FILTER (WHERE orc.ofi_latitud IS NOT NULL AND orc.ofi_longitud IS NOT NULL) AS con_ubicacion_reporte
      FROM incidentes i ${JOIN_GEO} ${where}`,
      params,
    ),
    query<Record<string, unknown>>(
      `SELECT i.estatus, count(*) AS total FROM incidentes i ${JOIN_GEO} ${where} GROUP BY i.estatus ORDER BY total DESC`,
      params,
    ),
    query<Record<string, unknown>>(
      `SELECT COALESCE(cp.nombre, 'Sin prioridad') AS prioridad, cp.orden, count(*) AS total
       FROM incidentes i ${JOIN_GEO} ${where}
       GROUP BY cp.nombre, cp.orden ORDER BY cp.orden DESC NULLS LAST`,
      params,
    ),
  ])

  const totales = totalesResult.rows[0] ?? {}
  return {
    total: Number(totales.total ?? 0),
    conUbicacion: Number(totales.con_ubicacion ?? 0),
    conUbicacionReporteCampo: Number(totales.con_ubicacion_reporte ?? 0),
    porEstatus: estatusResult.rows.map(r => ({ estatus: String(r.estatus ?? ''), total: Number(r.total ?? 0) })),
    porPrioridad: prioridadResult.rows.map(r => ({
      prioridad: String(r.prioridad ?? ''),
      orden: r.orden === null || r.orden === undefined ? null : Number(r.orden),
      total: Number(r.total ?? 0),
    })),
  }
}

export async function listarIncidentesAtendidos(): Promise<IncidenteConDespacho[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT i.id, i.folio, i.canal, i.estatus, i.fecha_hora_inicio, i.calle, i.colonia, i.descripcion, i.origen_rondin,
      cti.nombre AS tipo_incidente_nombre, cp.clave AS prioridad_nombre, u.name AS capturado_por_nombre,
      d.id AS despacho_id, d.fecha_hora_despacho AS despacho_fecha_hora,
      orc.ofi_acciones AS acciones_realizadas,
      orc.ofi_hay_detencion AS hay_detencion,
      orc.ofi_autoridad_recibe,
      (orc.ofi_hay_detencion = true AND NOT EXISTS (
        SELECT 1 FROM ofi_reporte_denuncia den WHERE den.reporte_campo_id = orc.id
      )) AS d1_pendiente
    FROM incidentes i
    LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
    LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
    LEFT JOIN users u ON i.capturado_por = u.id
    LEFT JOIN incidente_despacho d ON i.id = d.incidente_id
    LEFT JOIN ofi_reportes_campo orc ON i.id = orc.incidente_id
    WHERE i.estatus IN ('atendido', 'cerrado_detencion') ORDER BY i.creado_en DESC LIMIT 100`,
  )
  const rows = result.rows.map(rowToIncidenteConDespachoBase)
  return Promise.all(rows.map(async (inc) => {
    if (!inc.despachoId) return { ...inc, unidades: [], elementos: [] }
    const [unidades, elementos] = await obtenerUnidadesElementos(inc.despachoId)
    return { ...inc, unidades, elementos }
  }))
}

export async function listarIncidentesEnDespacho(): Promise<IncidenteConDespacho[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT i.id, i.folio, i.canal, i.estatus, i.fecha_hora_inicio, i.calle, i.colonia, i.descripcion, i.origen_rondin, i.latitud, i.longitud, cti.nombre AS tipo_incidente_nombre, cp.clave AS prioridad_nombre, u.name AS capturado_por_nombre, d.id AS despacho_id, d.fecha_hora_despacho AS despacho_fecha_hora FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN users u ON i.capturado_por = u.id LEFT JOIN incidente_despacho d ON i.id = d.incidente_id WHERE i.estatus IN ('en_despacho', 'en_sitio') ORDER BY i.creado_en DESC LIMIT 100`,
  )
  const rows = result.rows.map(rowToIncidenteConDespachoBase)
  return Promise.all(rows.map(async (inc) => {
    if (!inc.despachoId) return { ...inc, unidades: [], elementos: [] }
    const [unidades, elementos] = await obtenerUnidadesElementos(inc.despachoId)
    return { ...inc, unidades, elementos }
  }))
}

async function obtenerUnidadesElementos(despachoId: string): Promise<[{ id: string; placa: string; esRefuerzo: boolean; horaSalida: string | null; horaLlegada: string | null; patrullaId: string | null; ultimaLat: number | null; ultimaLng: number | null; ultimaUbicacionEn: string | null }[], { nombre: string; nomina: string; esPrioritario: boolean; esRefuerzo: boolean; oficialId: string | null; ultimaLat: number | null; ultimaLng: number | null; ultimaUbicacionEn: string | null }[]]> {
  const [unidadesResult, elementosResult] = await Promise.all([
    query<Record<string, unknown>>(`SELECT idu.id, idu.unidad_placa, idu.es_refuerzo, idu.hora_salida, idu.hora_llegada, p.id AS patrulla_id, o.ultima_lat, o.ultima_lng, o.ultima_ubicacion_en
       FROM incidente_despacho_unidades idu
       LEFT JOIN via.v2_patrullas p ON p.id::text = idu.unidad_ext_id
       LEFT JOIN LATERAL (
         SELECT o2.ultima_lat, o2.ultima_lng, o2.ultima_ubicacion_en
         FROM ofi_oficiales o2
         WHERE o2.patrulla_id = p.id AND o2.ofi_estatus = 'activo' AND o2.ultima_lat IS NOT NULL
         ORDER BY o2.ultima_ubicacion_en DESC NULLS LAST
         LIMIT 1
       ) o ON true
       WHERE idu.despacho_id = $1
       ORDER BY idu.es_refuerzo, idu.creado_en`, [despachoId]),
    query<Record<string, unknown>>(`SELECT de.id, de.elemento_nombre, de.elemento_nomina, de.es_prioritario, de.es_refuerzo, de.oficial_id, o.ultima_lat, o.ultima_lng, o.ultima_ubicacion_en
       FROM incidente_despacho_elementos de
       LEFT JOIN ofi_oficiales o ON o.id = de.oficial_id
       WHERE de.despacho_id = $1
       ORDER BY de.es_prioritario DESC, de.es_refuerzo, de.creado_en`, [despachoId]),
  ])
  return [
    unidadesResult.rows.map(r => ({
      id: toStr(r.id) ?? '',
      placa: toStr(r.unidad_placa) ?? '',
      esRefuerzo: Boolean(r.es_refuerzo),
      horaSalida: r.hora_salida ? new Date(r.hora_salida as string).toISOString() : null,
      horaLlegada: r.hora_llegada ? new Date(r.hora_llegada as string).toISOString() : null,
      patrullaId: toStr(r.patrulla_id),
      ultimaLat: toNum(r.ultima_lat),
      ultimaLng: toNum(r.ultima_lng),
      ultimaUbicacionEn: r.ultima_ubicacion_en ? new Date(r.ultima_ubicacion_en as string).toISOString() : null,
    })),
    elementosResult.rows.map(r => ({
      nombre: toStr(r.elemento_nombre) ?? '',
      nomina: toStr(r.elemento_nomina) ?? '',
      esPrioritario: Boolean(r.es_prioritario),
      esRefuerzo: Boolean(r.es_refuerzo),
      oficialId: toStr(r.oficial_id),
      ultimaLat: toNum(r.ultima_lat),
      ultimaLng: toNum(r.ultima_lng),
      ultimaUbicacionEn: r.ultima_ubicacion_en ? new Date(r.ultima_ubicacion_en as string).toISOString() : null,
    })),
  ]
}

export async function listarIncidentesPendientesDespacho(): Promise<IncidentePendiente[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT i.id, i.folio, i.canal, i.fecha_hora_inicio, i.calle, i.colonia, i.entre_calles, i.referencia_ubicacion, i.descripcion, i.origen_rondin, i.latitud, i.longitud, cti.nombre AS tipo_incidente_nombre, cp.clave AS prioridad_nombre, cp.orden AS prioridad_orden, u.name AS capturado_por_nombre, ide.elemento_nombre AS prioritario_nombre, ide.elemento_nomina AS prioritario_nomina, po.patrulla_id AS prioritario_patrulla_id FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN users u ON i.capturado_por = u.id LEFT JOIN incidente_despacho d ON d.incidente_id = i.id AND i.origen_rondin = true LEFT JOIN incidente_despacho_elementos ide ON ide.despacho_id = d.id AND ide.es_prioritario = true LEFT JOIN ofi_oficiales po ON po.no_nomina = ide.elemento_nomina AND po.ofi_estatus = 'activo'     WHERE i.estatus = 'sin_despachar' AND i.requiere_despacho = true ORDER BY cp.orden DESC NULLS LAST, i.fecha_hora_inicio DESC`,
  )
  return result.rows.map(rowToIncidentePendiente)
}

export async function obtenerIncidenteCompleto(id: string): Promise<IncidenteDetalleCompleto | null> {
  const incResult = await query<Record<string, unknown>>(
    `SELECT i.id, i.folio, i.canal, i.tipo_reporte, i.estatus, i.nombre_reportante, i.anonimo, i.sexo, i.edad, i.es_usuario_frecuente, i.es_persona_afectada, i.es_migrante, i.calle, i.colonia, i.entre_calles, i.referencia_ubicacion, i.municipio, i.descripcion, i.observaciones, i.fecha_hora_inicio, i.fecha_hora_fin, i.grupo_whatsapp, i.nombre_oficial, i.requiere_despacho, i.origen_rondin, i.creado_en, cti.nombre AS tipo_incidente_nombre, cte.nombre AS tipo_emergencia_nombre, cp.clave AS prioridad_nombre, cmc.nombre AS medio_canalizacion_nombre, u.name AS capturado_por_nombre FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_tipos_emergencia cte ON i.tipo_emergencia_id = cte.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN cat_medios_canalizacion cmc ON i.medio_canalizacion_id = cmc.id LEFT JOIN users u ON i.capturado_por = u.id WHERE i.id = $1 LIMIT 1`,
    [id],
  )
  if (!incResult.rows[0]) return null

  const base = rowToIncidenteDetalleCompletoBase(incResult.rows[0])

  const [personasResult, despachoResult, reporteResult, extorsionResult, alarmaResult] = await Promise.all([
    query<Record<string, unknown>>(`SELECT id, incidente_id, nombre, sexo, edad, creado_en FROM incidente_personas_afectadas WHERE incidente_id = $1`, [id]),
    query<Record<string, unknown>>(`SELECT id, incidente_id, fecha_hora_despacho, despachado_por, creado_en FROM incidente_despacho WHERE incidente_id = $1 LIMIT 1`, [id]),
    query<Record<string, unknown>>(`SELECT rc.id, rc.incidente_id, rc.ofi_contenido_reporte AS contenido_reporte, rc.ofi_calle AS lugar_calle, rc.ofi_colonia AS lugar_colonia, rc.ofi_entre_calles AS lugar_entre_calles, rc.ofi_referencia AS lugar_referencia, rc.ofi_datos_pn AS datos_positivos_negativos, rc.ofi_acciones AS acciones_realizadas, rc.ofi_hay_detencion AS hay_detencion, COALESCE((SELECT string_agg(d->>'nombre', ', ') FROM jsonb_array_elements(rc.ofi_detenidos) d), '') AS nombre_detenidos, rc.ofi_autoridad_recibe AS autoridad_recibe, rc.expediente_ci, rc.delito AS delito_falta, rc.ofi_monto_robo AS monto_robo, rc.ofi_objetos_recuperados AS objetos_recuperados, rc.ofi_hay_cateo AS hay_cateo, TRIM(CONCAT_WS(', ', rc.ofi_cateo->>'calle', rc.ofi_cateo->>'colonia')) AS domicilio_cateado, rc.ofi_resultado_cateo AS resultado_cateo, TRIM(CONCAT(u.name, ' ', COALESCE(u.apellido, ''))) AS policia_a_cargo, o.user_id AS capturado_por, rc.created_at AS creado_en FROM ofi_reportes_campo rc LEFT JOIN ofi_oficiales o ON o.id = rc.ofi_oficial_id LEFT JOIN users u ON u.id = o.user_id WHERE rc.incidente_id = $1 LIMIT 1`, [id]),
    query<Record<string, unknown>>(`SELECT id, incidente_id, telefono_extorsion, grupo_delictivo, modus_operandi, unidad_resultado, folio_reporte, fecha, creado_en FROM incidente_extorsion WHERE incidente_id = $1 LIMIT 1`, [id]),
    query<Record<string, unknown>>(`SELECT id, incidente_id, establecimiento, direccion, inmueble, responsable, reporte_descripcion, hora_canalizacion, unidad_arribo, hora_arribo, nombre_responsable, nombre_verificador, activaciones, creado_en FROM incidente_alarma_escolar WHERE incidente_id = $1 LIMIT 1`, [id]),
  ])

  return {
    ...base,
    personasAfectadas: personasResult.rows.map(rowToPersonaAfectada),
    despacho: despachoResult.rows[0] ? rowToDespacho(despachoResult.rows[0]) : null,
    reporteCampo: reporteResult.rows[0] ? rowToReporteCampo(reporteResult.rows[0]) : null,
    extorsion: extorsionResult.rows[0] ? rowToExtorsion(extorsionResult.rows[0]) : null,
    alarmaEscolar: alarmaResult.rows[0] ? rowToAlarmaEscolar(alarmaResult.rows[0]) : null,
  }
}

export async function obtenerIncidenteBasico(id: string): Promise<IncidenteBasico | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, folio, estatus FROM incidentes WHERE id = $1 LIMIT 1`,
    [id],
  )
  return result.rows[0] ? rowToIncidenteBasico(result.rows[0]) : null
}

export async function obtenerDespachoDeIncidente(incidenteId: string): Promise<{ id: string; incidenteId: string; fechaHoraDespacho: string | null; despachadorNombre: string | null; creadoEn: string } | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT d.id, d.incidente_id, d.fecha_hora_despacho, u.name AS despachador_nombre, d.creado_en FROM incidente_despacho d LEFT JOIN users u ON d.despachado_por = u.id WHERE d.incidente_id = $1 LIMIT 1`,
    [incidenteId],
  )
  if (!result.rows[0]) return null
  const row = result.rows[0]
  return {
    id: String(row.id ?? ''),
    incidenteId: toStr(row.incidente_id) ?? '',
    fechaHoraDespacho: toStr(row.fecha_hora_despacho),
    despachadorNombre: toStr(row.despachador_nombre),
    creadoEn: toStr(row.creado_en) ?? '',
  }
}

export async function obtenerUnidadesDeDespacho(despachoId: string): Promise<DespachoUnidadRow[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, unidad_ext_id, unidad_placa, hora_salida, hora_llegada FROM incidente_despacho_unidades WHERE despacho_id = $1`,
    [despachoId],
  )
  return result.rows.map(rowToDespachoUnidad)
}

export async function obtenerElementosDeDespacho(despachoId: string): Promise<DespachoElementoRow[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, elemento_ext_id, elemento_nomina, elemento_nombre, oficial_id FROM incidente_despacho_elementos WHERE despacho_id = $1`,
    [despachoId],
  )
  return result.rows.map(rowToDespachoElemento)
}

export async function obtenerReporteCampoDeIncidente(incidenteId: string): Promise<ReporteCampoDetalle | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT rc.id, rc.incidente_id, rc.ofi_contenido_reporte AS contenido_reporte, rc.ofi_calle AS lugar_calle, rc.ofi_colonia AS lugar_colonia, rc.ofi_entre_calles AS lugar_entre_calles, rc.ofi_referencia AS lugar_referencia, rc.ofi_datos_pn AS datos_positivos_negativos, rc.ofi_acciones AS acciones_realizadas, rc.ofi_hay_detencion AS hay_detencion, COALESCE((SELECT string_agg(d->>'nombre', ', ') FROM jsonb_array_elements(rc.ofi_detenidos) d), '') AS nombre_detenidos, rc.ofi_autoridad_recibe AS autoridad_recibe, rc.expediente_ci, rc.delito AS delito_falta, rc.ofi_monto_robo AS monto_robo, rc.ofi_objetos_recuperados AS objetos_recuperados, COALESCE((SELECT string_agg(TRIM(CONCAT_WS(' ', v->>'tipo', v->>'placas', v->>'color')), ' | ') FROM jsonb_array_elements(rc.ofi_vehiculos) v), '') AS vehiculos_recuperados, (rc.ofi_vehiculos->0->>'tipo') AS tipo_vehiculo, (rc.ofi_vehiculos->0->>'destino') AS destino_vehiculo, rc.ofi_hay_cateo AS hay_cateo, TRIM(CONCAT_WS(', ', rc.ofi_cateo->>'calle', rc.ofi_cateo->>'colonia')) AS domicilio_cateado, rc.ofi_resultado_cateo AS resultado_cateo, TRIM(CONCAT(u.name, ' ', COALESCE(u.apellido, ''))) AS policia_a_cargo, rc.personal_ingreso_ci, TRIM(CONCAT(u.name, ' ', COALESCE(u.apellido, ''))) AS capturado_por_nombre, rc.created_at AS creado_en FROM ofi_reportes_campo rc LEFT JOIN ofi_oficiales o ON o.id = rc.ofi_oficial_id LEFT JOIN users u ON u.id = o.user_id WHERE rc.incidente_id = $1 LIMIT 1`,
    [incidenteId],
  )
  return result.rows[0] ? rowToReporteCampoDetalle(result.rows[0]) : null
}

