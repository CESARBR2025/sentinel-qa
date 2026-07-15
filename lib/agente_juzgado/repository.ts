import pool, { query } from "@/lib/db";
import { rowToAsegurado } from "@/lib/fiscalia/mapper";
import type {
  DetalleAsegurado,
  DatosAseguradoInput,
  EvidenciaMonitorista,
  LiberacionRow,
} from "./types";
import type { AseguradoRow } from "@/lib/fiscalia/types";

export async function obtenerSolicitudesRecepcionadas() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rd.estado_tramite = 'EN_ANALISIS'
       AND rd.estado_evidencia = 'EVIDENCIA_ENVIADA'
     ORDER BY rd.updated_at DESC`,
  );
  return result.rows;
}

export async function obtenerSolicitudesEnRevision() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rd.estado_tramite = 'EN_REVISION_JUZGADO'
       AND rd.estado_evidencia = 'SIN_SOLICITUD'
     ORDER BY rd.updated_at DESC`,
  );
  return result.rows;
}

export async function obtenerSolicitudesConMonitorista() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rd.estado_tramite = 'EN_REVISION_JUZGADO'
       AND rd.estado_evidencia = 'PENDIENTE_MONITORISTA'
     ORDER BY rd.updated_at DESC`,
  );
  return result.rows;
}

export async function obtenerSolicitudesCompletadas() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rd.estado_tramite = 'EN_REVISION_JUZGADO'
       AND (rd.estado_evidencia = 'EVIDENCIA_ENVIADA' OR rd.estado_evidencia = 'SIN_EVIDENCIA_REQUERIDA')
     ORDER BY rd.updated_at DESC`,
  );
  return result.rows;
}

export async function obtenerSolicitudesCerradas() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rd.estado_tramite = 'CERRADO'
     ORDER BY rd.updated_at DESC`,
  );
  return result.rows;
}

export async function actualizarEstadoSolicitud(
  id: string,
  estadoTramite: string,
  estadoEvidencia?: string,
) {
  if (estadoEvidencia) {
    await query(
      `UPDATE ofi_reporte_denuncia
       SET estado_tramite = $1, estado_evidencia = $2, updated_at = NOW()
       WHERE id = $3`,
      [estadoTramite, estadoEvidencia, id],
    );
  } else {
    await query(
      `UPDATE ofi_reporte_denuncia
       SET estado_tramite = $1, updated_at = NOW()
       WHERE id = $2`,
      [estadoTramite, id],
    );
  }
}

export async function actualizarSolicitudConEvidencias(
  id: string,
  estadoTramite: string,
  estadoEvidencia: string,
  evidenciasJson: string,
) {
  await query(
    `UPDATE ofi_reporte_denuncia
     SET estado_tramite = $1, estado_evidencia = $2,
         monitorista_fechas_requeridas = $3::jsonb, updated_at = NOW()
     WHERE id = $4`,
    [estadoTramite, estadoEvidencia, evidenciasJson, id],
  );
}

export async function actualizarDetallesAsegurado(
  id: string,
  datos: DatosAseguradoInput,
  evidenciasJson?: string | null,
): Promise<void> {
  const estadoEvidencia = evidenciasJson
    ? "PENDIENTE_MONITORISTA"
    : "SIN_EVIDENCIA_REQUERIDA";

  await query(
    `UPDATE ofi_reporte_denuncia
     SET folio_sija = $1,
         domicilio_calle = $2,
         domicilio_numero = $3,
         domicilio_colonia = $4,
         domicilio_municipio = $5,
         folio_remision = $6,
         marco_legal = $7,
         registro_tableta = $8::boolean,
         estado_tramite = 'EN_REVISION_JUZGADO',
         estado_evidencia = $9,
         monitorista_fechas_requeridas = $10::jsonb,
         updated_at = NOW()
     WHERE id = $11`,
    [
      datos.folioSija || null,
      datos.calle || null,
      datos.numero || null,
      datos.colonia || null,
      datos.municipio || null,
      datos.folioRemision || null,
      datos.marcoLegal || null,
      datos.registroTableta || "false",
      estadoEvidencia,
      evidenciasJson ?? null,
      id,
    ],
  );
}

export async function obtenerEvidenciasMonitorista(
  denunciaId: string,
): Promise<EvidenciaMonitorista[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, url_archivo, nombre_archivo
     FROM moni_evidencias_denuncia
     WHERE ofi_reporte_denuncia_id = $1
     ORDER BY id`,
    [denunciaId],
  );
  return result.rows.map((r) => ({
    id: Number(r.id),
    urlArchivo: String(r.url_archivo ?? ""),
    nombreArchivo: r.nombre_archivo ? String(r.nombre_archivo) : null,
  }));
}

