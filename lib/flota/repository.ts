import { query } from '@/lib/db'
import type { Patrulla } from './types'
import { rowToPatrulla } from './mapper'

const COLUMNAS = `id, placa, caracteristicas, marca, modelo, num_serie, activo, sincronizado_en`

export async function listarActivas(): Promise<Patrulla[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT ${COLUMNAS}
     FROM via.v2_patrullas
     WHERE activo = true
     ORDER BY placa`,
  )
  return result.rows.map(rowToPatrulla)
}

export async function obtenerPorId(id: string): Promise<Patrulla | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT ${COLUMNAS}
     FROM via.v2_patrullas
     WHERE id = $1
     LIMIT 1`,
    [id],
  )
  return result.rows.length ? rowToPatrulla(result.rows[0]) : null
}

// Una fila por oficial de la tripulación (o una sola fila con oficial_id NULL
// si la patrulla no tiene nadie asignado); el service agrupa por patrulla_id.
export async function listarUnidadesConTripulacionRaw(): Promise<Record<string, unknown>[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       p.id, p.placa, p.caracteristicas, p.marca, p.modelo, p.num_serie,
       o.id AS oficial_id, o.no_nomina,
       u.name AS oficial_name, u.apellido AS oficial_apellido,
       o.ultima_lat, o.ultima_lng, o.ultima_ubicacion_en
     FROM via.v2_patrullas p
     LEFT JOIN ofi_oficiales o ON o.patrulla_id = p.id AND o.ofi_estatus = 'activo'
     LEFT JOIN users u ON u.id = o.user_id
     WHERE p.activo = true
     ORDER BY p.placa, o.ultima_ubicacion_en DESC NULLS LAST`,
  )
  return result.rows
}

export async function listarIdsUnidadesOcupadas(incidenteIdActual: string | null): Promise<Set<string>> {
  const result = await query<{ unidad_ext_id: string }>(
    `SELECT DISTINCT idu.unidad_ext_id
     FROM incidente_despacho_unidades idu
     JOIN incidente_despacho id2 ON id2.id = idu.despacho_id
     JOIN incidentes i ON i.id = id2.incidente_id
     WHERE i.estatus IN ('en_despacho', 'en_sitio')
       AND ($1::uuid IS NULL OR i.id != $1::uuid)`,
    [incidenteIdActual],
  )
  return new Set(result.rows.map(r => r.unidad_ext_id))
}
