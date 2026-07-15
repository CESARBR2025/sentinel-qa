import { query } from "@/lib/db";
import type { RolRow } from "./types";

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
  return query<Record<string, unknown>>(`
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
    FROM via.v2_infracciones
    WHERE estatus_dependencia IN ('ESPERA_REVISION', 'EN_PROCESO_LIBERACIONES', 'LIBERADA_POR_INFRACCION', 'VEHICULO_EN_CORRALON', 'LIBERADA_POR_DELITO', 'LIBERADA_POR_ACCIDENTE', 'FINALIZADA_ACCIDENTE', 'FINALIZADA_INFRACCION', 'FINALIZADA_DELITO')
       OR (estatus = 'REGISTRADA' AND estatus_dependencia IN ('MESA_DE_CONTROL_REVISION', 'MESA_DE_CONTROL_PENDIENTE_DOCS'))
       OR (estatus = 'PENDIENTE_PAGO' AND estatus_dependencia = 'PENDIENTE_PAGO_LIBERACION')
       OR (estatus = 'FINALIZADA' AND estatus_dependencia IN ('FINALIZADA_ACCIDENTE', 'FINALIZADA_INFRACCION', 'FINALIZADA_DELITO'))
  `);
}

/* ─── capturarInfractorAction ─── */

export async function actualizarInfractor(data: {
  id: string;
  nombre: string | null;
  apellidoP: string | null;
  apellidoM: string | null;
  correo: string | null;
  esTitular: boolean;
}): Promise<Record<string, unknown> | null> {
  const result = await query<Record<string, unknown>>(
    `UPDATE via.v2_infracciones
     SET nombre_infractor = COALESCE($2, nombre_infractor),
         apellido_paterno_infractor = COALESCE($3, apellido_paterno_infractor),
         apellido_materno_infractor = COALESCE($4, apellido_materno_infractor),
         correo_infractor = COALESCE($5, correo_infractor),
         es_titular = $6,
         nombre_titular_liberacion = CASE WHEN $6 = true THEN $2 ELSE 'NO_DATA' END,
         appaterno_titular_liberacion = CASE WHEN $6 = true THEN $3 ELSE 'NO_DATA' END,
         apmaterno_titular_liberacion = CASE WHEN $6 = true THEN $4 ELSE 'NO_DATA' END,
         correo_titular_liberacion = CASE WHEN $6 = true THEN $5 ELSE 'NO_DATA' END,
         estatus = 'REGISTRADA',
         estatus_dependencia = 'MESA_DE_CONTROL_PENDIENTE_DOCS',
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, folio, descuento_aplicado, fraccion_id`,
    [data.id, data.nombre, data.apellidoP, data.apellidoM, data.correo, data.esTitular],
  );
  return result.rows[0] ?? null;
}

export async function obtenerConceptoPorFraccion(fraccionId: unknown): Promise<string | null> {
  const result = await query<{ concept_id: string }>(
    `SELECT ccs.concept_id
     FROM via.v2_fracciones_ley fl
     JOIN via.v2_catalogo_conceptos_sa7 ccs ON ccs.clasificacion_type = fl.clasificacion
     WHERE fl.id = $1`,
    [fraccionId],
  );
  return result.rows[0]?.concept_id ?? null;
}

/* ─── obtenerDocumentosLiberacion ─── */

export async function obtenerSolicitudPorInfraccion(infraccionId: string): Promise<Record<string, unknown> | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, tipo_liberacion, es_empresa, nombre_empresa, rfc_empresa, estatus
     FROM via.v2_solicitudes_liberacion
     WHERE infraccion_id = $1`,
    [infraccionId],
  );
  return result.rows[0] ?? null;
}

export async function obtenerDocumentosPorSolicitud(solicitudId: string): Promise<Record<string, unknown>[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT DISTINCT ON (dl.tipo_documento)
            dl.id, dl.tipo_documento, dl.url_documento, dl.estatus_revision, dl.observaciones, dl.created_at
     FROM via.v2_documentos_liberacion dl
     WHERE dl.solicitud_id = $1
     ORDER BY dl.tipo_documento, dl.created_at DESC`,
    [solicitudId],
  );
  return result.rows;
}

