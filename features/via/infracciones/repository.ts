import { query } from "@/lib/db";
import { InfraccionDB } from "./types";

export class InfraccionesRepository {
  static async obtenerSiguienteSecuencia(): Promise<number> {
    const result = await query<{ nextval: string }>(`
      SELECT nextval('via.seq_folios_infraccion')
    `);
    return Number(result.rows[0].nextval);
  }

  static async registarNuevaInfraccionRP(data: Partial<InfraccionDB>): Promise<any> {
    const result = await query(
      `WITH inserted AS (
        INSERT INTO via.v2_infracciones (
          correo_infractor,
          folio,
          seq_valor,
          oficial_id,
          patrulla_id,
          articulo_id,
          fraccion_id,
          ciudadano_presente,
          es_titular,
          presenta_ine,
          curp_infractor,
          nombre_infractor,
          apellido_paterno_infractor,
          apellido_materno_infractor,
          marca,
          modelo,
          color,
          placa,
          latitud,
          longitud,
          codigo_postal,
          colonia,
          calle,
          numero,
          municipio,
          estado,
          tipo_garantia,
          garantia_entregada,
          motivo_retencion,
          monto_total,
          aplica_descuento_inapam,
          descuento_aplicado,
          fecha_limite_descuento,
          monto_final,
          grua_id,
          dependencia_receptora,
          anio_vehiculo,
          tipo_vehiculo,
          estatus,
          estatus_dependencia,
          no_serie_vehiculo,
          pin_acceso,
          narrativa_hechos
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43)
        RETURNING *
      )
      SELECT
        inserted.*,
        fl.clasificacion,
        ccs.concept_id
      FROM inserted
      LEFT JOIN via.v2_fracciones_ley fl ON fl.id = inserted.fraccion_id
      LEFT JOIN via.v2_catalogo_conceptos_sa7 ccs ON ccs.clasificacion_type = fl.clasificacion`,
      [
        data.correoInfractor,
        data.folio,
        data.seq_valor,
        data.oficial_id,
        data.patrulla_id,
        data.articulo_id,
        data.fraccion_id,
        data.ciudadano_presente,
        data.es_titular,
        data.presenta_ine,
        data.curp_infractor,
        data.nombre_infractor,
        data.apellido_paterno_infractor,
        data.apellido_materno_infractor,
        data.marca,
        data.modelo,
        data.color,
        data.placa,
        data.latitud,
        data.longitud,
        data.codigo_postal,
        data.colonia,
        data.calle,
        data.numero,
        data.municipio,
        data.estado,
        data.tipo_garantia,
        data.garantia_entregada,
        data.motivo_retencion,
        data.monto_total,
        data.aplica_descuento_inapam,
        data.descuento_aplicado,
        data.fecha_limite_descuento ?? "",
        data.monto_final,
        data.grua_id,
        data.dependenciaRemisora ?? null,
        data.anioVehiculo,
        data.tipoVehiculo,
        data.estatus ?? "REGISTRADA",
        data.estatus_dependencia ?? "NO APLICA",
        data.no_serie_vehiculo,
        data.pin_acceso,
        data.narrativa_hechos ?? null,
      ],
    );
    return result.rows[0];
  }

  static async eliminarInfraccion(id: string): Promise<void> {
    await query(`DELETE FROM via.v2_infracciones WHERE id = $1`, [id]);
  }

  static async obtenerFolio(id: string): Promise<{ folio: string; nombre_infractor: string | null; apellido_paterno_infractor: string | null; apellido_materno_infractor: string | null } | null> {
    const result = await query(
      `SELECT folio, nombre_infractor, apellido_paterno_infractor, apellido_materno_infractor
       FROM via.v2_infracciones WHERE id = $1 LIMIT 1`,
      [id],
    );
    return result.rows[0] as any || null;
  }

