import pool, { query } from "@/lib/db";
import { ValidationError, NotFoundError } from "@/lib/error-handler";
import {
  rowToOficial,
  rowToReporteResumen,
  rowToReporteDetalle,
  rowToDespachoAsignado,
  rowToDespachoAtendido,
  rowToRondinOficialResumen,
  rowToReporteCampoParaD1,
} from "./mapper";
import type {
  OfiOficial,
  CrearReporteCampoInput,
  OfiReporteResumen,
  OfiReporteDetalle,
  CatalogoItem,
  DespachoAsignado,
  DespachoAtendido,
  RondinOficialResumen,
  ReporteCampoParaD1,
} from "./types";

export async function obtenerOficialPorUserId(
  userId: string,
): Promise<OfiOficial | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT o.*, u.name AS ofi_nombre, u.apellido AS ofi_ap_paterno, d.nombre AS departamento_nombre
     FROM ofi_oficiales o
     LEFT JOIN users u ON u.id = o.user_id
     LEFT JOIN via.v2_departamentos d ON d.id = o.departamento_id
     WHERE o.user_id = $1 AND o.ofi_estatus = 'activo'
     LIMIT 1`,
    [userId],
  );
  return result.rows.length ? rowToOficial(result.rows[0]) : null;
}

export async function verificarFolioExiste(folio: string): Promise<boolean> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM ofi_reportes_campo WHERE folio_reporte_campo = $1`,
    [folio],
  );
  return parseInt(result.rows[0].count, 10) > 0;
}