/* ─── revisarDocumentoAction ─── */

export async function actualizarRevisionDocumento(
  documentoId: string,
  accion: string,
  observaciones: string | null,
): Promise<boolean> {
  const result = await query<Record<string, unknown>>(
    `UPDATE via.v2_documentos_liberacion
     SET estatus_revision = $1, observaciones = $2, fecha_revision = NOW()
     WHERE id = $3
     RETURNING id`,
    [accion, observaciones, documentoId],
  );
  return result.rows.length > 0;
}

/* ─── finalizarRevisionAction ─── */

export async function obtenerSolicitudIdPorInfraccion(infraccionId: string): Promise<string | null> {
  const result = await query<{ id: string }>(
    `SELECT id FROM via.v2_solicitudes_liberacion
     WHERE infraccion_id = $1
     ORDER BY created_at DESC LIMIT 1`,
    [infraccionId],
  );
  return result.rows[0]?.id ?? null;
}

export async function obtenerEstatusDocumentosPorSolicitud(solicitudId: string): Promise<Record<string, unknown>[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT DISTINCT ON (dl.tipo_documento) dl.estatus_revision
     FROM via.v2_documentos_liberacion dl
     WHERE dl.solicitud_id = $1
     ORDER BY dl.tipo_documento, dl.created_at DESC`,
    [solicitudId],
  );
  return result.rows;
}

export async function obtenerInfraccionDetallePorId(infraccionId: string): Promise<Record<string, unknown> | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT i.folio, i.descuento_aplicado, i.fraccion_id,
            i.nombre_infractor, i.apellido_paterno_infractor, i.apellido_materno_infractor,
            i.nombre_titular_liberacion, i.appaterno_titular_liberacion, i.apmaterno_titular_liberacion,
            i.correo_titular_liberacion, i.correo_infractor
     FROM via.v2_infracciones i WHERE i.id = $1`,
    [infraccionId],
  );
  return result.rows[0] ?? null;
}

export async function actualizarInfraccionEstatus(
  infraccionId: string,
  estatus: string,
  estatusDependencia: string,
): Promise<void> {
  await query(
    `UPDATE via.v2_infracciones SET estatus = $1, estatus_dependencia = $2, updated_at = NOW() WHERE id = $3`,
    [estatus, estatusDependencia, infraccionId],
  );
}

export async function actualizarSolicitudEstatus(solicitudId: string, estatus: string): Promise<void> {
  await query(
    `UPDATE via.v2_solicitudes_liberacion SET estatus = $1, updated_at = NOW() WHERE id = $2`,
    [estatus, solicitudId],
  );
}

/* ─── generarOrdenPagoAction ─── */

export async function insertarOrdenPago(data: {
  infraccionId: string;
  folio: string;
  nombreUsuario: string;
  apellidosUsuario: string;
  conceptoPrueba: string;
  ordenPagoId: string | null;
  estatus: string | null;
  urlPago: string | null;
  urlGuardado: string | null;
  folioOrden: string | null;
  fechaVencimiento: string | null;
  totalPesos: string | number;
  totalUmas: string | number;
  payloadSA7: string;
}): Promise<void> {
  await query(
    `INSERT INTO via.v2_ordenes_pago_sa7 (
      infraccion_id, folio_infraccion, nombre_usuario, apellidos_usuario, concepto_id,
      orden_pago_id, estatus, url_pago, url_guardado, folio_orden,
      fecha_vencimiento, total_pesos, total_umas, request_payload
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [
      data.infraccionId, data.folio, data.nombreUsuario, data.apellidosUsuario, data.conceptoPrueba,
      data.ordenPagoId, data.estatus, data.urlPago, data.urlGuardado, data.folioOrden,
      data.fechaVencimiento, data.totalPesos, data.totalUmas, data.payloadSA7,
    ],
  );
}


