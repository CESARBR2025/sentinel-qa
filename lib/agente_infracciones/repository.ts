import { query } from "@/lib/db";
import type { CapturaInfractorInput } from "./types";
import { inputToDbParams } from './mapper'

export async function obtenerLiberaciones() {
  // Mesa de trabajo del agente de Infracciones: sólo los 4 estados que le
  // interesan operar (garantías no vehiculares — placa/tarjeta/licencia;
  // VEHÍCULO/corralón es de Liberaciones). Estados intermedios de pago
  // (PENDIENTE_PAGO_INSTANTE, PLACA_RETENIDA_EN_TRANSITO, PENDIENTE_PAGO_INFRACCION,
  // PAGADA_PENDIENTE_VERIFICACION) se resuelven solos vía el portal del ciudadano
  // y no requieren acción del agente; siguen consultables con la búsqueda global
  // por folio (obtenerInfraccionIdPorFolio).
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
      tipo_garantia,
      no_carpeta_investigacion,
      url_orden_salida_liberaciones
    FROM via.v2_infracciones
    WHERE estatus_dependencia IN ('LIBERADO_POR_INFRACCIONES', 'LIBERADO_INFRACCIONES_INSTANTE')
       OR (estatus = 'REGISTRADA' AND estatus_dependencia = 'PENDIENTE_DATOS_INFRACTOR')
       OR (estatus = 'PAGADA' AND estatus_dependencia = 'PENDIENTE_DEVOLUCION_GARANTIA')
  `);
}

export async function obtenerInfraccionIdPorFolio(folio: string): Promise<{ id: string; folio: string } | null> {
  const result = await query<{ id: string; folio: string }>(
    `SELECT id, folio FROM via.v2_infracciones WHERE folio = $1 LIMIT 1`,
    [folio],
  )
  return result.rows[0] ?? null
}

export interface InfraccionUpdateRow {
  id: string
  folio: string
  fraccion_id: string
  descuento_aplicado: number | null
}

export async function actualizarDatosInfractor(input: CapturaInfractorInput) {
  const p = inputToDbParams(input)
  return query<InfraccionUpdateRow>(
    `UPDATE via.v2_infracciones
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
  const result = await query<{ concept_id: number }>(
    `SELECT ccs.concept_id
     FROM via.v2_fracciones_ley fl
     JOIN via.v2_catalogo_conceptos_sa7 ccs ON ccs.clasificacion_type = fl.clasificacion
     WHERE fl.id = $1`,
    [fraccionId],
  )
  return result.rows[0]?.concept_id ?? null
}

export async function liberarGarantia(id: string) {
  return query<{ id: string; folio: string }>(
    `UPDATE via.v2_infracciones
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
  await query(
    `INSERT INTO via.v2_ordenes_pago_sa7 (
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

/* ─── Pagos / Órdenes de pago ─── */

export async function marcarOrdenPagoPagada(ordenPagoId: string) {
  await query(
    `UPDATE via.v2_ordenes_pago_sa7 SET estatus = 'P', updated_at = CURRENT_TIMESTAMP WHERE orden_pago_id = $1`,
    [ordenPagoId],
  )
}

/* ─── Infracciones — reads ─── */

export async function obtenerMotivoRetencion(id: string): Promise<string | null> {
  const result = await query<{ motivo_retencion: string }>(
    `SELECT motivo_retencion FROM via.v2_infracciones WHERE id = $1 LIMIT 1`,
    [id],
  )
  return result.rows[0]?.motivo_retencion ?? null
}

export async function obtenerDatosOrdenSalida(infraccionId: string): Promise<Record<string, unknown> | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT i.*, s.es_empresa, s.nombre_empresa, s.rfc_empresa,
            s.nombre_resp_fiscal, s.appaterno_resp_fiscal, s.apmaterno_resp_fiscal,
            g.nombre AS nombre_grua
     FROM via.v2_infracciones i
     LEFT JOIN via.v2_solicitudes_liberacion s ON s.infraccion_id = i.id
     LEFT JOIN via.v2_gruas g ON g.id = i.grua_id
     WHERE i.id = $1
     ORDER BY s.created_at DESC LIMIT 1`,
    [infraccionId],
  )
  return result.rows[0] ?? null
}

export async function obtenerSolicitudLiberacion(infraccionId: string): Promise<Record<string, unknown> | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, tipo_liberacion, es_empresa, nombre_empresa, rfc_empresa, estatus
     FROM via.v2_solicitudes_liberacion
     WHERE infraccion_id = $1
     LIMIT 1`,
    [infraccionId],
  )
  return result.rows[0] ?? null
}

export async function obtenerDocumentosLiberacion(infraccionId: string): Promise<Record<string, unknown>[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT DISTINCT ON (dl.tipo_documento)
            dl.id, dl.tipo_documento, dl.url_documento, dl.estatus_revision, dl.observaciones, dl.created_at
     FROM via.v2_documentos_liberacion dl
     JOIN via.v2_solicitudes_liberacion sl ON sl.id = dl.solicitud_id
     WHERE sl.infraccion_id = $1
     ORDER BY dl.tipo_documento, dl.created_at DESC`,
    [infraccionId],
  )
  return result.rows
}

/* ─── Infracciones — writes ─── */

export async function cerrarInfraccion(id: string, estatusDependencia: string) {
  await query(
    `UPDATE via.v2_infracciones SET estatus = 'CERRADA', estatus_dependencia = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [id, estatusDependencia],
  )
}

