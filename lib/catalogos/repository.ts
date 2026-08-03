import { query } from '@/lib/db'
import type { PatrullaCatalogo, PatrullaCatalogoInput } from './types'
import { rowToPatrullaCatalogo } from './mapper'

const COLUMNAS = `id, placa, num_serie, departamento, caracteristicas, marca, modelo,
                  gps, radio, camaras, activo, sincronizado_en`

export async function listarPatrullas(): Promise<PatrullaCatalogo[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT ${COLUMNAS}
     FROM via.v2_patrullas
     ORDER BY activo DESC, placa ASC NULLS LAST`,
  )
  return result.rows.map(rowToPatrullaCatalogo)
}

export async function obtenerPatrullaPorId(id: string): Promise<PatrullaCatalogo | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT ${COLUMNAS}
     FROM via.v2_patrullas
     WHERE id = $1
     LIMIT 1`,
    [id],
  )
  return result.rows.length ? rowToPatrullaCatalogo(result.rows[0]) : null
}

export async function crearPatrulla(data: PatrullaCatalogoInput): Promise<void> {
  await query(
    `INSERT INTO via.v2_patrullas
       (placa, num_serie, departamento, caracteristicas, marca, modelo,
        gps, radio, camaras, activo, sincronizado_en)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true, NOW())`,
    [data.placa, data.numSerie, data.departamento, data.caracteristicas,
     data.marca, data.modelo, data.gps, data.radio, data.camaras],
  )
}

export async function actualizarPatrulla(id: string, data: PatrullaCatalogoInput): Promise<void> {
  await query(
    `UPDATE via.v2_patrullas SET
       placa = $1, num_serie = $2, departamento = $3, caracteristicas = $4,
       marca = $5, modelo = $6, gps = $7, radio = $8, camaras = $9,
       sincronizado_en = NOW()
     WHERE id = $10`,
    [data.placa, data.numSerie, data.departamento, data.caracteristicas,
     data.marca, data.modelo, data.gps, data.radio, data.camaras, id],
  )
}

// Cuenta los oficiales (de cualquier estatus) que siguen apuntando a la patrulla.
// Se usa para bloquear la eliminación cuando la patrulla tiene personal asignado.
export async function contarOficialesPorPatrulla(patrullaId: string): Promise<number> {
  const result = await query<{ n: string }>(
    `SELECT COUNT(*)::text AS n FROM ofi_oficiales WHERE patrulla_id = $1`,
    [patrullaId],
  )
  return Number(result.rows[0]?.n ?? 0)
}

export async function eliminarPatrulla(id: string): Promise<void> {
  await query(`DELETE FROM via.v2_patrullas WHERE id = $1`, [id])
}
