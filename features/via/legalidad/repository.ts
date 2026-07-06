import { queryVia } from "@/lib/via/db";

export class ArticulosRepository {
  static async obtenerArticulos() {
    const result = await queryVia(`
      SELECT
        al.id AS articulo_id,
        al.numero AS articulo_numero,
        al.descripcion AS articulo_descripcion,
        al.activo AS articulo_activo,
        fl.id AS fraccion_id,
        fl.numero AS fraccion_numero,
        fl.descripcion AS fraccion_descripcion,
        fl.monto_umas,
        fl.clasificacion,
        fl.activo AS fraccion_activo
      FROM via.v2_articulos_ley al
      LEFT JOIN via.v2_fracciones_ley fl
        ON fl.articulo_id = al.id AND fl.activo = true
      WHERE al.activo = true
      ORDER BY al.numero ASC, fl.numero ASC
    `);

    return result.rows;
  }

  static async obtenerFraccionesPorArticulo(articuloId: string) {
    const result = await queryVia(
      `SELECT
        id, articulo_id, numero, descripcion, monto_umas, clasificacion, activo
      FROM via.v2_fracciones_ley
      WHERE articulo_id = $1 AND activo = true
      ORDER BY numero ASC`,
      [articuloId],
    );

    return result.rows;
  }
}