export async function obtenerDetalleAsegurado(
  solicitudId: string,
): Promise<DetalleAsegurado | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       rd.folio_denuncia,
       rc.folio_reporte_campo,
       rd.iph,
       rd.fecha_reporte,
       rd.hora_reporte,
       rc.ofi_detenidos,
       p.numero_unidad AS ofi_placa_unidad_asignada,
       ou.name AS ofi_nombre,
       ou.apellido AS ofi_ap_paterno,
       o.no_nomina,
       rc.ofi_calle,
       rc.ofi_colonia,
       u.name AS capturado_por_nombre,
       rd.folio_sija,
       rd.folio_remision,
       rd.marco_legal,
       rd.registro_tableta,
       rd.domicilio_calle,
       rd.domicilio_numero,
       rd.domicilio_colonia,
       rd.domicilio_municipio
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     LEFT JOIN ofi_oficiales o ON rc.ofi_oficial_id = o.id
     LEFT JOIN users ou ON ou.id = o.user_id
     LEFT JOIN via.v2_patrullas p ON p.id = o.patrulla_id
     LEFT JOIN users u ON rd.capturado_por = u.id
     WHERE rd.id = $1
     LIMIT 1`,
    [solicitudId],
  );

  if (!result.rows.length) return null;

  const row = result.rows[0];

  let nombreDetenido: string | null = null;
  try {
    const detenidos =
      typeof row.ofi_detenidos === "string"
        ? JSON.parse(row.ofi_detenidos)
        : row.ofi_detenidos;
    if (Array.isArray(detenidos) && detenidos.length > 0) {
      nombreDetenido = detenidos[0]?.nombre ?? null;
    }
  } catch {
    /* ignore parse errors */
  }

  const calle = row.ofi_calle ? String(row.ofi_calle) : "";
  const colonia = row.ofi_colonia ? String(row.ofi_colonia) : "";
  const lugarDetencion = [calle, colonia].filter(Boolean).join(", ") || null;

  const ofiNombre = row.ofi_nombre ? String(row.ofi_nombre) : "";
  const ofiApPaterno = row.ofi_ap_paterno ? String(row.ofi_ap_paterno) : "";
  const nombrePolicia =
    [ofiNombre, ofiApPaterno].filter(Boolean).join(" ") || null;

  return {
    folioDenuncia: row.folio_denuncia ? String(row.folio_denuncia) : null,
    folioReporteCampo: row.folio_reporte_campo
      ? String(row.folio_reporte_campo)
      : null,
    iph: row.iph ? String(row.iph) : null,
    fechaReporte: row.fecha_reporte ? String(row.fecha_reporte) : null,
    horaReporte: row.hora_reporte ? String(row.hora_reporte) : null,
    nombreDetenido,
    placaUnidad: row.ofi_placa_unidad_asignada
      ? String(row.ofi_placa_unidad_asignada)
      : null,
    nombrePolicia,
    nominaPolicia: row.no_nomina ? String(row.no_nomina) : null,
    lugarDetencion,
    capturadoPorNombre: row.capturado_por_nombre
      ? String(row.capturado_por_nombre)
      : null,
    folioSija: row.folio_sija ? String(row.folio_sija) : null,
    folioRemision: row.folio_remision ? String(row.folio_remision) : null,
    marcoLegal: row.marco_legal ? String(row.marco_legal) : null,
    registroTableta: row.registro_tableta ? String(row.registro_tableta) : null,
    domicilioCalle: row.domicilio_calle ? String(row.domicilio_calle) : null,
    domicilioNumero: row.domicilio_numero ? String(row.domicilio_numero) : null,
    domicilioColonia: row.domicilio_colonia
      ? String(row.domicilio_colonia)
      : null,
    domicilioMunicipio: row.domicilio_municipio
      ? String(row.domicilio_municipio)
      : null,
  };
}

/* ═══════════════════════════════════════
   LIBERACIONES
   ═══════════════════════════════════════ */

export async function listarLiberacionesJuzgado(): Promise<LiberacionRow[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       id,
       folio,
       estatus,
       placa,
       created_at,
       correo_infractor,
       nombre_infractor,
       estatus_dependencia,
       no_carpeta_investigacion
     FROM via.v2_infracciones
     WHERE tipo_garantia = 'VEHICULO'
       AND estatus_dependencia IN (
         'RETENIDO_POR_ACCIDENTE_PENDIENTE_OFICIO',
         'RETENIDO_POR_DELITO_PENDIENTE_OFICIO',
         'MESA_DE_CONTROL_PENDIENTE_DOCS',
         'LIBERADA_POR_ACCIDENTE',
         'LIBERADA_POR_DELITO'
       )
       AND dependencia_receptora = $1
     ORDER BY created_at DESC`,
    ["JUZGADO"],
  );

  return result.rows.map((r) => ({
    id: String(r.id ?? ""),
    folio: String(r.folio ?? ""),
    estatus: String(r.estatus ?? ""),
    placa: String(r.placa ?? ""),
    created_at: String(r.created_at ?? ""),
    correo_infractor: String(r.correo_infractor ?? ""),
    nombre_infractor: String(r.nombre_infractor ?? ""),
    estatus_dependencia: String(r.estatus_dependencia ?? ""),
    no_carpeta_investigacion: String(r.no_carpeta_investigacion ?? ""),
  }));
}

