import { query } from '@/lib/db'
import type { CatalogoItem, IncidenteDetalle, IncidenteStats } from './types'
import { rowToCatalogo, rowToIncidenteDetalle } from './mapper'

export async function obtenerCatalogos(): Promise<{
  emergencias: CatalogoItem[]
  incidentes: CatalogoItem[]
  prioridades: CatalogoItem[]
  canalizaciones: CatalogoItem[]
}> {
  const [e, i, p, c] = await Promise.all([
    query<Record<string, unknown>>('SELECT id, nombre FROM cat_tipos_emergencia WHERE activo = $1 ORDER BY nombre', [true]),
    query<Record<string, unknown>>('SELECT id, nombre FROM cat_tipos_incidente WHERE activo = $1 ORDER BY nombre', [true]),
    query<Record<string, unknown>>('SELECT id, nombre FROM cat_prioridades WHERE activo = $1 ORDER BY orden', [true]),
    query<Record<string, unknown>>('SELECT id, nombre FROM cat_medios_canalizacion WHERE activo = $1 ORDER BY nombre', [true]),
  ])
  return {
    emergencias: e.rows.map(rowToCatalogo),
    incidentes: i.rows.map(rowToCatalogo),
    prioridades: p.rows.map(rowToCatalogo),
    canalizaciones: c.rows.map(rowToCatalogo),
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

export async function listarIncidentes(
  canal: string | null,
  page: number,
  pageSize: number,
): Promise<{ rows: IncidenteDetalle[]; total: number }> {
  const offset = (page - 1) * pageSize
  let where = ''
  const params: unknown[] = []
  if (canal) {
    where = 'WHERE i.canal = $1'
    params.push(canal)
  }

  const countResult = await query<{ value: number }>(
    `SELECT count(*)::int AS value FROM incidentes i ${where}`,
    params,
  )
  const total = countResult.rows[0].value

  const dataParams = canal ? [canal, pageSize, offset] : [pageSize, offset]
  const dataWhere = canal ? 'WHERE i.canal = $1' : ''

  const dataResult = await query<Record<string, unknown>>(
    `SELECT i.*, cti.nombre AS tipo_nombre, cp.nombre AS prioridad_nombre, cte.nombre AS emergencia_nombre
     FROM incidentes i
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
     LEFT JOIN cat_tipos_emergencia cte ON i.tipo_emergencia_id = cte.id
     ${dataWhere}
     ORDER BY i.fecha_hora_inicio DESC
     LIMIT $${canal ? 2 : 1} OFFSET $${canal ? 3 : 2}`,
    dataParams,
  )

  return { rows: dataResult.rows.map(rowToIncidenteDetalle), total }
}

export async function obtenerIncidente(id: string): Promise<IncidenteDetalle | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT i.*, cti.nombre AS tipo_nombre, cp.nombre AS prioridad_nombre, cte.nombre AS emergencia_nombre
     FROM incidentes i
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
     LEFT JOIN cat_tipos_emergencia cte ON i.tipo_emergencia_id = cte.id
     WHERE i.id = $1
     LIMIT 1`,
    [id],
  )
  return result.rows.length ? rowToIncidenteDetalle(result.rows[0]) : null
}

export async function obtenerIncidenteConExtras(id: string): Promise<Record<string, unknown> | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT row_to_json(i.*) AS inc, cti.nombre AS tipo_nombre, cp.nombre AS prioridad_nombre,
            cte.nombre AS emergencia_nombre, row_to_json(ie.*) AS ext, row_to_json(iae.*) AS ala,
            row_to_json(irc.*) AS rep
     FROM incidentes i
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
     LEFT JOIN cat_tipos_emergencia cte ON i.tipo_emergencia_id = cte.id
     LEFT JOIN incidente_extorsion ie ON i.id = ie.incidente_id
     LEFT JOIN incidente_alarma_escolar iae ON i.id = iae.incidente_id
     LEFT JOIN incidente_reporte_campo irc ON i.id = irc.incidente_id
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
