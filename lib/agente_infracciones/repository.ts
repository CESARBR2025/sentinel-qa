import { query, queryVia, viaPool } from "@/lib/db";
import type { RolRow, CapturaInfractorInput } from "./types";
import { inputToDbParams } from './mapper'

export async function obtenerRolUsuario(userId: string): Promise<string> {
  const result = await query<RolRow>(
    `SELECT r.nombre AS rol
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [userId],
  );
  return result.rows[0]?.rol ?? "";
}

export async function obtenerLiberaciones() {
  return queryVia<Record<string, unknown>>(`
    SELECT
      id,
      folio,
      estatus,
      placa,
      created_at,
      correo_infractor,
      nombre_infractor,
      estatus_dependencia,
      no_carpeta_investigacion,
      url_orden_salida_liberaciones
    FROM v2_infracciones
    WHERE estatus_dependencia IN ('LIBERADO_POR_INFRACCIONES', 'LIBERADO_INFRACCIONES_INSTANTE')
       OR (estatus = 'REGISTRADA' AND estatus_dependencia = 'PENDIENTE_DATOS_INFRACTOR')
       OR (estatus = 'PENDIENTE_PAGO' AND estatus_dependencia IN ('PENDIENTE_PAGO_LIBERACION', 'PENDIENTE_PAGO_INFRACCION'))
       OR (estatus = 'PAGADA' AND estatus_dependencia = 'PENDIENTE_DEVOLUCION_GARANTIA')
       OR (estatus = 'FINALIZADA' AND estatus_dependencia IN ('FINALIZADA_ACCIDENTE', 'FINALIZADA_INFRACCION', 'FINALIZADA_DELITO'))
  `);
}

export interface InfraccionUpdateRow {
  id: string
  folio: string
  fraccion_id: string
  descuento_aplicado: number | null
}

export async function actualizarDatosInfractor(input: CapturaInfractorInput) {
  const p = inputToDbParams(input)
  return viaPool.query<InfraccionUpdateRow>(
    `UPDATE public.v2_infracciones
     SET es_titular = $2,
         nombre_infractor = COALESCE($3, nombre_infractor),
         apellido_paterno_infractor = COALESCE($4, apellido_paterno_infractor),
         apellido_materno_infractor = COALESCE($5, apellido_materno_infractor),
         curp_infractor = COALESCE($6, curp_infractor),
         correo_infractor = COALESCE($7, correo_infractor),
         nombre_titular_liberacion = CASE WHEN $2 THEN $3 ELSE $8 END,
         appaterno_titular_liberacion = CASE WHEN $2 THEN $4 ELSE $9 END,
         apmaterno_titular_liberacion = CASE WHEN $2 THEN $5 ELSE $10 END,
         curp_titular_liberacion = CASE WHEN $2 THEN $6 ELSE $11 END,
         correo_titular_liberacion = CASE WHEN $2 THEN $7 ELSE $12 END,
         estatus = 'PENDIENTE_PAGO',
         estatus_dependencia = 'PENDIENTE_PAGO_INFRACCION',
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, folio, fraccion_id, descuento_aplicado`,
    [
      input.id,
      p.es_titular,
      p.nombre_infractor,
      p.apellido_paterno_infractor,
      p.apellido_materno_infractor,
      p.curp_infractor,
      p.correo_infractor,
      p.nombre_titular_liberacion,
      p.appaterno_titular_liberacion,
      p.apmaterno_titular_liberacion,
      p.curp_titular_liberacion,
      p.correo_titular_liberacion,
    ],
  )
}

export async function obtenerConceptoId(fraccionId: string) {
  const result = await viaPool.query<{ concept_id: number }>(
    `SELECT ccs.concept_id
     FROM v2_fracciones_ley fl
     JOIN v2_catalogo_conceptos_sa7 ccs ON ccs.clasificacion_type = fl.clasificacion
     WHERE fl.id = $1`,
    [fraccionId],
  )
  return result.rows[0]?.concept_id ?? null
}

export async function liberarGarantia(id: string) {
  return viaPool.query<{ id: string; folio: string }>(
    `UPDATE public.v2_infracciones
     SET estatus = 'CERRADA',
         estatus_dependencia = 'LIBERADO_POR_INFRACCIONES',
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, folio`,
    [id],
  )
}

export async function insertarOrdenPagoSa7(params: {
  infraccion_id: string
  folio_infraccion: string
  nombre_usuario: string
  apellidos_usuario: string
  concepto_id: string
  orden_pago_id: string | null
  estatus: string | null
  url_pago: string | null
  url_guardado: string | null
  folio_orden: string | null
  fecha_vencimiento: string | null
  total_pesos: string | null
  total_umas: string | null
  request_payload: string
}) {
  await viaPool.query(
    `INSERT INTO v2_ordenes_pago_sa7 (
      infraccion_id, folio_infraccion, nombre_usuario, apellidos_usuario, concepto_id,
      orden_pago_id, estatus, url_pago, url_guardado, folio_orden,
      fecha_vencimiento, total_pesos, total_umas, request_payload
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [
      params.infraccion_id, params.folio_infraccion, params.nombre_usuario, params.apellidos_usuario, params.concepto_id,
      params.orden_pago_id, params.estatus, params.url_pago, params.url_guardado, params.folio_orden,
      params.fecha_vencimiento || null, params.total_pesos || 0, params.total_umas || 0,
      params.request_payload,
    ],
  )
}

