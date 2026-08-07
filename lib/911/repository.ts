import { query } from '@/lib/db'
import type { CatalogoItem, IncidenteDetalle, IncidenteStats, CatalogosJerarquicos, SubtipoEmergencia, IncidenteCatalogo, StatsPorTipo, Resumen911, TiemposRespuesta911, KpiAlarmaEscolar, KpiExtorsion } from './types'
import { rowToCatalogo, rowToIncidenteDetalle } from './mapper'

function rowToSubtipo(row: Record<string, unknown>): SubtipoEmergencia {
  return {
    id: Number(row.id),
    tipoEmergenciaId: Number(row.tipo_emergencia_id),
    codigo: String(row.codigo),
    nombre: String(row.nombre),
    activo: Boolean(row.activo),
  }
}

function rowToIncidenteCatalogo(row: Record<string, unknown>): IncidenteCatalogo {
  return {
    id: Number(row.id),
    clave: String(row.clave),
    nombre: String(row.nombre),
    subtipoEmergenciaId: row.subtipo_emergencia_id != null ? Number(row.subtipo_emergencia_id) : null,
    codigoCatalogo: row.codigo_catalogo != null ? String(row.codigo_catalogo) : null,
    prioridadCatalogo: row.prioridad_catalogo != null ? String(row.prioridad_catalogo) : null,
    activo: Boolean(row.activo),
  }
}

export async function obtenerCatalogos(): Promise<CatalogosJerarquicos> {
  const [e, st, i, p, c, d] = await Promise.all([
    query<Record<string, unknown>>('SELECT id, codigo, nombre FROM cat_tipos_emergencia WHERE activo = $1 ORDER BY codigo', [true]),
    query<Record<string, unknown>>('SELECT * FROM cat_subtipos_emergencia WHERE activo = $1 ORDER BY codigo', [true]),
    query<Record<string, unknown>>('SELECT * FROM cat_tipos_incidente WHERE activo = $1 ORDER BY codigo_catalogo NULLS LAST, nombre', [true]),
    query<Record<string, unknown>>('SELECT id, nombre FROM cat_prioridades WHERE activo = $1 ORDER BY orden', [true]),
    query<Record<string, unknown>>('SELECT id, nombre FROM cat_medios_canalizacion WHERE activo = $1 ORDER BY nombre', [true]),
    query<Record<string, unknown>>('SELECT id, clave, nombre, tipo FROM cat_dependencias WHERE activo = $1 ORDER BY nombre', [true]),
  ])
  return {
    emergencias: e.rows.map(r => ({ id: Number(r.id), codigo: String(r.codigo), nombre: String(r.nombre) })),
    subtipos: st.rows.map(rowToSubtipo),
    incidentes: i.rows.map(rowToIncidenteCatalogo),
    prioridades: p.rows.map(rowToCatalogo),
    canalizaciones: c.rows.map(rowToCatalogo),
    dependencias: d.rows.map(r => ({ id: Number(r.id), clave: String(r.clave), nombre: String(r.nombre), tipo: String(r.tipo) })),
  }
}

export async function obtenerStats(hoyISO: string): Promise<IncidenteStats> {
  const [total, hoy, sinDespachar, enDespacho, channelsResult] = await Promise.all([
    query<{ count: number }>('SELECT count(*)::int AS count FROM incidentes'),
    query<{ count: number }>('SELECT count(*)::int AS count FROM incidentes WHERE fecha_hora_inicio >= $1', [hoyISO]),
    query<{ count: number }>('SELECT count(*)::int AS count FROM incidentes WHERE estatus = $1 AND requiere_despacho = $2', ['sin_despachar', true]),
    query<{ count: number }>('SELECT count(*)::int AS count FROM incidentes WHERE estatus = $1', ['en_despacho']),
    query<{ canal: string; count: number }>('SELECT canal, count(*)::int AS count FROM incidentes WHERE fecha_hora_inicio >= $1 GROUP BY canal', [hoyISO]),
  ])
  return {
    total: total.rows[0].count,
    hoy: hoy.rows[0].count,
    sinDespachar: sinDespachar.rows[0].count,
    enDespacho: enDespacho.rows[0].count,
    channels: channelsResult.rows,
  }
}

