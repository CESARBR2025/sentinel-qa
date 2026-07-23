import { query } from '@/lib/db'
import type { IncidenteFiltros, IncidenteListItem, IncidenteConDespacho, IncidentePendiente, IncidenteDetalleCompleto, PersonaAfectadaRow, DespachoRow, ReporteCampoRow, ExtorsionRow, AlarmaEscolarRow, DespachoUnidadRow, DespachoElementoRow, IncidenteBasico, DespachoCompleto, ReporteCampoDetalle } from './types'
import { rowToIncidenteListItem, rowToIncidenteConDespachoBase, rowToIncidentePendiente, rowToIncidenteDetalleCompletoBase, rowToPersonaAfectada, rowToDespacho, rowToReporteCampo, rowToExtorsion, rowToAlarmaEscolar, rowToDespachoUnidad, rowToDespachoElemento, rowToIncidenteBasico, rowToReporteCampoDetalle } from './mapper'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  return String(val)
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
    `SELECT i.id, i.folio, i.canal, i.tipo_reporte, i.estatus, i.fecha_hora_inicio, i.colonia, cti.nombre AS tipo_incidente_nombre, cp.nombre AS prioridad_nombre, u.name AS capturado_por_nombre FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN users u ON i.capturado_por = u.id ${where} ORDER BY i.creado_en DESC LIMIT 200`,
    params.length ? params : undefined,
  )
  return result.rows.map(rowToIncidenteListItem)
}

export async function listarIncidentesAtendidos(): Promise<IncidenteConDespacho[]> {
  // Cierre actual: ofi_reportes_campo (orc). Fallback legacy: incidente_reporte_campo (rc).
  const result = await query<Record<string, unknown>>(
    `SELECT i.id, i.folio, i.canal, i.estatus, i.fecha_hora_inicio, i.calle, i.colonia, i.descripcion, i.origen_rondin,
      cti.nombre AS tipo_incidente_nombre, cp.nombre AS prioridad_nombre, u.name AS capturado_por_nombre,
      d.id AS despacho_id, d.fecha_hora_despacho AS despacho_fecha_hora,
      COALESCE(orc.ofi_acciones, rc.acciones_realizadas) AS acciones_realizadas,
      COALESCE(orc.ofi_hay_detencion, rc.hay_detencion) AS hay_detencion,
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
    LEFT JOIN incidente_reporte_campo rc ON i.id = rc.incidente_id
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
    `SELECT i.id, i.folio, i.canal, i.estatus, i.fecha_hora_inicio, i.calle, i.colonia, i.descripcion, i.origen_rondin, cti.nombre AS tipo_incidente_nombre, cp.nombre AS prioridad_nombre, u.name AS capturado_por_nombre, d.id AS despacho_id, d.fecha_hora_despacho AS despacho_fecha_hora FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN users u ON i.capturado_por = u.id LEFT JOIN incidente_despacho d ON i.id = d.incidente_id WHERE i.estatus IN ('en_despacho', 'en_sitio') ORDER BY i.creado_en DESC LIMIT 100`,
  )
  const rows = result.rows.map(rowToIncidenteConDespachoBase)
  return Promise.all(rows.map(async (inc) => {
    if (!inc.despachoId) return { ...inc, unidades: [], elementos: [] }
    const [unidades, elementos] = await obtenerUnidadesElementos(inc.despachoId)
    return { ...inc, unidades, elementos }
  }))
}

async function obtenerUnidadesElementos(despachoId: string): Promise<[{ id: string; placa: string; esRefuerzo: boolean; horaSalida: string | null; horaLlegada: string | null }[], { nombre: string; nomina: string; esPrioritario: boolean; esRefuerzo: boolean }[]]> {
  const [unidadesResult, elementosResult] = await Promise.all([
    query<Record<string, unknown>>(`SELECT id, unidad_placa, es_refuerzo, hora_salida, hora_llegada FROM incidente_despacho_unidades WHERE despacho_id = $1 ORDER BY es_refuerzo, creado_en`, [despachoId]),
    query<Record<string, unknown>>(`SELECT elemento_nombre, elemento_nomina, es_prioritario, es_refuerzo FROM incidente_despacho_elementos WHERE despacho_id = $1 ORDER BY es_prioritario DESC, es_refuerzo, creado_en`, [despachoId]),
  ])
  return [
    unidadesResult.rows.map(r => ({
      id: toStr(r.id) ?? '',
      placa: toStr(r.unidad_placa) ?? '',
      esRefuerzo: Boolean(r.es_refuerzo),
      horaSalida: r.hora_salida ? new Date(r.hora_salida as string).toISOString() : null,
      horaLlegada: r.hora_llegada ? new Date(r.hora_llegada as string).toISOString() : null,
    })),
    elementosResult.rows.map(r => ({ nombre: toStr(r.elemento_nombre) ?? '', nomina: toStr(r.elemento_nomina) ?? '', esPrioritario: Boolean(r.es_prioritario), esRefuerzo: Boolean(r.es_refuerzo) })),
  ]
}

export async function listarIncidentesPendientesDespacho(): Promise<IncidentePendiente[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT i.id, i.folio, i.canal, i.fecha_hora_inicio, i.calle, i.colonia, i.entre_calles, i.referencia_ubicacion, i.descripcion, i.origen_rondin, cti.nombre AS tipo_incidente_nombre, cp.nombre AS prioridad_nombre, cp.orden AS prioridad_orden, u.name AS capturado_por_nombre, ide.elemento_nombre AS prioritario_nombre, ide.elemento_nomina AS prioritario_nomina FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN users u ON i.capturado_por = u.id LEFT JOIN incidente_despacho d ON d.incidente_id = i.id AND i.origen_rondin = true LEFT JOIN incidente_despacho_elementos ide ON ide.despacho_id = d.id AND ide.es_prioritario = true     WHERE i.estatus = 'sin_despachar' AND i.requiere_despacho = true ORDER BY cp.orden DESC NULLS LAST, i.fecha_hora_inicio DESC`,
  )
  return result.rows.map(rowToIncidentePendiente)
}