export async function actualizarUrlOrdenSalida(infraccionId: string, url: string) {
  await query(
    `UPDATE via.v2_infracciones SET url_orden_salida_liberaciones = $2, updated_at = NOW() WHERE id = $1`,
    [infraccionId, url],
  )
}

export async function actualizarDatosInfractorIniciarProceso(params: {
  id: string
  es_titular: boolean
  nombre_titular: string | null
  appaterno_titular: string | null
  apmaterno_titular: string | null
  curp_titular: string | null
  correo_titular: string | null
  nombre_infractor: string | null
  appaterno_infractor: string | null
  apmaterno_infractor: string | null
  curp_infractor: string | null
  correo_infractor: string | null
}) {
  const result = await query<Record<string, unknown>>(
    `UPDATE via.v2_infracciones
     SET es_titular = $2,
         nombre_titular_liberacion = COALESCE($3, nombre_titular_liberacion),
         appaterno_titular_liberacion = COALESCE($4, appaterno_titular_liberacion),
         apmaterno_titular_liberacion = COALESCE($5, apmaterno_titular_liberacion),
         curp_titular_liberacion = COALESCE($6, curp_titular_liberacion),
         correo_titular_liberacion = COALESCE($7, correo_titular_liberacion),
         nombre_infractor = COALESCE(NULLIF($8, ''), nombre_infractor),
         apellido_paterno_infractor = COALESCE(NULLIF($9, ''), apellido_paterno_infractor),
         apellido_materno_infractor = COALESCE(NULLIF($10, ''), apellido_materno_infractor),
         curp_infractor = COALESCE(NULLIF($11, ''), curp_infractor),
         correo_infractor = COALESCE(NULLIF($12, ''), correo_infractor),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, folio, clasificacion, descuento_aplicado, monto_total, nombre_infractor,
               apellido_paterno_infractor, apellido_materno_infractor, correo_infractor,
               fecha_limite_descuento`,
    [
      params.id, params.es_titular ?? null,
      params.nombre_titular, params.appaterno_titular, params.apmaterno_titular,
      params.curp_titular, params.correo_titular,
      params.nombre_infractor, params.appaterno_infractor, params.apmaterno_infractor,
      params.curp_infractor, params.correo_infractor,
    ],
  )
  return result.rows[0] ?? null
}

export async function actualizarEstatusPendientePagoInfraccion(id: string) {
  await query(
    `UPDATE via.v2_infracciones SET estatus = 'PENDIENTE_PAGO', estatus_dependencia = 'PENDIENTE_PAGO_INFRACCION', updated_at = NOW() WHERE id = $1`,
    [id],
  )
}