export async function obtenerDetalleInfraccionViaJuzgado(
  id: string,
): Promise<Record<string, unknown> | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       i.evidencias,
       i.url_inapam,
       i.url_ine,
       i.url_tarjeta_circulacion,
       i.id,
       i.folio,
       i.estatus,
       i.created_at,
       i.articulo_id,
       a.numero as articulo_numero,
       a.descripcion as articulo_descripcion,
       i.fraccion_id,
       f.numero as fraccion_numero,
       f.descripcion as fraccion_descripcion,
       i.nombre_infractor,
       i.apellido_paterno_infractor,
       i.apellido_materno_infractor,
       i.curp_infractor,
       i.nombre_titular_liberacion,
       i.appaterno_titular_liberacion,
       i.apmaterno_titular_liberacion,
       i.marca,
       i.modelo,
       i.color,
       i.placa,
       i.correo_infractor,
       i.latitud,
       i.longitud,
       i.codigo_postal,
       i.calle,
       i.numero,
       i.municipio,
       i.estado,
       i.tipo_garantia,
       i.garantia_entregada,
        o.total_umas,
        o.total_pesos,
        CASE WHEN o.id IS NOT NULL THEN true ELSE false END as tiene_orden_pago,
        i.oficial_id,
       i.es_titular,
       i.no_oficio_fiscalia,
       i.url_oficio_fiscalia,
       i.estatus_dependencia,
       i.no_carpeta_investigacion,
       i.url_oficio_pago_corralon,
       i.url_orden_salida_liberaciones,
       o.estatus as estatus_orden_pago,
        off.no_nomina as oficial_numero_empleado,
        u.name as oficial_nombres,
        u.apellido as oficial_apellido_p,
        '' as oficial_apellido_m,
        pat.numero_unidad as patrulla_nombre,
        CASE WHEN off.ofi_estatus = 'activo' THEN true ELSE false END as oficial_activo
      FROM via.v2_infracciones i
      LEFT JOIN via.v2_ordenes_pago_sa7 o ON o.infraccion_id = i.id
      JOIN via.v2_articulos_ley a on i.articulo_id = a.id
      JOIN via.v2_fracciones_ley f on i.fraccion_id = f.id
      LEFT JOIN ofi_oficiales off ON off.id = i.oficial_id
      LEFT JOIN users u ON u.id = off.user_id
      LEFT JOIN via.v2_patrullas pat ON off.patrulla_id = pat.id
     WHERE i.id = $1
     ORDER BY o.created_at DESC
     LIMIT 1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function iniciarProcesoJuzgado(id: string): Promise<void> {
  await query(
    `UPDATE via.v2_infracciones
     SET estatus_dependencia = 'EN_PROCESO_JUZGADO', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [id],
  );
}

export async function finalizarProcesoJuzgado(id: string): Promise<void> {
  await query(
    `UPDATE via.v2_infracciones
     SET estatus_dependencia = 'LIBERADA_POR_JUZGADO', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [id],
  );
}