export async function insertarReporteCampo(
  data: CrearReporteCampoInput,
): Promise<string> {
  const cliente = await pool.connect();
  try {
    await cliente.query("BEGIN");

    // Reporte vinculado a solicitud de despacho: validar y cerrar en la misma transacción
    if (data.incidenteId) {
      const inc = await cliente.query<{ estatus: string }>(
        `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1 FOR UPDATE`,
        [data.incidenteId],
      );
      if (!inc.rows[0]) throw new NotFoundError("Incidente no encontrado");
      if (inc.rows[0].estatus !== "en_despacho" && inc.rows[0].estatus !== "en_sitio")
        throw new ValidationError("El incidente debe estar en_despacho o en_sitio para cerrar");

      const existe = await cliente.query<{ id: string }>(
        `SELECT id FROM ofi_reportes_campo WHERE incidente_id = $1 LIMIT 1`,
        [data.incidenteId],
      );
      if (existe.rows[0])
        throw new ValidationError("El incidente ya tiene un reporte de campo de cierre");
    }

    const result = await cliente.query<{ id: string }>(
      `INSERT INTO ofi_reportes_campo (
    incidente_id,
    folio_reporte_campo,
    ofi_folio_cad, ofi_nombre_reportante, ofi_anonimo,
    ofi_tipo_incidente, ofi_tipo_emergencia, ofi_prioridad,
    ofi_descripcion, ofi_contenido_reporte,
    ofi_calle, ofi_colonia, ofi_entre_calles, ofi_referencia, ofi_latitud, ofi_longitud,
    ofi_datos_pn, ofi_acciones,
    ofi_hay_detencion, ofi_detenidos, ofi_autoridad_recibe, expediente_ci, personal_ingreso_ci,
    ofi_monto_robo, ofi_hay_robo,
    ofi_objetos_recuperados, ofi_hay_vehiculo, ofi_vehiculos,
    ofi_hay_cateo, ofi_cateo, ofi_resultado_cateo,
    ofi_oficial_id,
    quiere_denuncia,
    ofi_hay_orden_aprehension, ofi_ordenes_aprehension,
    ofi_hay_hidrocarburo,      ofi_hidrocarburos,
    ofi_hay_arma_fuego,        ofi_armas_fuego,
    ofi_hay_droga,             ofi_drogas,
    ofi_telefono_reportante, ofi_observaciones,
    ofi_apoyo_fiestas_patronales, ofi_operativos_metropolitano, ofi_eco8,
    ofi_alcoholimetria, ofi_motocicletas, ofi_apoyo_actuarios,
    ofi_apoyo_cateos_fgr, ofi_apoyo_cateos_fge
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15, $16, $17, $18, $19, $20::jsonb,
    $21, $22, $23, $24, $25, $26, $27, $28::jsonb,
    $29, $30::jsonb, $31,
    $32, $33, $34, $35::jsonb, $36, $37::jsonb, $38, $39::jsonb, $40, $41::jsonb, $42, $43,
    $44, $45, $46, $47, $48, $49, $50, $51
  ) RETURNING id`,
      [
        data.incidenteId,
        data.folioReporteCampo,
        data.ofiFolioCad,
        data.ofiNombreReportante,
        data.ofiAnonimo,
        data.ofiTipoIncidente,
        data.ofiTipoEmergencia,
        data.ofiPrioridad,
        data.ofiDescripcion,
        data.ofiContenidoReporte,
        data.ofiCalle,
        data.ofiColonia,
        data.ofiEntreCalles,
        data.ofiReferencia,
        data.ofiLatitud,
        data.ofiLongitud,
        data.ofiDatosPn,
        data.ofiAcciones,
        data.ofiHayDetencion,
        JSON.stringify(data.ofiDetenidos),
        data.ofiAutoridadRecibe,
        data.expedienteCi,
        data.personalIngresoCi,
        data.ofiMontoRobo,
        data.ofiHayRobo,
        data.ofiObjetosRecuperados,
        data.ofiHayVehiculo,
        JSON.stringify(data.ofiVehiculos),
        data.ofiHayCateo,
        data.ofiCateo ? JSON.stringify(data.ofiCateo) : null,
        data.ofiResultadoCateo,
        data.ofiOficialId,
        data.ofiQuiereDenuncia,
        data.ofiHayOrdenAprehension,
        JSON.stringify(data.ofiOrdenesAprehension),
        data.ofiHayHidrocarburo,
        JSON.stringify(data.ofiHidrocarburos),
        data.ofiHayArmaFuego,
        JSON.stringify(data.ofiArmasFuego),
        data.ofiHayDroga,
        JSON.stringify(data.ofiDrogas),
        data.ofiTelefonoReportante,
        data.ofiObservaciones,
        data.ofiApoyoFiestasPatronales,
        data.ofiOperativosMetropolitano,
        data.ofiEco8,
        data.ofiAlcoholimetria,
        data.ofiMotocicletas,
        data.ofiApoyoActuarios,
        data.ofiApoyoCateosFgr,
        data.ofiApoyoCateosFge,
      ],
    );

    if (data.incidenteId) {
      const nuevoEstatus = data.ofiHayDetencion ? 'cerrado_detencion' : 'atendido'
      await cliente.query(
        `UPDATE incidentes SET estatus = $1, actualizado_en = NOW() WHERE id = $2 AND estatus IN ('en_despacho', 'en_sitio')`,
        [nuevoEstatus, data.incidenteId],
      );

      // Red de seguridad de la Regla 3 (form-003): garantizar hora_salida por unidad al cerrar,
      // por si el oficial cerró directo desde en_despacho sin pasar por "Marcar en Sitio".
      await cliente.query(
        `UPDATE incidente_despacho_unidades du
         SET hora_salida = COALESCE(du.hora_salida, d.fecha_hora_despacho)
         FROM incidente_despacho d
         WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
        [data.incidenteId],
      );
    }

    await cliente.query("COMMIT");
    return result.rows[0].id;
  } catch (err) {
    await cliente.query("ROLLBACK");
    throw err;
  } finally {
    cliente.release();
  }
}

export interface CierreReporteCampoRow {
  reporteCampoId: string
  folioReporteCampo: string | null
  acciones: string | null
  hayDetencion: boolean
  autoridadRecibe: string | null
  oficialNombre: string | null
  fechaCierre: string
  d1Folio: string | null
  d1EstadoTramite: string | null
  d1FechaCreacion: string | null
}

export async function obtenerCierrePorIncidente(
  incidenteId: string,
): Promise<CierreReporteCampoRow | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       r.id AS reporte_campo_id,
       r.folio_reporte_campo,
       r.ofi_acciones,
       r.ofi_hay_detencion,
       r.ofi_autoridad_recibe,
       r.created_at,
       TRIM(CONCAT(u.name, ' ', COALESCE(u.apellido, ''))) AS oficial_nombre,
       d.folio_denuncia AS d1_folio,
       d.estado_tramite AS d1_estado_tramite,
       d.created_at AS d1_created_at
     FROM ofi_reportes_campo r
     LEFT JOIN ofi_oficiales o ON o.id = r.ofi_oficial_id
     LEFT JOIN users u ON u.id = o.user_id
     LEFT JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = r.id
     WHERE r.incidente_id = $1
     LIMIT 1`,
    [incidenteId],
  );
  const row = result.rows[0];
  if (!row) return null;
  const toIso = (v: unknown) => (v instanceof Date ? v.toISOString() : v ? String(v) : null);
  return {
    reporteCampoId: String(row.reporte_campo_id ?? ""),
    folioReporteCampo: (row.folio_reporte_campo as string) ?? null,
    acciones: (row.ofi_acciones as string) ?? null,
    hayDetencion: Boolean(row.ofi_hay_detencion),
    autoridadRecibe: (row.ofi_autoridad_recibe as string) ?? null,
    oficialNombre: (row.oficial_nombre as string) || null,
    fechaCierre: toIso(row.created_at) ?? "",
    d1Folio: (row.d1_folio as string) ?? null,
    d1EstadoTramite: (row.d1_estado_tramite as string) ?? null,
    d1FechaCreacion: toIso(row.d1_created_at),
  };
}

export async function obtenerDespachosAsignados(
  userId: string,
): Promise<DespachoAsignado[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       i.id AS incidente_id, i.folio, i.canal, i.estatus, i.descripcion,
       i.calle, i.colonia, i.entre_calles, i.referencia_ubicacion,
       i.fecha_hora_inicio,
       cti.nombre AS tipo_incidente_nombre,
       cp.nombre AS prioridad_nombre,
       d.fecha_hora_despacho,
       u.name AS despachador_nombre,
       COALESCE(
         (SELECT array_agg(du.unidad_placa) FROM incidente_despacho_unidades du WHERE du.despacho_id = d.id),
         '{}'
       ) AS unidades
     FROM incidente_despacho_elementos de
     JOIN incidente_despacho d ON d.id = de.despacho_id
     JOIN incidentes i ON i.id = d.incidente_id
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
     LEFT JOIN users u ON d.despachado_por = u.id
       WHERE de.oficial_id = (SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1)
         AND i.estatus IN ('en_despacho', 'en_sitio')
         AND NOT EXISTS (SELECT 1 FROM ofi_reportes_campo WHERE incidente_id = i.id)
       ORDER BY cp.orden NULLS LAST, d.fecha_hora_despacho DESC`,
    [userId],
  );
  return result.rows.map(rowToDespachoAsignado);
}

export async function contarDespachosAsignados(userId: string): Promise<number> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count
     FROM incidente_despacho_elementos de
     JOIN incidente_despacho d ON d.id = de.despacho_id
     JOIN incidentes i ON i.id = d.incidente_id
       WHERE de.oficial_id = (SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1)
         AND i.estatus IN ('en_despacho', 'en_sitio')
         AND NOT EXISTS (SELECT 1 FROM ofi_reportes_campo WHERE incidente_id = i.id)`,
    [userId],
  );
  return parseInt(result.rows[0].count, 10);
}

export async function obtenerDespachosAtendidos(
  userId: string,
): Promise<DespachoAtendido[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       i.id AS incidente_id, i.folio, i.canal, i.estatus, i.descripcion,
       i.calle, i.colonia, i.entre_calles, i.referencia_ubicacion,
       i.fecha_hora_inicio,
       cti.nombre AS tipo_incidente_nombre,
       cp.nombre AS prioridad_nombre,
       d.fecha_hora_despacho,
       u.name AS despachador_nombre,
       COALESCE(
         (SELECT array_agg(du.unidad_placa) FROM incidente_despacho_unidades du WHERE du.despacho_id = d.id),
         '{}'
       ) AS unidades,
       rc.id AS reporte_campo_id,
       rc.folio_reporte_campo,
       rc.created_at AS fecha_cierre,
       rc.ofi_hay_detencion,
       rc.ofi_acciones,
       rc.quiere_denuncia,
       d1.id AS d1_id,
       d1.folio_denuncia AS d1_folio
     FROM incidente_despacho_elementos de
     JOIN incidente_despacho d ON d.id = de.despacho_id
     JOIN incidentes i ON i.id = d.incidente_id
     JOIN ofi_reportes_campo rc ON rc.incidente_id = i.id
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     LEFT JOIN cat_prioridades cp ON i.prioridad_id = cp.id
     LEFT JOIN users u ON d.despachado_por = u.id
     LEFT JOIN ofi_reporte_denuncia d1 ON d1.reporte_campo_id = rc.id
       WHERE de.oficial_id = (SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1)
         AND i.estatus IN ('atendido', 'cerrado_detencion')
       ORDER BY rc.created_at DESC`,
    [userId],
  );
  return result.rows.map(rowToDespachoAtendido);
}

export async function contarDespachosAtendidos(userId: string): Promise<number> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count
     FROM incidente_despacho_elementos de
     JOIN incidente_despacho d ON d.id = de.despacho_id
     JOIN incidentes i ON i.id = d.incidente_id
     JOIN ofi_reportes_campo rc ON rc.incidente_id = i.id
       WHERE de.oficial_id = (SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1)
         AND i.estatus IN ('atendido', 'cerrado_detencion')`,
    [userId],
  );
  return parseInt(result.rows[0].count, 10);
}