  static async obtenerDatosInfraccionCiudadanoRP(id: string) {
    try {
      const result = await query(
        `SELECT
        i.*,
        vfl.clasificacion,
        val.numero AS articulo_numero,
        val.descripcion AS articulo_descripcion,
        vfl.numero AS fraccion_numero,
        vfl.descripcion AS fraccion_descripcion,
        ops.id AS orden_pago_local_id,
        ops.orden_pago_id,
        ops.estatus as estatusPago,
        ops.url_pago,
        ops.url_guardado,
        ops.folio_orden,
        ops.fecha_vencimiento,
        ops.total_pesos,
        ops.total_umas,
        ops.created_at AS orden_pago_created_at,
        ops.concepto_id,
        sl.id AS sl_id,
        sl.tipo_liberacion AS sl_tipo_liberacion,
        sl.es_empresa AS sl_es_empresa,
        sl.nombre_empresa AS sl_nombre_empresa,
        sl.rfc_empresa AS sl_rfc_empresa,
        sl.estatus AS sl_estatus,
        COALESCE(
          (SELECT jsonb_agg(sub.docs ORDER BY sub.docs->>'tipo')
           FROM (
             SELECT DISTINCT ON (dl.tipo_documento)
               jsonb_build_object(
                 'tipo', dl.tipo_documento,
                 'url', dl.url_documento,
                 'label', COALESCE(
                   (SELECT 'Factura' WHERE dl.tipo_documento = 'factura'),
                   (SELECT 'INE del titular' WHERE dl.tipo_documento = 'ine_titular'),
                   (SELECT 'Comprobante de domicilio' WHERE dl.tipo_documento = 'comprobante_domicilio'),
                   (SELECT 'Tarjeta de circulación' WHERE dl.tipo_documento = 'tarjeta_circulacion'),
                   (SELECT 'INE del representante legal' WHERE dl.tipo_documento = 'ine_representante_legal'),
                   (SELECT 'Poder notarial' WHERE dl.tipo_documento = 'poder_notarial'),
                   (SELECT 'Constancia de situación fiscal' WHERE dl.tipo_documento = 'constancia_situacion_fiscal'),
                   dl.tipo_documento
                 )
               ) AS docs
             FROM via.v2_documentos_liberacion dl
             WHERE dl.solicitud_id = sl.id
             ORDER BY dl.tipo_documento, dl.created_at DESC
           ) sub
          ), '[]'::jsonb
        ) AS documentos_liberacion_json
      FROM via.v2_infracciones i
      JOIN via.v2_articulos_ley val ON i.articulo_id = val.id
      JOIN via.v2_fracciones_ley vfl ON i.fraccion_id = vfl.id
      LEFT JOIN via.v2_ordenes_pago_sa7 ops ON ops.infraccion_id = i.id
      LEFT JOIN via.v2_solicitudes_liberacion sl ON sl.infraccion_id = i.id
      WHERE i.id = $1
      GROUP BY i.id, val.numero, val.descripcion, vfl.clasificacion, vfl.numero, vfl.descripcion,
               ops.id, ops.orden_pago_id, ops.estatus, ops.url_pago, ops.url_guardado, ops.folio_orden,
               ops.fecha_vencimiento, ops.total_pesos, ops.total_umas, ops.created_at, ops.concepto_id,
               sl.id, sl.tipo_liberacion, sl.es_empresa, sl.nombre_empresa, sl.rfc_empresa, sl.estatus
      ORDER BY ops.created_at DESC NULLS LAST, sl.id DESC NULLS LAST`,
        [id],
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error("[VIA][REPOSITORY][obtenerDatosInfraccionCiudadanoRP] Error:", err);
      if (err && typeof err === "object") {
        const e = err as Record<string, unknown>;
        console.error("  message:", e.message);
        console.error("  detail:", e.detail);
        console.error("  code:", e.code);
        console.error("  schema:", e.schema);
        console.error("  table:", e.table);
        console.error("  column:", e.column);
        console.error("  constraint:", e.constraint);
      }
      throw err;
    }
  }
}
