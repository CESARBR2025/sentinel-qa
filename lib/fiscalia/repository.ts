import pool, { query } from "@/lib/db";
import type {
  RolRow,
  DetalleAsegurado,
  DatosAseguradoInput,
  EvidenciaMonitorista,
  LiberacionRow,
  DetenidoDireccionInput,
} from "./types";
import { rowToAsegurado, rowToDetalleDetenidoGuardado, rowToPuestaDisposicion } from "./mapper";
import type { AseguradoRow, DetalleDetenidoGuardado, PuestaDisposicionRow, PuestaDisposicionInput } from "./types";

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

export async function obtenerSolicitudesPendientes() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rc.ofi_autoridad_recibe = 'FISCALIA'
       AND rd.estado_tramite = 'RECIBIDA'
       AND rd.estado_evidencia = 'SIN_SOLICITUD'
     ORDER BY rd.created_at DESC`,
  );
  return result.rows;
}

[
  {
    calle: "Av de las garzas",
    numero: "1",
    colonia: "Centro",
    atendida: false,
    hora_fin: "12:20",
    hora_inicio: "12:00",
    solicitud_id: 1,
    fecha_peticion: "2026-06-26T18:20:50.864Z",
  },
  {
    calle: "Av de las garzas",
    numero: "2",
    colonia: "Centro",
    atendida: false,
    hora_fin: "13:20",
    hora_inicio: "12:20",
    solicitud_id: 2,
    fecha_peticion: "2026-06-26T18:20:50.864Z",
  },
];

[
  { solicitud_id: 1, colonia: "Centro", calle: "Av. Juárez", atendida: true },
  {
    solicitud_id: 2,
    colonia: "Zona Industrial",
    calle: "Eje Central",
    atendida: true,
  },
];
export async function obtenerSolicitudesEnProceso() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rc.ofi_autoridad_recibe = 'FISCALIA'
       AND rd.estado_tramite = 'EN_ANALISIS'
       AND rd.estado_evidencia = 'SIN_SOLICITUD'
     ORDER BY rd.created_at DESC`,
  );
  return result.rows;
}

export async function obtenerSolicitudesConMonitorista() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rc.ofi_autoridad_recibe = 'FISCALIA'
       AND rd.estado_tramite = 'EN_ANALISIS'
       AND rd.estado_evidencia = 'PENDIENTE_MONITORISTA'
     ORDER BY rd.created_at DESC`,
  );
  return result.rows;
}

export async function obtenerSolicitudesCompletadas() {
  const result = await query<Record<string, unknown>>(
    `SELECT rd.*
     FROM ofi_reporte_denuncia rd
     JOIN ofi_reportes_campo rc ON rd.reporte_campo_id = rc.id
     WHERE rc.ofi_autoridad_recibe = 'FISCALIA'
       AND rd.estado_tramite = 'EN_ANALISIS'
       AND (rd.estado_evidencia = 'EVIDENCIA_ENVIADA' OR rd.estado_evidencia = 'SIN_EVIDENCIA_REQUERIDA')
     ORDER BY rd.updated_at DESC`,
  );
  return result.rows;
}

export async function actualizarEstadoSolicitud(
  id: string,
  estadoTramite: string,
  estadoEvidencia: string,
) {
  await query(
    `UPDATE ofi_reporte_denuncia
     SET estado_tramite = $1, estado_evidencia = $2, updated_at = NOW()
     WHERE id = $3`,
    [estadoTramite, estadoEvidencia, id],
  );
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
        CONCAT(ou.name, ' ', ou.apellido) AS ofi_oficial_nombre,
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

  const nombrePolicia = row.ofi_oficial_nombre ? String(row.ofi_oficial_nombre) : null;

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
         estado_tramite = 'EN_ANALISIS',
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

export async function obtenerDetalleInfraccionVia(
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

export async function listarAsegurados(soloPendientes: boolean, autoridad: string = 'FISCALIA'): Promise<AseguradoRow[]> {
  const pendientesFilter = soloPendientes
    ? "AND rc.folio_reporte_asegurados IS NULL"
    : "AND rc.folio_reporte_asegurados IS NOT NULL";

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
         AND rc.ofi_autoridad_recibe = $1
        ${pendientesFilter}
     ORDER BY rc.created_at DESC`,
    [autoridad],
  );
  return result.rows.map(rowToAsegurado);
}

export async function obtenerDetalleAseguradoCompleto(reporteCampoId: string): Promise<Record<string, unknown> | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       rc.id AS reporte_campo_id,
       rc.folio_reporte_campo,
       rc.ofi_detenidos,
       rc.ofi_calle AS lugar_calle,
       rc.ofi_colonia AS lugar_colonia,
        CONCAT(ou.name, ' ', ou.apellido) AS ofi_oficial_nombre,
        rc.ofi_latitud,
        rc.ofi_longitud,
        rc.folio_reporte_asegurados,
        rd.folio_denuncia,
        rd.iph,
        rd.folio_sija,
        rd.folio_remision,
        rd.marco_legal,
        rd.registro_tableta,
        p.numero_unidad AS ofi_placa_unidad_asignada,
        o.no_nomina,
        u.name AS capturado_por_nombre
      FROM ofi_reportes_campo rc
      JOIN ofi_reporte_denuncia rd ON rd.reporte_campo_id = rc.id
      LEFT JOIN ofi_oficiales o ON rc.ofi_oficial_id = o.id
      LEFT JOIN users ou ON ou.id = o.user_id
      LEFT JOIN via.v2_patrullas p ON p.id = o.patrulla_id
      LEFT JOIN users u ON rd.capturado_por = u.id
     WHERE rc.id = $1
     LIMIT 1`,
    [reporteCampoId],
  );
  return result.rows[0] ?? null;
}

export async function obtenerDetenidosGuardados(reporteCampoId: string): Promise<DetalleDetenidoGuardado[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT *
     FROM ofi_detalles_asegurados
     WHERE reporte_campo_id = $1
     ORDER BY created_at`,
    [reporteCampoId],
  );
  return result.rows.map(rowToDetalleDetenidoGuardado);
}