export async function obtenerCatalogoIncidentes(): Promise<CatalogoItem[]> {
  const result = await query<CatalogoItem>(
    `SELECT id, nombre FROM cat_tipos_incidente WHERE activo = true ORDER BY nombre`,
  );
  return result.rows;
}

export async function obtenerCatalogoEmergencias(): Promise<CatalogoItem[]> {
  const result = await query<CatalogoItem>(
    `SELECT id, nombre FROM cat_tipos_emergencia WHERE activo = true ORDER BY nombre`,
  );
  return result.rows;
}

export async function obtenerCatalogoPrioridades(): Promise<CatalogoItem[]> {
  const result = await query<CatalogoItem>(
    `SELECT id, nombre FROM cat_prioridades WHERE activo = true ORDER BY orden`,
  );
  return result.rows;
}

export async function obtenerCatalogoCanalizaciones(): Promise<CatalogoItem[]> {
  const result = await query<CatalogoItem>(
    `SELECT id, nombre FROM cat_medios_canalizacion WHERE activo = true ORDER BY nombre`,
  );
  return result.rows;
}

export async function contarDenunciasPendientes(
  userId: string,
): Promise<number> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count
     FROM ofi_reportes_campo r
     LEFT JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = r.id
     WHERE r.ofi_oficial_id = (
       SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1
     )
     AND r.quiere_denuncia = true
     AND d.id IS NULL`,
    [userId],
  );
  return parseInt(result.rows[0].count, 10);
}

export async function obtenerReportesOficial(
  userId: string,
): Promise<OfiReporteResumen[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       r.id,
       r.folio_reporte_campo,
       r.ofi_folio_cad,
       r.ofi_tipo_incidente,
       r.ofi_calle,
       r.ofi_colonia,
       r.ofi_latitud,
       r.ofi_longitud,
       r.quiere_denuncia,
       r.ofi_hay_detencion,
       r.created_at,
       d.id           AS d1_id,
       d.folio_denuncia AS d1_folio
     FROM ofi_reportes_campo r
     LEFT JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = r.id
     WHERE r.ofi_oficial_id = (
       SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1
     )
     ORDER BY r.created_at DESC
     LIMIT 50`,
    [userId],
  );
  return result.rows.map(rowToReporteResumen);
}