export async function marcarPlacaRetenidaEnTransito(id: string): Promise<Record<string, unknown> | null> {
  const result = await query<Record<string, unknown>>(
    `UPDATE via.v2_infracciones
     SET estatus = 'PENDIENTE_PAGO',
         estatus_dependencia = 'PLACA_RETENIDA_EN_TRANSITO',
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, folio, estatus, estatus_dependencia`,
    [id],
  )
  return result.rows[0] ?? null
}

export async function liberarInfraccionInstante(infraccionId: string) {
  await query(
    `UPDATE via.v2_infracciones
     SET estatus = 'CERRADA', estatus_dependencia = 'LIBERADO_INFRACCIONES_INSTANTE', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [infraccionId],
  )
}

export async function marcarGarantiaEntregada(id: string) {
  await query(
    `UPDATE via.v2_infracciones
     SET estatus = 'FINALIZADA', estatus_dependencia = 'GARANTIA_ENTREGADA', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [id],
  )
}

/* ─── Solicitudes / documentos de liberación ─── */

export async function insertarDocumentoLiberacion(params: {
  id: string
  solicitudId: string
  tipoDocumento: string
  urlDocumento: string
}) {
  await query(
    `INSERT INTO via.v2_documentos_liberacion (id, solicitud_id, tipo_documento, url_documento, estatus_revision)
     VALUES ($1, $2, $3, $4, 'ENVIADO')`,
    [params.id, params.solicitudId, params.tipoDocumento, params.urlDocumento],
  )
}

export async function insertarSolicitudLiberacion(params: {
  id: string
  infraccionId: string
  tipoLiberacion: string | null
  esEmpresa: boolean
  nombreEmpresa: string | null
  rfcEmpresa: string | null
  nombreRespFiscal: string | null
  appaternoRespFiscal: string | null
  apmaternoRespFiscal: string | null
}): Promise<string> {
  const result = await query<{ id: string }>(
    `INSERT INTO via.v2_solicitudes_liberacion (id, infraccion_id, tipo_liberacion, es_empresa, nombre_empresa, rfc_empresa, nombre_resp_fiscal, appaterno_resp_fiscal, apmaterno_resp_fiscal, estatus)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'EN_PROCESO_LIBERACIONES')
     RETURNING id`,
    [
      params.id, params.infraccionId, params.tipoLiberacion,
      params.esEmpresa, params.nombreEmpresa, params.rfcEmpresa,
      params.nombreRespFiscal, params.appaternoRespFiscal, params.apmaternoRespFiscal,
    ],
  )
  return result.rows[0].id
}

export async function actualizarEstatusSolicitudLiberacion(infraccionId: string) {
  await query(
    `UPDATE via.v2_solicitudes_liberacion SET estatus = 'EN_PROCESO_LIBERACIONES', updated_at = CURRENT_TIMESTAMP WHERE infraccion_id = $1`,
    [infraccionId],
  )
}

export async function actualizarEstatusDependenciaMesaControl(infraccionId: string) {
  await query(
    `UPDATE via.v2_infracciones SET estatus_dependencia = 'MESA_DE_CONTROL_REVISION', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [infraccionId],
  )
}

/* ─── Exp. digital — documentos / evidencias ─── */

export async function actualizarUrlsDocumentosInfraccion(id: string, urls: {
  ine: string | null
  inapam: string | null
  tarjetaCirculacion: string | null
}) {
  await query(
    `UPDATE via.v2_infracciones
     SET url_ine = COALESCE($2, url_ine),
         url_inapam = COALESCE($3, url_inapam),
         url_tarjeta_circulacion = COALESCE($4, url_tarjeta_circulacion),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [id, urls.ine, urls.inapam, urls.tarjetaCirculacion],
  )
}

export async function actualizarEvidenciasInfraccion(id: string, evidencias: string[]) {
  await query(
    `UPDATE via.v2_infracciones
     SET evidencias = $1::jsonb,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [JSON.stringify(evidencias), id],
  )
}