export async function obtenerIncidenteCompleto(id: string): Promise<IncidenteDetalleCompleto | null> {
  const incResult = await query<Record<string, unknown>>(
    `SELECT i.id, i.folio, i.canal, i.tipo_reporte, i.estatus, i.nombre_reportante, i.anonimo, i.sexo, i.edad, i.es_usuario_frecuente, i.es_persona_afectada, i.es_migrante, i.calle, i.colonia, i.entre_calles, i.referencia_ubicacion, i.municipio, i.descripcion, i.observaciones, i.fecha_hora_inicio, i.fecha_hora_fin, i.grupo_whatsapp, i.nombre_oficial, i.requiere_despacho, i.origen_rondin, i.creado_en, cti.nombre AS tipo_incidente_nombre, cte.nombre AS tipo_emergencia_nombre, cp.nombre AS prioridad_nombre, cmc.nombre AS medio_canalizacion_nombre, u.name AS capturado_por_nombre FROM incidentes i LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id LEFT JOIN cat_tipos_emergencia cte ON i.tipo_emergencia_id = cte.id LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id LEFT JOIN cat_medios_canalizacion cmc ON i.medio_canalizacion_id = cmc.id LEFT JOIN users u ON i.capturado_por = u.id WHERE i.id = $1 LIMIT 1`,
    [id],
  )
  if (!incResult.rows[0]) return null

  const base = rowToIncidenteDetalleCompletoBase(incResult.rows[0])

  const [personasResult, despachoResult, reporteResult, extorsionResult, alarmaResult] = await Promise.all([
    query<Record<string, unknown>>(`SELECT id, incidente_id, nombre, sexo, edad, creado_en FROM incidente_personas_afectadas WHERE incidente_id = $1`, [id]),
    query<Record<string, unknown>>(`SELECT id, incidente_id, fecha_hora_despacho, despachado_por, creado_en FROM incidente_despacho WHERE incidente_id = $1 LIMIT 1`, [id]),
    query<Record<string, unknown>>(`SELECT id, incidente_id, contenido_reporte, lugar_calle, lugar_colonia, lugar_entre_calles, lugar_referencia, datos_positivos_negativos, acciones_realizadas, hay_detencion, nombre_detenidos, autoridad_recibe, expediente_ci, delito_falta, monto_robo, objetos_recuperados, hay_cateo, domicilio_cateado, resultado_cateo, policia_a_cargo, capturado_por, creado_en FROM incidente_reporte_campo WHERE incidente_id = $1 LIMIT 1`, [id]),
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
    `SELECT id, unidad_ext_id, unidad_placa FROM incidente_despacho_unidades WHERE despacho_id = $1`,
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
    `SELECT r.id, r.incidente_id, r.contenido_reporte, r.lugar_calle, r.lugar_colonia, r.lugar_entre_calles, r.lugar_referencia, r.datos_positivos_negativos, r.acciones_realizadas, r.hay_detencion, r.nombre_detenidos, r.autoridad_recibe, r.expediente_ci, r.delito_falta, r.monto_robo, r.objetos_recuperados, r.vehiculos_recuperados, r.tipo_vehiculo, r.destino_vehiculo, r.hay_cateo, r.domicilio_cateado, r.resultado_cateo, r.policia_a_cargo, r.personal_ingreso_ci, u.name AS capturado_por_nombre, r.creado_en FROM incidente_reporte_campo r LEFT JOIN users u ON r.capturado_por = u.id WHERE r.incidente_id = $1 LIMIT 1`,
    [incidenteId],
  )
  return result.rows[0] ? rowToReporteCampoDetalle(result.rows[0]) : null
}

export async function insertarReporteCampo(params: {
    incidenteId: string
    contenidoReporte: string | null
    lugarCalle: string | null
    lugarColonia: string | null
    lugarEntreCalles: string | null
    lugarReferencia: string | null
    datosPositivosNegativos: string | null
    accionesRealizadas: string | null
    hayDetencion: boolean
    nombreDetenidos: string | null
    autoridadRecibe: string | null
    expedienteCi: string | null
    delitoFalta: string | null
    hayRobo: boolean
    montoRobo: number | null
    objetosRecuperados: string | null
    hayVehiculo: boolean
    vehiculos: object[]
    hayCateo: boolean
    domicilioCateado: string | null
    cateoCalle: string | null
    cateoColonia: string | null
    cateoLatitud: string | null
    cateoLongitud: string | null
    resultadoCateo: string | null
    policiaACargo: string | null
    personalIngresoCi: string | null
    capturadoPor: string
    hayOrdenAprehension: boolean
    ordenesAprehension: object[]
    hayHidrocarburo: boolean
    hidrocarburos: object[]
    hayArmaFuego: boolean
    armasFuego: object[]
    hayDroga: boolean
    drogas: object[]
    observaciones: string | null
    apoyoFiestasPatronales : boolean
    operativosMetropolitano : boolean
    eco8 : boolean
    alcoholimetria : boolean
    motocicletas : boolean
    apoyoActuarios : boolean
    apoyoCateosFgr : boolean
    apoyoCateosFge : boolean
}) {
    await query(
        `INSERT INTO incidente_reporte_campo (
    incidente_id,
    contenido_reporte, lugar_calle, lugar_colonia, lugar_entre_calles, lugar_referencia,
    datos_positivos_negativos, acciones_realizadas,
    hay_detencion, nombre_detenidos, autoridad_recibe, expediente_ci, delito_falta,
    hay_robo, monto_robo, objetos_recuperados,
    hay_vehiculo, vehiculos,
    hay_cateo, domicilio_cateado, cateo_calle, cateo_colonia, cateo_latitud, cateo_longitud, resultado_cateo,
    policia_a_cargo, personal_ingreso_ci,
    capturado_por,
    hay_orden_aprehension, ordenes_aprehension,
    hay_hidrocarburo,      hidrocarburos,
    hay_arma_fuego,        armas_fuego,
    hay_droga,             drogas, observaciones,
    apoyo_fiestas_patronales, operativos_metropolitano, eco8,
    alcoholimetria, motocicletas, apoyo_actuarios,
    apoyo_cateos_fgr, apoyo_cateos_fge
  ) VALUES (
    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18::jsonb,
    $19,$20,$21,$22,$23,$24,$25,$26,$27,$28,
    $29, $30::jsonb, $31, $32::jsonb, $33, $34::jsonb, $35, $36::jsonb, $37,
    $38,$39,$40,$41,$42,$43,$44,$45
  )`,
        [
            params.incidenteId,
            params.contenidoReporte,
            params.lugarCalle,
            params.lugarColonia,
            params.lugarEntreCalles,
            params.lugarReferencia,
            params.datosPositivosNegativos,
            params.accionesRealizadas,
            params.hayDetencion,
            params.nombreDetenidos,
            params.autoridadRecibe,
            params.expedienteCi,
            params.delitoFalta,
            params.hayRobo,
            params.montoRobo,
            params.objetosRecuperados,
            params.hayVehiculo,
            JSON.stringify(params.vehiculos),
            params.hayCateo,
            params.domicilioCateado,
            params.cateoCalle,
            params.cateoColonia,
            params.cateoLatitud,
            params.cateoLongitud,
            params.resultadoCateo,
            params.policiaACargo,
            params.personalIngresoCi,
            params.capturadoPor,
            params.hayOrdenAprehension, JSON.stringify(params.ordenesAprehension),
            params.hayHidrocarburo, JSON.stringify(params.hidrocarburos),
            params.hayArmaFuego, JSON.stringify(params.armasFuego),
            params.hayDroga, JSON.stringify(params.drogas),
            params.observaciones,
            params.apoyoFiestasPatronales, 
            params.operativosMetropolitano, 
            params.eco8,
            params.alcoholimetria, 
            params.motocicletas, 
            params.apoyoActuarios,
            params.apoyoCateosFgr, 
            params.apoyoCateosFge,
        ]
    )

    if (!params.hayDetencion) {
        await query(
            `UPDATE incidentes SET estatus = 'atendido', actualizado_en = now() WHERE id = $1`,
            [params.incidenteId]
        )
    }
}

export async function verificarReporteCampo(incidenteId: string) {
    const incResult = await query<{ estatus: string }>(
        `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
        [incidenteId]
    )
    // Cierre vigente (ofi_reportes_campo) o legacy (incidente_reporte_campo)
    const existeResult = await query<{ id: string }>(
        `SELECT id FROM ofi_reportes_campo WHERE incidente_id = $1
         UNION ALL
         SELECT id FROM incidente_reporte_campo WHERE incidente_id = $1
         LIMIT 1`,
        [incidenteId]
    )
    return {
        inc: incResult.rows[0] ?? null,
        existe: existeResult.rows.length > 0,
    }
}