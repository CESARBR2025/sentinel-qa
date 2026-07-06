import { queryVia } from "@/lib/via/db";
import { mapRowToOrdenPago } from "./mapper";
import { OrdenPagoSA7 } from "./types";

export class SA7Repository {
  static async obtenerConceptoIdPorClasificacion(clasificacion: string): Promise<number | null> {
    const result = await queryVia<{ concept_id: number }>(
      `SELECT concept_id FROM via.v2_catalogo_conceptos_sa7 WHERE clasificacion_type = $1 LIMIT 1`,
      [clasificacion],
    );
    return result.rows[0]?.concept_id ?? null;
  }

  static async insertarOrdenPago(data: {
    infraccionId: string;
    folioInfraccion: string;
    nombreUsuario: string;
    apellidosUsuario: string;
    conceptoId: string;
    ordenPagoId: string | null;
    estatus: string | null;
    urlPago: string | null;
    urlGuardado: string | null;
    folioOrden: string | null;
    fechaVencimiento: string | null;
    totalPesos: number;
    totalUmas: number;
    requestPayload: any;
  }): Promise<string> {
    const result = await queryVia<{ id: string }>(
      `INSERT INTO via.v2_ordenes_pago_sa7 (
        infraccion_id, folio_infraccion, nombre_usuario, apellidos_usuario, concepto_id,
        orden_pago_id, estatus, url_pago, url_guardado, folio_orden,
        fecha_vencimiento, total_pesos, total_umas, request_payload
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING id`,
      [
        data.infraccionId,
        data.folioInfraccion,
        data.nombreUsuario,
        data.apellidosUsuario,
        data.conceptoId,
        data.ordenPagoId,
        data.estatus,
        data.urlPago,
        data.urlGuardado,
        data.folioOrden,
        data.fechaVencimiento,
        data.totalPesos,
        data.totalUmas,
        JSON.stringify(data.requestPayload),
      ],
    );
    return result.rows[0].id;
  }

  static async buscarOrdenPorInfraccionId(infraccionId: string): Promise<OrdenPagoSA7 | null> {
    const result = await queryVia(
      `SELECT * FROM via.v2_ordenes_pago_sa7 WHERE infraccion_id = $1 LIMIT 1`,
      [infraccionId],
    );
    return result.rows.length ? mapRowToOrdenPago(result.rows[0] as any) : null;
  }

  static async actualizarOrdenPago(infraccionId: string, data: {
    ordenPagoId?: string | null;
    estatus?: string | null;
    urlPago?: string | null;
    urlGuardado?: string | null;
    folioOrden?: string | null;
    fechaVencimiento?: string | null;
    totalPesos?: number;
    totalUmas?: number;
  }): Promise<void> {
    const sets: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (data.ordenPagoId !== undefined) { sets.push(`orden_pago_id = $${idx++}`); values.push(data.ordenPagoId); }
    if (data.estatus !== undefined) { sets.push(`estatus = $${idx++}`); values.push(data.estatus); }
    if (data.urlPago !== undefined) { sets.push(`url_pago = $${idx++}`); values.push(data.urlPago); }
    if (data.urlGuardado !== undefined) { sets.push(`url_guardado = $${idx++}`); values.push(data.urlGuardado); }
    if (data.folioOrden !== undefined) { sets.push(`folio_orden = $${idx++}`); values.push(data.folioOrden); }
    if (data.fechaVencimiento !== undefined) { sets.push(`fecha_vencimiento = $${idx++}`); values.push(data.fechaVencimiento); }
    if (data.totalPesos !== undefined) { sets.push(`total_pesos = $${idx++}`); values.push(data.totalPesos); }
    if (data.totalUmas !== undefined) { sets.push(`total_umas = $${idx++}`); values.push(data.totalUmas); }

    if (sets.length === 0) return;

    values.push(infraccionId);
    await queryVia(
      `UPDATE via.v2_ordenes_pago_sa7 SET ${sets.join(", ")} WHERE infraccion_id = $${idx}`,
      values,
    );
  }
}
