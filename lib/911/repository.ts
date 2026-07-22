import { query } from '@/lib/db'
import type { CatalogoItem, IncidenteDetalle, IncidenteStats, CatalogosJerarquicos, SubtipoEmergencia, IncidenteCatalogo, Dependencia } from './types'
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

export async function listarIncidentes(
  canal: string | null,
  page: number,
  pageSize: number,
  estatus?: string | null,
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
  if (estatus) {
    idx++
    conditions.push(`i.estatus = $${idx}`)
    params.push(estatus)
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

export async function contarPorEstatus(canal: string): Promise<{ estatus: string; count: number }[]> {
  const result = await query<{ estatus: string; count: number }>(
    `SELECT estatus, count(*)::int as count FROM incidentes WHERE canal = $1 GROUP BY estatus`,
    [canal],
  )
  return result.rows
}

export async function obtenerDespachadores(): Promise<{ id: string; name: string; apellido: string; rolNombre: string | null; activo: boolean }[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT DISTINCT u.id, u.name, u.apellido, u.activo, r.nombre AS rol_nombre
     FROM users u
     INNER JOIN permisos p ON p.usuario_id = u.id
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE p.seccion = '911_despacho' AND p.puede_ver = true
     AND u.dependencia_id = (SELECT id FROM cat_dependencias WHERE clave = 'SEGURIDAD_PUBLICA' LIMIT 1)
     ORDER BY u.name`,
  )
  return result.rows.map(r => ({
    id: String(r.id),
    name: String(r.name),
    apellido: r.apellido ? String(r.apellido) : '',
    rolNombre: r.rol_nombre ? String(r.rol_nombre) : null,
    activo: Boolean(r.activo),
  }))
}
