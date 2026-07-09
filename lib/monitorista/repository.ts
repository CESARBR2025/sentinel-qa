import { query } from '@/lib/db'

export async function getMonitoristaStats(monitoristaId: string) {
  const [solsPend, solsComp, histCount, detPend, detComp, icStats] = await Promise.all([
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitudes_evidencia WHERE status = 'pendiente'"),
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitudes_evidencia WHERE status = 'completada'"),
    query<{ c: number }>("SELECT count(*)::int as c FROM monitorista_historial WHERE monitorista_id = $1", [monitoristaId]),
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitud_fotos sf INNER JOIN ofi_reportes_campo rc ON rc.id = sf.reporte_campo_id WHERE sf.estado IN ('pendiente','enviado','rechazado')"),
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitud_fotos sf INNER JOIN ofi_reportes_campo rc ON rc.id = sf.reporte_campo_id WHERE sf.estado NOT IN ('pendiente','enviado','rechazado')"),
    query<{ personas: number; vehiculos: number }>("SELECT COALESCE(SUM(total_personas_revisadas),0)::int as personas, COALESCE(SUM(vehiculos_revisar),0)::int as vehiculos FROM incidentes_camara"),
  ])
  return { solsPend: solsPend.rows[0]?.c ?? 0, solsComp: solsComp.rows[0]?.c ?? 0, histCount: histCount.rows[0]?.c ?? 0, detPend: detPend.rows[0]?.c ?? 0, detComp: detComp.rows[0]?.c ?? 0, icStats: icStats.rows[0] }
}

export async function listarSolicitudesEvidencia(status: 'pendiente' | 'completada') {
  const orderField = status === 'pendiente' ? 'creado_en' : 'completado_en'
  const result = await query<Record<string, unknown>>(
    `SELECT id, incidente_id, folio_incidente, solicitado_nombre, descripcion, status, creado_en, completado_en,
            (SELECT count(*)::int FROM evidencias e WHERE e.solicitud_id = se.id) as total_evidencias
     FROM solicitudes_evidencia se
     WHERE status = $1
     ORDER BY ${orderField} DESC LIMIT 50`,
    [status]
  )
  return result.rows
}

export async function getHistorialCount(monitoristaId: string, desde: string) {
  const result = await query<{ c: number }>(
    "SELECT count(*)::int as c FROM monitorista_historial WHERE monitorista_id = $1 AND creado_en >= $2",
    [monitoristaId, desde]
  )
  return result.rows[0]?.c ?? 0
}

export async function listarHistorial() {
  const result = await query<Record<string, unknown>>(
    `SELECT mh.id, mh.accion, mh.incidente_id, mh.creado_en,
            u.name as monitorista_nombre,
            se.folio_incidente as folio_solicitud,
            rc.folio_reporte_campo as folio_detenido,
            ic.fecha as ic_fecha, ic.turno as ic_turno
     FROM monitorista_historial mh
     LEFT JOIN users u ON mh.monitorista_id = u.id
     LEFT JOIN solicitudes_evidencia se ON mh.solicitud_id = se.id
     LEFT JOIN ofi_reportes_campo rc ON mh.incidente_id = rc.id
     LEFT JOIN incidentes_camara ic ON mh.incidente_id = ic.id
     ORDER BY mh.creado_en DESC LIMIT 200`
  )
  return result.rows
}

export async function obtenerSolicitudEvidencia(id: string) {
  const result = await query<Record<string, unknown>>(
    `SELECT id, incidente_id AS "incidenteId", folio_incidente AS "folioIncidente",
            solicitado_nombre AS "solicitadoNombre", descripcion, status,
            creado_en AS "creadoEn", completado_en AS "completadoEn"
     FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`,
    [id],
  )
  return result.rows[0] ?? null
}

export async function listarEvidencias(solicitudId: string) {
  const result = await query<Record<string, unknown>>(
    `SELECT e.id, e.tipo, e.nombre_original AS "nombreOriginal", e.url_expediente AS "urlExpediente",
            u.name AS "subidoPorNombre", e.creado_en AS "creadoEn"
     FROM evidencias e
     LEFT JOIN users u ON e.subido_por = u.id
     WHERE e.solicitud_id = $1
     ORDER BY e.creado_en`,
    [solicitudId],
  )
  return result.rows
}

export async function listarEvidenciasDetenido(reporteCampoId: string) {
  const result = await query<Record<string, unknown>>(
    `SELECT sub.id, sub.tipo_foto, sub.url_archivo, sub.nombre_archivo, sub.subido_por,
            COALESCE(r.nombre, 'Monitorista') as rol_subio
     FROM (
       SELECT ed.id, ed.tipo_foto, ed.url_archivo, ed.nombre_archivo, ed.subido_por,
              ROW_NUMBER() OVER (PARTITION BY ed.tipo_foto ORDER BY ed.creado_en DESC) as rn
       FROM evidencias_detenido ed
       WHERE ed.reporte_campo_id = $1
     ) sub
     LEFT JOIN users u ON sub.subido_por = u.id
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE sub.rn = 1
     ORDER BY sub.tipo_foto`, [reporteCampoId],
  )
  return result.rows
}