export async function obtenerStatsPorTipo(
  desdeDiaISO: string,
  desdeSemanaISO: string,
  desdeMesISO: string,
): Promise<StatsPorTipo[]> {
  const result = await query<{ tipo_reporte: string; dia: number; semana: number; mes: number }>(
    `SELECT
       COALESCE(tipo_reporte, 'normal') AS tipo_reporte,
       COUNT(*) FILTER (WHERE fecha_hora_inicio >= $1)::int AS dia,
       COUNT(*) FILTER (WHERE fecha_hora_inicio >= $2)::int AS semana,
       COUNT(*) FILTER (WHERE fecha_hora_inicio >= $3)::int AS mes
     FROM incidentes
     WHERE fecha_hora_inicio >= $3
     GROUP BY 1
     ORDER BY 1`,
    [desdeDiaISO, desdeSemanaISO, desdeMesISO],
  )
  return result.rows.map(r => ({
    tipoReporte: String(r.tipo_reporte),
    dia: r.dia,
    semana: r.semana,
    mes: r.mes,
  }))
}

export async function listarIncidentes(
  canal: string | null,
  page: number,
  pageSize: number,
  canalizacion?: 'canalizados' | 'sin_canalizacion' | null,
): Promise<{ rows: IncidenteDetalle[]; total: number }> {
  const offset = (page - 1) * pageSize
  const conditions: string[] = []
  const params: unknown[] = []
  let idx = 0

  if (canal) {
    idx++
    conditions.push(`i.canal = $${idx}`)
    params.push(canal)
  }
  if (canalizacion) {
    idx++
    // Canalizados = requirieron envío a despacho; Sin canalización = no.
    conditions.push(`COALESCE(i.requiere_despacho, false) = $${idx}`)
    params.push(canalizacion === 'canalizados')
  }

  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''

  const countResult = await query<{ value: number }>(
    `SELECT count(*)::int AS value FROM incidentes i ${whereClause}`,
    params,
  )
  const total = countResult.rows[0].value

  const dataParams = [...params, pageSize, offset]

  const dataResult = await query<Record<string, unknown>>(
    `SELECT i.*, cti.nombre AS tipo_nombre, cti.codigo_catalogo AS codigo_catalogo, cp.nombre AS prioridad_nombre, cte.nombre AS emergencia_nombre, cd.nombre AS dependencia_nombre
     FROM incidentes i
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
     LEFT JOIN cat_tipos_emergencia cte ON i.tipo_emergencia_id = cte.id
     LEFT JOIN cat_dependencias cd ON i.dependencia_id = cd.id
     ${whereClause}
     ORDER BY i.fecha_hora_inicio DESC, i.creado_en DESC
     LIMIT $${idx + 1} OFFSET $${idx + 2}`,
    dataParams,
  )

  return { rows: dataResult.rows.map(rowToIncidenteDetalle), total }
}

export async function obtenerIncidente(id: string): Promise<IncidenteDetalle | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT i.*, cti.nombre AS tipo_nombre, cti.codigo_catalogo AS codigo_catalogo, cp.nombre AS prioridad_nombre, cte.nombre AS emergencia_nombre, cd.nombre AS dependencia_nombre
     FROM incidentes i
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
     LEFT JOIN cat_tipos_emergencia cte ON i.tipo_emergencia_id = cte.id
     LEFT JOIN cat_dependencias cd ON i.dependencia_id = cd.id
     WHERE i.id = $1
     LIMIT 1`,
    [id],
  )
  return result.rows.length ? rowToIncidenteDetalle(result.rows[0]) : null
}

export async function obtenerIncidenteConExtras(id: string): Promise<Record<string, unknown> | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT row_to_json(i.*) AS inc, cti.nombre AS tipo_nombre, cp.nombre AS prioridad_nombre,
            cte.nombre AS emergencia_nombre, TRIM(CONCAT_WS(' ', u.name, u.apellido)) AS capturado_por_nombre,
            row_to_json(ie.*) AS ext, row_to_json(iae.*) AS ala,
            json_build_object(
              'id', orc.id,
              'incidente_id', orc.incidente_id,
              'contenido_reporte', orc.ofi_contenido_reporte,
              'datos_positivos_negativos', orc.ofi_datos_pn,
              'acciones_realizadas', orc.ofi_acciones,
              'hay_detencion', orc.ofi_hay_detencion,
              'nombre_detenidos', COALESCE((SELECT string_agg(d->>'nombre', ', ') FROM jsonb_array_elements(orc.ofi_detenidos) d), ''),
              'autoridad_recibe', orc.ofi_autoridad_recibe,
              'expediente_ci', orc.expediente_ci,
              'objetos_recuperados', orc.ofi_objetos_recuperados,
              'vehiculos_recuperados', COALESCE((SELECT string_agg(TRIM(CONCAT_WS(' ', v->>'tipo', v->>'placas', v->>'color')), ' | ') FROM jsonb_array_elements(orc.ofi_vehiculos) v), ''),
              'tipo_vehiculo', (orc.ofi_vehiculos->0->>'tipo'),
              'destino_vehiculo', (orc.ofi_vehiculos->0->>'destino')
            ) AS rep
     FROM incidentes i
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
     LEFT JOIN cat_tipos_emergencia cte ON i.tipo_emergencia_id = cte.id
     LEFT JOIN incidente_extorsion ie ON i.id = ie.incidente_id
     LEFT JOIN incidente_alarma_escolar iae ON i.id = iae.incidente_id
     LEFT JOIN ofi_reportes_campo orc ON i.id = orc.incidente_id
     LEFT JOIN users u ON i.capturado_por = u.id
     WHERE i.id = $1
     LIMIT 1`,
    [id],
  )
  return result.rows[0] ?? null
}

