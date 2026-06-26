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