export async function obtenerReporteDetalle(
  id: string,
  userId: string,
): Promise<OfiReporteDetalle | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       r.*,
       r.quiere_denuncia,
       CONCAT(u.name, ' ', u.apellido) AS ofi_oficial_nombre,
       d.id                  AS d1_id,
       d.folio_denuncia      AS d1_folio,
       d.iph                 AS d1_iph,
       d.folio_cu            AS d1_folio_cu,
       d.fecha_reporte       AS d1_fecha_reporte,
       d.hora_reporte        AS d1_hora_reporte,
       d.tipo_evento         AS d1_tipo_evento,
       d.delito              AS d1_delito,
       d.violencia           AS d1_violencia,
       d.lugar_hecho         AS d1_lugar_hecho,
       d.colonia_hecho       AS d1_colonia_hecho,
       d.latitud             AS d1_latitud,
       d.longitud            AS d1_longitud,
       d.policia_a_cargo     AS d1_policia_cargo,
       d.se_genero_d1        AS d1_se_genero,
       d.observaciones       AS d1_observaciones,
       d.ofendido_hombre     AS d1_ofendido_hombre,
       d.ofendido_mujer      AS d1_ofendido_mujer
     FROM ofi_reportes_campo r
     LEFT JOIN ofi_oficiales o ON o.id = r.ofi_oficial_id
     LEFT JOIN users u ON u.id = o.user_id
     LEFT JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = r.id
     WHERE r.id = $1::uuid
       AND r.ofi_oficial_id = (
         SELECT id FROM ofi_oficiales WHERE user_id = $2 LIMIT 1
       )
     LIMIT 1`,
    [id, userId],
  );
  return result.rows.length ? rowToReporteDetalle(result.rows[0]) : null;
}

export async function obtenerReporteCampoSimple(id: string) {
  const result = await query<Record<string, unknown>>(
    `SELECT id, folio_reporte_campo, ofi_detenidos FROM ofi_reportes_campo WHERE id = $1`,
    [id],
  )
  return result.rows[0] ?? null
}

export async function obtenerPrellenado(id: string) {
  const result = await query<Record<string, unknown>>(
    `SELECT
      dd.calle                       AS "calleDetenido",
      dd.numero                      AS "numeroDetenido",
      dd.colonia                     AS "coloniaDetenido",
      dd.latitud                     AS "latitudDetenido",
      dd.longitud                    AS "longitudDetenido",
      rd.lugar_apoyo                 AS "calleArresto",
      rd.colonia_apoyo               AS "coloniaArresto",
      rd.sector                      AS "sectorArresto",
      rd.iph                         AS "folioIPH",
      rd.folio_denuncia              AS "folio911",
      rd.fecha_avistamiento          AS "fechaEvento",
      rd.fecha_reporte               AS "fechaReporte",
      rd.hora_reporte                AS "horaReporte",
      rd.hora_avistamiento           AS "horaInicioEvento",
      rd.hora_fin_denuncia           AS "horaFinalEvento",
      rc.delito                      AS "delito",
      rc.modus_operandi              AS "modusOperandi",
      rc.ofi_objetos_recuperados     AS "articulosObjetos",
      rd.lugar_hecho                 AS "calleHecho",
      rd.colonia_hecho               AS "coloniaHecho",
      rd.latitud                     AS "latitudHecho",
      rd.longitud                    AS "longitudHecho",
      rd.sector                      AS "sectorHecho",
      rd.crp                         AS "crpUnidad",
      rd.domicilio_calle             AS "calleAfectado",
      rd.domicilio_numero            AS "numeroAfectado",
      rd.domicilio_colonia           AS "coloniaAfectado",
      rd.domicilio_municipio         AS "municipioAfectado",
      rd.id AS "reporteDenunciaId"
    FROM ofi_reportes_campo rc
    INNER JOIN ofi_reporte_denuncia rd ON rd.reporte_campo_id = rc.id
    LEFT JOIN ofi_detalles_asegurados dd ON dd.reporte_campo_id = rc.id
    WHERE rc.id = $1
    LIMIT 1`,
    [id],
  )
  return result.rows[0] ?? null
}

export async function listarReportesCampo() {
  const result = await query<Record<string, unknown>>(
    `SELECT 
      rc.id, 
      rc.ofi_folio_cad AS "folio", 
      'N/D' AS "oficial",
      rc.created_at AS "fecha", 
      rc.delito AS "tipo_incidente",
      rd.folio_denuncia AS "folio_denuncia", 
      rc.ofi_calle AS "calle", 
      rc.ofi_colonia AS "colonia", 
      COALESCE(rc.ofi_hay_detencion, false) AS "tiene_iph",
      (rc.ofi_vehiculos IS NOT NULL AND rc.ofi_vehiculos::text <> '[]') AS "tiene_veh",
      (rc.ofi_objetos_recuperados IS NOT NULL AND rc.ofi_objetos_recuperados <> '') AS "tiene_obj"
    FROM ofi_reportes_campo rc
    LEFT JOIN ofi_reporte_denuncia rd ON rd.reporte_campo_id = rc.id
    ORDER BY rc.created_at DESC`,
  )
  return result.rows
}

export async function insertarDetallesAsegurados(
  reporteCampoId: string,
  detenidos: { nombre: string; apellidoPaterno: string; apellidoMaterno: string }[],
): Promise<void> {
  if (detenidos.length === 0) return
  for (const d of detenidos) {
    await query(
      `INSERT INTO ofi_detalles_asegurados
       (reporte_campo_id, nombre_detenido, ap_paterno_detenido, ap_materno_detenido)
       VALUES ($1, $2, $3, $4)`,
      [reporteCampoId, d.nombre, d.apellidoPaterno, d.apellidoMaterno],
    )
  }
}

export async function obtenerReporteCampoParaD1(reporteCampoId: string): Promise<ReporteCampoParaD1 | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       rc.id,
       rc.folio_reporte_campo,
       rc.ofi_tipo_incidente,
       rc.ofi_descripcion,
       rc.ofi_calle,
       rc.ofi_colonia,
       rc.ofi_latitud AS latitud,
       rc.ofi_longitud AS longitud,
       rc.ofi_autoridad_recibe,
       rc.created_at,
       CONCAT(u.name, ' ', COALESCE(u.apellido, '')) AS oficial_nombre,
       o.no_nomina AS oficial_nomina,
       i.fecha_hora_inicio AS incidente_fecha_hora_inicio,
       desp.fecha_hora_despacho AS despacho_fecha_hora_despacho
     FROM ofi_reportes_campo rc
     LEFT JOIN ofi_oficiales o ON o.id = rc.ofi_oficial_id
     LEFT JOIN users u ON u.id = o.user_id
     LEFT JOIN incidentes i ON i.id = rc.incidente_id
     LEFT JOIN incidente_despacho desp ON desp.incidente_id = rc.incidente_id
     WHERE rc.id = $1
     LIMIT 1`,
    [reporteCampoId],
  )
  return result.rows.length ? rowToReporteCampoParaD1(result.rows[0]) : null
}