export async function listarIncidentesRecientes(limit: number = 100) {
  const result = await query<Record<string, unknown>>(
    `SELECT i.id, i.folio, i.canal, i.estatus, i.colonia, i.fecha_hora_inicio,
            cti.nombre AS tipo_incidente_nombre, cp.nombre AS prioridad_nombre
     FROM incidentes i
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
     ORDER BY i.creado_en DESC
     LIMIT $1`,
    [limit]
  )
  return result.rows
}

export async function obtenerTiposIncidente(): Promise<CatalogoItem[]> {
  const result = await query<Record<string, unknown>>(
    'SELECT id, nombre FROM cat_tipos_incidente WHERE activo = $1 ORDER BY nombre',
    [true],
  )
  return result.rows.map(rowToCatalogo)
}

export async function contarPorCanalizacion(canal: string): Promise<{ clave: string; count: number }[]> {
  const result = await query<{ clave: string; count: number }>(
    `SELECT CASE WHEN COALESCE(requiere_despacho, false) THEN 'canalizados' ELSE 'sin_canalizacion' END AS clave, count(*)::int as count
     FROM incidentes WHERE canal = $1 GROUP BY 1`,
    [canal],
  )
  return result.rows
}

export async function obtenerDespachadores(): Promise<{ id: string; name: string; apellido: string; rolNombre: string | null; activo: boolean; enLinea: boolean }[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT DISTINCT u.id, u.name, u.apellido, u.activo, r.nombre AS rol_nombre,
       (u.ultima_actividad_despacho_en IS NOT NULL
        AND u.ultima_actividad_despacho_en > NOW() - INTERVAL '5 minutes') AS en_linea
     FROM users u
     INNER JOIN permisos p ON p.usuario_id = u.id
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE p.seccion = '911_despacho' AND p.puede_ver = true
     AND u.dependencia_id = (SELECT id FROM cat_dependencias WHERE clave = 'SEGURIDAD_PUBLICA' LIMIT 1)
     ORDER BY en_linea DESC, u.name`,
  )
  return result.rows.map(r => ({
    id: String(r.id),
    name: String(r.name),
    apellido: r.apellido ? String(r.apellido) : '',
    rolNombre: r.rol_nombre ? String(r.rol_nombre) : null,
    activo: Boolean(r.activo),
    enLinea: Boolean(r.en_linea),
  }))
}

export async function actualizarActividadDespachador(userId: string): Promise<void> {
  await query(
    `UPDATE users SET ultima_actividad_despacho_en = NOW() WHERE id = $1`,
    [userId],
  )
}

// ─── KPIs Generales (panel admin) ─────────────────────────────────────────

export async function obtenerResumenPorTipoYCanal(desde: string, hasta: string): Promise<Resumen911> {
  const [porTipoCanal, sinDespacharAhora] = await Promise.all([
    query<{ tipo_reporte: string; canal: string; requiere_despacho: boolean; total: number }>(
      `SELECT COALESCE(tipo_reporte, 'normal') AS tipo_reporte, canal,
              COALESCE(requiere_despacho, false) AS requiere_despacho,
              count(*)::int AS total
       FROM incidentes
       WHERE fecha_hora_inicio >= $1 AND fecha_hora_inicio <= $2
       GROUP BY 1, 2, 3`,
      [desde, hasta],
    ),
    // Independiente del rango: cuántos están sin despachar AHORA MISMO.
    // Misma query que ya usa obtenerStats (línea ~50), sin filtro de fecha.
    query<{ count: number }>(
      `SELECT count(*)::int AS count FROM incidentes WHERE estatus = $1 AND requiere_despacho = $2`,
      ['sin_despachar', true],
    ),
  ])

  const porTipoMap = new Map<string, number>()
  const porCanalMap = new Map<string, number>()
  let total = 0, canalizadosADespacho = 0, sinCanalizacion = 0

  for (const r of porTipoCanal.rows) {
    porTipoMap.set(r.tipo_reporte, (porTipoMap.get(r.tipo_reporte) ?? 0) + r.total)
    porCanalMap.set(r.canal, (porCanalMap.get(r.canal) ?? 0) + r.total)
    total += r.total
    if (r.requiere_despacho) canalizadosADespacho += r.total
    else sinCanalizacion += r.total
  }

  return {
    total,
    porTipo: [...porTipoMap].map(([tipoReporte, total]) => ({ tipoReporte, total })),
    porCanal: [...porCanalMap].map(([canal, total]) => ({ canal, total })),
    canalizadosADespacho,
    sinCanalizacion,
    sinDespacharAhora: sinDespacharAhora.rows[0]?.count ?? 0,
  }
}

export async function obtenerTiemposRespuesta911(desde: string, hasta: string): Promise<TiemposRespuesta911> {
  const result = await query<{ captura_despacho_min: number | null; despacho_llegada_min: number | null; captura_llegada_min: number | null; muestras: number }>(
    `WITH primeras_llegadas AS (
       SELECT despacho_id, MIN(hora_llegada) AS hora_llegada
       FROM incidente_despacho_unidades
       WHERE hora_llegada IS NOT NULL
       GROUP BY despacho_id
     )
     SELECT
       AVG(EXTRACT(EPOCH FROM (d.fecha_hora_despacho - i.fecha_hora_inicio)) / 60) AS captura_despacho_min,
       AVG(EXTRACT(EPOCH FROM (pl.hora_llegada - d.fecha_hora_despacho)) / 60) AS despacho_llegada_min,
       AVG(EXTRACT(EPOCH FROM (pl.hora_llegada - i.fecha_hora_inicio)) / 60) AS captura_llegada_min,
       count(pl.hora_llegada)::int AS muestras
     FROM incidentes i
     JOIN incidente_despacho d ON d.incidente_id = i.id
     LEFT JOIN primeras_llegadas pl ON pl.despacho_id = d.id
     WHERE i.fecha_hora_inicio >= $1 AND i.fecha_hora_inicio <= $2`,
    [desde, hasta],
  )
  const r = result.rows[0]
  return {
    capturaDespachoMin: r?.captura_despacho_min != null ? Number(r.captura_despacho_min) : null,
    despachoLlegadaMin: r?.despacho_llegada_min != null ? Number(r.despacho_llegada_min) : null,
    capturaLlegadaMin: r?.captura_llegada_min != null ? Number(r.captura_llegada_min) : null,
    muestras: r?.muestras ?? 0,
  }
}

export async function obtenerKpiAlarmaEscolar(desde: string, hasta: string): Promise<KpiAlarmaEscolar> {
  // incidente_alarma_escolar NO tiene columnas hora_canalizacion/hora_arribo:
  // la canalización es incidente_despacho.fecha_hora_despacho y el arribo es
  // MIN(hora_llegada) de las unidades (es_refuerzo=false) — misma derivación
  // que obtenerAlarmasEscolaresDetalle (lib/reportes-operativos/repository.ts).
  const [totales, top] = await Promise.all([
    query<{ total: number; falsas: number; activaciones_totales: number; tiempo_arribo_min: number | null }>(
      `SELECT
         count(*)::int AS total,
         count(*) FILTER (WHERE a.es_falso = true)::int AS falsas,
         COALESCE(SUM(a.activaciones), 0)::int AS activaciones_totales,
         AVG(EXTRACT(EPOCH FROM (du.hora_arribo - d.fecha_hora_despacho)) / 60)
           FILTER (WHERE du.hora_arribo IS NOT NULL AND d.fecha_hora_despacho IS NOT NULL) AS tiempo_arribo_min
       FROM incidentes i
       JOIN incidente_alarma_escolar a ON a.incidente_id = i.id
       LEFT JOIN incidente_despacho d ON d.incidente_id = i.id
       LEFT JOIN LATERAL (
         SELECT MIN(du2.hora_llegada) AS hora_arribo
         FROM incidente_despacho_unidades du2
         WHERE du2.despacho_id = d.id AND du2.es_refuerzo = false
       ) du ON true
       WHERE i.fecha_hora_inicio >= $1 AND i.fecha_hora_inicio <= $2`,
      [desde, hasta],
    ),
    query<{ establecimiento: string; total: number }>(
      `SELECT a.establecimiento, count(*)::int AS total
       FROM incidentes i
       JOIN incidente_alarma_escolar a ON a.incidente_id = i.id
       WHERE i.fecha_hora_inicio >= $1 AND i.fecha_hora_inicio <= $2 AND a.establecimiento IS NOT NULL
       GROUP BY a.establecimiento
       ORDER BY total DESC
       LIMIT 5`,
      [desde, hasta],
    ),
  ])
  const t = totales.rows[0]
  const total = t?.total ?? 0
  const falsas = t?.falsas ?? 0
  return {
    total,
    falsas,
    porcentajeFalsas: total > 0 ? Math.round((falsas / total) * 1000) / 10 : 0,
    activacionesTotales: t?.activaciones_totales ?? 0,
    tiempoArriboPromedioMin: t?.tiempo_arribo_min != null ? Number(t.tiempo_arribo_min) : null,
    topEstablecimientos: top.rows.map(r => ({ establecimiento: r.establecimiento, total: r.total })),
  }
}

export async function obtenerKpiExtorsion(desde: string, hasta: string): Promise<KpiExtorsion> {
  // Canalizados = extorsiones con unidad real asignada: mismo subquery de
  // resolución de unidad que obtenerExtorsionesDetalle (lib/reportes-operativos/
  // repository.ts) — cruza con incidente_despacho_unidades.unidad_placa vía
  // incidente_despacho, default 'C4' si no hubo despacho. Unidad != 'C4' = canalizado.
  const [totales, tendencia, gruposTop] = await Promise.all([
    query<{ total: number; canalizados: number }>(
      `SELECT
         count(*)::int AS total,
         count(*) FILTER (WHERE (
           SELECT string_agg(du.unidad_placa, ', ')
           FROM incidente_despacho_unidades du
           JOIN incidente_despacho d ON d.id = du.despacho_id
           WHERE d.incidente_id = i.id AND du.unidad_placa IS NOT NULL AND du.unidad_placa <> ''
         ) IS NOT NULL)::int AS canalizados
       FROM incidentes i
       JOIN incidente_extorsion e ON e.incidente_id = i.id
       WHERE i.fecha_hora_inicio >= $1 AND i.fecha_hora_inicio <= $2`,
      [desde, hasta],
    ),
    query<{ dia: Date | string; total: number }>(
      `SELECT i.fecha_hora_inicio::date AS dia, count(*)::int AS total
       FROM incidentes i
       JOIN incidente_extorsion e ON e.incidente_id = i.id
       WHERE i.fecha_hora_inicio >= $1 AND i.fecha_hora_inicio <= $2
       GROUP BY 1 ORDER BY 1`,
      [desde, hasta],
    ),
    query<{ grupo_delictivo: string; total: number }>(
      `SELECT e.grupo_delictivo, count(*)::int AS total
       FROM incidentes i
       JOIN incidente_extorsion e ON e.incidente_id = i.id
       WHERE i.fecha_hora_inicio >= $1 AND i.fecha_hora_inicio <= $2
         AND e.grupo_delictivo IS NOT NULL AND e.grupo_delictivo <> ''
       GROUP BY e.grupo_delictivo ORDER BY total DESC LIMIT 5`,
      [desde, hasta],
    ),
  ])
  const t = totales.rows[0]
  const total = t?.total ?? 0
  const canalizados = t?.canalizados ?? 0
  return {
    total,
    tendenciaDiaria: tendencia.rows.map(r => ({
      dia: r.dia instanceof Date ? r.dia.toISOString().slice(0, 10) : String(r.dia),
      total: r.total,
    })),
    topGruposDelictivos: gruposTop.rows.map(r => ({ grupoDelictivo: r.grupo_delictivo, total: r.total })),
    canalizadosADespacho: canalizados,
    porcentajeCanalizados: total > 0 ? Math.round((canalizados / total) * 1000) / 10 : 0,
  }
}
