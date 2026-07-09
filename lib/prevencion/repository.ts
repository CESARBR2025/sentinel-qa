import { query } from '@/lib/db'
import type { FichaBusquedaDetalle, MedidaDetalle, SeguimientoBusqueda, SolicitudInformacion } from './types'
import { rowToFichaBusquedaDetalle, rowToMedidaDetalle, rowToSeguimiento, rowToSolicitud } from './mapper'

export async function getMedidas(filters: {
  autoridad?: string
  prorrogadas?: string
}): Promise<any[]> {
  let sql = `SELECT * FROM medidas_proteccion WHERE 1=1`
  const values: any[] = []
  if (filters.autoridad) { values.push(filters.autoridad); sql += ` AND autoridad = $${values.length}` }
  if (filters.prorrogadas === '1') { values.push(true); sql += ` AND prorrogada = $${values.length}` }
  sql += ` ORDER BY creado_en DESC`
  const result = await query<any>(sql, values)
  return result.rows
}

export async function getVisitaMedidaIds(): Promise<string[]> {
  const result = await query<{ medida_id: string }>(`SELECT DISTINCT medida_id FROM visitas_domiciliarias`)
  return result.rows.map(v => v.medida_id)
}

export async function getMedidasStats(): Promise<{ fecha_vencimiento: string; status: string }[]> {
  const result = await query<{ fecha_vencimiento: string; status: string }>(
    `SELECT fecha_vencimiento, status FROM medidas_proteccion`
  )
  return result.rows
}

export async function getFichasBusqueda(): Promise<any[]> {
  const result = await query<any>(`SELECT * FROM fichas_busqueda ORDER BY fecha_activacion DESC`)
  return result.rows
}

export async function listarSolicitudesJuridico(): Promise<SolicitudInformacion[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM solicitudes_informacion WHERE status = $1 ORDER BY creado_en DESC`,
    ['en_juridico']
  )
  return result.rows.map(rowToSolicitud)
}

export async function obtenerSolicitud(id: string): Promise<any> {
  const result = await query<any>(
    `SELECT * FROM solicitudes_informacion WHERE id = $1 LIMIT 1`,
    [id]
  )
  return result.rows[0] ?? null
}

export async function listarSolicitudesC4(solicitudId: string): Promise<any[]> {
  const result = await query<any>(
    `SELECT * FROM solicitudes_c4_internas WHERE solicitud_id = $1 ORDER BY creado_en ASC`,
    [solicitudId]
  )
  return result.rows
}

export async function obtenerContestacion(solicitudId: string): Promise<any> {
  const result = await query<any>(
    `SELECT * FROM contestaciones WHERE solicitud_id = $1 LIMIT 1`,
    [solicitudId]
  )
  return result.rows[0] ?? null
}

export async function obtenerMedidaDetalle(id: string): Promise<MedidaDetalle | null> {
  const result = await query<any>(
    `SELECT * FROM medidas_proteccion WHERE id = $1 LIMIT 1`,
    [id]
  )
  return result.rows.length ? rowToMedidaDetalle(result.rows[0]) : null
}

export async function listarVisitas(medidaId: string): Promise<any[]> {
  const result = await query<any>(
    `SELECT * FROM visitas_domiciliarias WHERE medida_id = $1 ORDER BY fecha_visita DESC`,
    [medidaId]
  )
  return result.rows
}

export async function listarAutoridadesAdicionales(medidaId: string): Promise<any[]> {
  const result = await query<any>(
    `SELECT * FROM medida_autoridades_adicionales WHERE medida_id = $1 ORDER BY creado_en ASC`,
    [medidaId]
  )
  return result.rows
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
