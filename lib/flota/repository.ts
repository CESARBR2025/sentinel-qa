import { query } from '@/lib/db'
import type { FlotaVehiculoRaw, Patrulla } from './types'
import { rowToPatrulla } from './mapper'

export async function estaStale(horas: number = 6): Promise<boolean> {
  const result = await query<{ stale: boolean }>(
    `SELECT COALESCE(
      (SELECT MAX(sincronizado_en) < NOW() - ($1::int || ' hours')::interval FROM via.v2_patrullas),
      true
    ) AS stale`,
    [horas],
  )
  return result.rows[0].stale
}

export async function upsertPatrullas(vehiculos: FlotaVehiculoRaw[]): Promise<void> {
  if (vehiculos.length === 0) return

  await query(
    `INSERT INTO via.v2_patrullas (numero_unidad, placas, descripcion, activo, sincronizado_en)
     SELECT
       unnest($1::text[]),
       unnest($2::text[]),
       unnest($3::text[]),
       true,
       NOW()
     ON CONFLICT (numero_unidad)
     DO UPDATE SET
       placas          = EXCLUDED.placas,
       descripcion     = EXCLUDED.descripcion,
       sincronizado_en = NOW()`,
    [
      vehiculos.map((v) => v.placaVehiculo),
      vehiculos.map((v) => v.placaVehiculo),
      vehiculos.map((v) => `${v.marca} ${v.modelo} ${v.tipoVehiculo}`.trim()),
    ],
  )
}

export async function listarActivas(): Promise<Patrulla[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, numero_unidad, placas, descripcion, activo, sincronizado_en
     FROM via.v2_patrullas
     WHERE activo = true
     ORDER BY numero_unidad`,
  )
  return result.rows.map(rowToPatrulla)
}

export async function obtenerPorId(id: string): Promise<Patrulla | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, numero_unidad, placas, descripcion, activo, sincronizado_en
     FROM via.v2_patrullas
     WHERE id = $1
     LIMIT 1`,
    [id],
  )
  return result.rows.length ? rowToPatrulla(result.rows[0]) : null
}
