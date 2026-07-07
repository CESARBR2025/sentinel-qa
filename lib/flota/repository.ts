import { query } from "@/lib/db";
import type { PatrullaRow, FlotaVehiculoRaw } from "./types";

export class FlotaRepository {
  static async estaStale(horas: number = 6): Promise<boolean> {
    const result = await query<{ stale: boolean }>(
      `SELECT COALESCE(
        (SELECT MAX(sincronizado_en) < NOW() - ($1::int || ' hours')::interval FROM via.v2_patrullas),
        true
      ) AS stale`,
      [horas],
    );
    return result.rows[0].stale;
  }

  static async upsertPatrullas(vehiculos: FlotaVehiculoRaw[]): Promise<void> {
    if (vehiculos.length === 0) return;

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
        vehiculos.map((v) => v.placa_vehiculo),
        vehiculos.map((v) => v.placa_vehiculo),
        vehiculos.map(
          (v) => `${v.marca} ${v.modelo} ${v.tipo_vehiculo}`.trim(),
        ),
      ],
    );
  }

  static async listarActivas(): Promise<PatrullaRow[]> {
    const result = await query<PatrullaRow>(
      `SELECT id, numero_unidad, placas, descripcion, activo, sincronizado_en
       FROM via.v2_patrullas
       WHERE activo = true
       ORDER BY numero_unidad`,
    );
    return result.rows;
  }

  static async obtenerPorId(id: string): Promise<PatrullaRow | null> {
    const result = await query<PatrullaRow>(
      `SELECT id, numero_unidad, placas, descripcion, activo, sincronizado_en
       FROM via.v2_patrullas
       WHERE id = $1
       LIMIT 1`,
      [id],
    );
    return result.rows[0] ?? null;
  }
}