export async function guardarDetenidosDirecciones(
  reporteCampoId: string,
  detenidos: DetenidoDireccionInput[],
  folioAsegurados: string,
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `DELETE FROM ofi_detalles_asegurados WHERE reporte_campo_id = $1`,
      [reporteCampoId],
    );

    for (const d of detenidos) {
      await client.query(
        `INSERT INTO ofi_detalles_asegurados
         (reporte_campo_id, nombre_detenido, ap_paterno_detenido, ap_materno_detenido,
          calle, colonia, numero, cod_postal, latitud, longitud)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          reporteCampoId,
          d.nombreDetenido,
          d.apPaterno || null,
          d.apMaterno || null,
          d.calle || null,
          d.colonia || null,
          d.numero || null,
          d.codPostal || null,
          d.latitud,
          d.longitud,
        ],
      );
    }

    await client.query(
      `UPDATE ofi_reportes_campo
       SET folio_reporte_asegurados = $1, updated_at = NOW()
       WHERE id = $2`,
      [folioAsegurados, reporteCampoId],
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

export async function generarFolioAsegurados(): Promise<string> {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const prefix = `SSPM/${y}${m}${d}/FAS/`;

  for (let attempt = 0; attempt < 10; attempt++) {
    const nums = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    const folio = `${prefix}${nums}`;
    const exists = await query(
      `SELECT 1 FROM ofi_reportes_campo WHERE folio_reporte_asegurados = $1 LIMIT 1`,
      [folio],
    );
    if (exists.rows.length === 0) return folio;
  }
  throw new Error('No se pudo generar un folio único de asegurados');
}

export async function listarLiberaciones(): Promise<LiberacionRow[]> {
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
    ["FISCALIA"],
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

export async function listarAseguradosConDisposicion(autoridad: string = 'FISCALIA'): Promise<(AseguradoRow & { puestaDisposicionId: string | null })[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       rc.id,
       rc.folio_reporte_campo,
       rd.folio_denuncia,
       rc.created_at,
       rc.ofi_detenidos,
       rc.folio_reporte_asegurados,
        CONCAT(ou.name, ' ', ou.apellido) AS ofi_oficial_nombre,
        p.numero_unidad AS ofi_placa_unidad_asignada,
        pd.id AS puesta_disposicion_id
      FROM ofi_reportes_campo rc
      JOIN ofi_reporte_denuncia rd ON rd.reporte_campo_id = rc.id
      LEFT JOIN ofi_oficiales o ON rc.ofi_oficial_id = o.id
      LEFT JOIN users ou ON ou.id = o.user_id
      LEFT JOIN via.v2_patrullas p ON p.id = o.patrulla_id
      LEFT JOIN ofi_puesta_disposicion pd ON pd.reporte_campo_id = rc.id
      WHERE rc.ofi_hay_detencion = true
        AND rc.ofi_autoridad_recibe = $1
        AND rc.folio_reporte_asegurados IS NOT NULL
      ORDER BY rc.created_at DESC`,
    [autoridad],
  );
  return result.rows.map(r => ({
    ...rowToAsegurado(r),
    puestaDisposicionId: r.puesta_disposicion_id ? String(r.puesta_disposicion_id) : null,
  }));
}

export async function obtenerPuestaDisposicionPorReporte(reporteCampoId: string): Promise<PuestaDisposicionRow | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM ofi_puesta_disposicion WHERE reporte_campo_id = $1 LIMIT 1`,
    [reporteCampoId],
  );
  return result.rows[0] ? rowToPuestaDisposicion(result.rows[0]) : null;
}

export async function guardarPuestaDisposicion(
  reporteCampoId: string,
  datos: PuestaDisposicionInput,
  creadoPor: string,
): Promise<void> {
  await query(
    `INSERT INTO ofi_puesta_disposicion
     (reporte_campo_id, gestion_interna, dependencia_externa, actas, otros_actos,
      hora_inicio_traslado, hora_llegada_sede, tiempo_traslado_total, hora_puesta_disposicion, creado_por, completado_en)
     VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8, $9, $10, NOW())
     ON CONFLICT (reporte_campo_id)
     DO UPDATE SET
       gestion_interna = $2,
       dependencia_externa = $3,
       actas = $4::jsonb,
       otros_actos = $5,
       hora_inicio_traslado = $6,
       hora_llegada_sede = $7,
       tiempo_traslado_total = $8,
       hora_puesta_disposicion = $9,
       completado_en = NOW()`,
    [
      reporteCampoId,
      datos.gestionInterna,
      datos.dependenciaExterna,
      JSON.stringify(datos.actas),
      datos.otrosActos,
      datos.horaInicioTraslado,
      datos.horaLlegadaSede,
      datos.tiempoTrasladoTotal,
      datos.horaPuestaDisposicion,
      creadoPor,
    ],
  );
}
