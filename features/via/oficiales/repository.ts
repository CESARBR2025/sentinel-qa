import { query } from "@/lib/db";
import { mapRowToOficialViaDTO } from "./mapper";

export class OficialesViaRepository {
  static async obtenerOficialIdPorUserId(userId: string): Promise<string | null> {
    const result = await query<{ id: string }>(
      `SELECT id FROM ofi_oficiales WHERE user_id = $1 AND ofi_estatus = 'activo' LIMIT 1`,
      [userId],
    );
    return result.rows[0]?.id ?? null;
  }

  static async obtenerOficialPorUserId(userId: string) {
    const result = await query(
      `SELECT * FROM ofi_oficiales WHERE user_id = $1 AND ofi_estatus = 'activo' LIMIT 1`,
      [userId],
    );
    return result.rows.length ? mapRowToOficialViaDTO(result.rows[0] as any) : null;
  }

  static async obtenerOficialPorId(oficialId: string) {
    const result = await query(
      `SELECT * FROM ofi_oficiales WHERE id = $1 LIMIT 1`,
      [oficialId],
    );
    return result.rows.length ? mapRowToOficialViaDTO(result.rows[0] as any) : null;
  }
}