export async function obtenerSectorOficial(oficialId: string): Promise<string | null> {
  const result = await query<{ sector: string | null }>(
    `SELECT d.nombre AS sector
     FROM ofi_oficiales o
     LEFT JOIN via.v2_departamentos d ON d.id = o.departamento_id
     WHERE o.id = $1
     LIMIT 1`,
    [oficialId],
  )
  return result.rows[0]?.sector ?? null
}

export async function obtenerRondinesOficial(userId: string): Promise<RondinOficialResumen[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       i.id, i.folio, i.fecha_hora_inicio, i.calle, i.colonia, i.estatus,
       cti.nombre AS tipo_incidente_nombre,
       desp.fecha_hora_despacho,
       CONCAT(u.name, ' ', COALESCE(u.apellido, '')) AS capturado_por_nombre
     FROM incidentes i
     JOIN incidente_despacho desp ON desp.incidente_id = i.id
     JOIN incidente_despacho_elementos de ON de.despacho_id = desp.id
     LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
     LEFT JOIN users u ON u.id = i.capturado_por
      WHERE i.origen_rondin = true
        AND de.oficial_id = (SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1)
      ORDER BY i.fecha_hora_inicio DESC
      LIMIT 50`,
    [userId],
  );
  return result.rows.map(rowToRondinOficialResumen);
}

export async function actualizarPatrullaOficial(
  userId: string,
  patrullaId: string | null,
): Promise<void> {
  await query(
    `UPDATE ofi_oficiales
     SET patrulla_id = $1
     WHERE user_id = $2`,
    [patrullaId, userId],
  );
}

export async function actualizarTelefonoOficial(
  userId: string,
  telefono: string,
): Promise<void> {
  await query(
    `UPDATE ofi_oficiales
     SET telefono = $1
     WHERE user_id = $2`,
    [telefono, userId],
  );
}

export async function telefonoExiste(
  telefono: string,
  userId: string,
): Promise<boolean> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count
     FROM ofi_oficiales
     WHERE telefono = $1
       AND user_id != $2
       AND telefono IS NOT NULL
       AND telefono != ''`,
    [telefono, userId],
  );
  return parseInt(result.rows[0].count, 10) > 0;
}