export async function actualizarOficioJuzgado(
  id: string,
  numeroOficio: string,
  urlOficio: string | null,
  noCarpeta: string | null,
  datosInfractor: {
    nombre_infractor?: string | null;
    appaterno_infractor?: string | null;
    apmaterno_infractor?: string | null;
    correo_infractor?: string | null;
    curp_infractor?: string | null;
  },
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `UPDATE via.v2_infracciones
       SET
         no_oficio_fiscalia = $2,
         url_oficio_fiscalia = COALESCE($3, url_oficio_fiscalia),
         no_carpeta_investigacion = COALESCE($4, no_carpeta_investigacion),
         estatus = 'REGISTRADA',
         estatus_dependencia = 'MESA_DE_CONTROL_PENDIENTE_DOCS',
         nombre_infractor = COALESCE($5, nombre_infractor),
         apellido_paterno_infractor = COALESCE($6, apellido_paterno_infractor),
         apellido_materno_infractor = COALESCE($7, apellido_materno_infractor),
         correo_infractor = COALESCE($8, correo_infractor),
         curp_infractor = COALESCE($9, curp_infractor),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [
        id,
        numeroOficio,
        urlOficio,
        noCarpeta,
        datosInfractor.nombre_infractor || null,
        datosInfractor.appaterno_infractor || null,
        datosInfractor.apmaterno_infractor || null,
        datosInfractor.correo_infractor || null,
        datosInfractor.curp_infractor || null,
      ],
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export async function listarAseguradosJuzgado(): Promise<AseguradoRow[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       rc.id,
       rc.folio_reporte_campo,
       rd.folio_denuncia,
       rc.created_at,
       rc.ofi_detenidos,
       rc.folio_reporte_asegurados,
       CONCAT(ou.name, ' ', ou.apellido) AS ofi_oficial_nombre,
       p.numero_unidad AS ofi_placa_unidad_asignada
      FROM ofi_reportes_campo rc
      JOIN ofi_reporte_denuncia rd ON rd.reporte_campo_id = rc.id
      LEFT JOIN ofi_oficiales o ON rc.ofi_oficial_id = o.id
      LEFT JOIN users ou ON ou.id = o.user_id
      LEFT JOIN via.v2_patrullas p ON p.id = o.patrulla_id
      WHERE rc.ofi_hay_detencion = true
        AND rc.ofi_autoridad_recibe = 'JUZGADO CIVICO'
        AND rc.folio_reporte_asegurados IS NULL
      ORDER BY rc.created_at DESC`,
  );
  return result.rows.map(rowToAsegurado);
}
