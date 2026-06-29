import { query } from "@/lib/db";
import type { RolRow, DetalleAsegurado, DatosAseguradoInput, EvidenciaMonitorista } from "./types";

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

export async function obtenerDetalleAsegurado(solicitudId: string): Promise<DetalleAsegurado | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       rd.folio_denuncia,
       rc.folio_reporte_campo,
       rd.iph,
       rd.fecha_reporte,
       rd.hora_reporte,
       rc.ofi_detenidos,
       o.ofi_placa_unidad_asignada,
       o.ofi_nombre,
       o.ofi_ap_paterno,
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
     LEFT JOIN users u ON rd.capturado_por = u.id
     WHERE rd.id = $1
     LIMIT 1`,
    [solicitudId],
  )

  if (!result.rows.length) return null

  const row = result.rows[0]

  let nombreDetenido: string | null = null
  try {
    const detenidos = typeof row.ofi_detenidos === 'string'
      ? JSON.parse(row.ofi_detenidos)
      : row.ofi_detenidos
    if (Array.isArray(detenidos) && detenidos.length > 0) {
      nombreDetenido = detenidos[0]?.nombre ?? null
    }
  } catch { /* ignore parse errors */ }

  const calle = row.ofi_calle ? String(row.ofi_calle) : ''
  const colonia = row.ofi_colonia ? String(row.ofi_colonia) : ''
  const lugarDetencion = [calle, colonia].filter(Boolean).join(', ') || null

  const ofiNombre = row.ofi_nombre ? String(row.ofi_nombre) : ''
  const ofiApPaterno = row.ofi_ap_paterno ? String(row.ofi_ap_paterno) : ''
  const nombrePolicia = [ofiNombre, ofiApPaterno].filter(Boolean).join(' ') || null

  return {
    folioDenuncia:        row.folio_denuncia ? String(row.folio_denuncia) : null,
    folioReporteCampo:    row.folio_reporte_campo ? String(row.folio_reporte_campo) : null,
    iph:                  row.iph ? String(row.iph) : null,
    fechaReporte:         row.fecha_reporte ? String(row.fecha_reporte) : null,
    horaReporte:          row.hora_reporte ? String(row.hora_reporte) : null,
    nombreDetenido,
    placaUnidad:          row.ofi_placa_unidad_asignada ? String(row.ofi_placa_unidad_asignada) : null,
    nombrePolicia,
    nominaPolicia:        row.no_nomina ? String(row.no_nomina) : null,
    lugarDetencion,
    capturadoPorNombre:   row.capturado_por_nombre ? String(row.capturado_por_nombre) : null,
    folioSija:            row.folio_sija ? String(row.folio_sija) : null,
    folioRemision:        row.folio_remision ? String(row.folio_remision) : null,
    marcoLegal:           row.marco_legal ? String(row.marco_legal) : null,
    registroTableta:      row.registro_tableta ? String(row.registro_tableta) : null,
    domicilioCalle:       row.domicilio_calle ? String(row.domicilio_calle) : null,
    domicilioNumero:      row.domicilio_numero ? String(row.domicilio_numero) : null,
    domicilioColonia:     row.domicilio_colonia ? String(row.domicilio_colonia) : null,
    domicilioMunicipio:   row.domicilio_municipio ? String(row.domicilio_municipio) : null,
  }
}

export async function actualizarDetallesAsegurado(
  id: string,
  datos: DatosAseguradoInput,
  evidenciasJson?: string | null,
): Promise<void> {
  const estadoEvidencia = evidenciasJson ? 'PENDIENTE_MONITORISTA' : 'SIN_EVIDENCIA_REQUERIDA'

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
      datos.registroTableta || 'false',
      estadoEvidencia,
      evidenciasJson ?? null,
      id,
    ],
  )
}

export async function obtenerEvidenciasMonitorista(denunciaId: string): Promise<EvidenciaMonitorista[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, url_archivo, nombre_archivo
     FROM moni_evidencias_denuncia
     WHERE ofi_reporte_denuncia_id = $1
     ORDER BY id`,
    [denunciaId],
  )
  return result.rows.map(r => ({
    id: Number(r.id),
    urlArchivo: String(r.url_archivo ?? ''),
    nombreArchivo: r.nombre_archivo ? String(r.nombre_archivo) : null,
  }))
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
