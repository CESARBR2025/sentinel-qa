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

export async function insertHistorial(
  monitoristaId: string,
  accion: string,
  incidenteId?: string,
  solicitudId?: string,
) {
  await query(
    `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id, solicitud_id)
     VALUES ($1, $2, $3, $4)`,
    [monitoristaId, accion, incidenteId ?? null, solicitudId ?? null],
  )
}

export async function obtenerSolicitudConIncidente(id: string): Promise<{ id: string; status: string; incidente_id: string } | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, status, incidente_id FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`,
    [id],
  )
  if (!r.rows.length) return null
  return {
    id: String(r.rows[0].id),
    status: String(r.rows[0].status),
    incidente_id: String(r.rows[0].incidente_id),
  }
}

export async function actualizarEstadoSolicitud(id: string, status: string, completadoEn: boolean) {
  const setClause = status === 'completada'
    ? `SET status = $1, completado_en = NOW()`
    : `SET status = $1, completado_en = NULL`
  await query(
    `UPDATE solicitudes_evidencia ${setClause} WHERE id = $2`,
    [status, id],
  )
}

export async function listarSolicitudesConFiltro(status?: string) {
  const statuses = ['pendiente', 'completada', 'cancelada']
  const filtro = status && statuses.includes(status) ? `WHERE status = '${status}'` : ''
  const r = await query<Record<string, unknown>>(
    `SELECT id, incidente_id, folio_incidente, solicitado_nombre, descripcion, status, creado_en, completado_en,
     (SELECT count(*)::int FROM evidencias WHERE evidencias.solicitud_id = solicitudes_evidencia.id) as total_evidencias
     FROM solicitudes_evidencia ${filtro} ORDER BY creado_en DESC LIMIT 100`,
  )
  return r.rows
}

export async function obtenerSolicitudConEvidencias(id: string) {
  const sol = await query<Record<string, unknown>>(
    `SELECT * FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`, [id],
  )
  if (!sol.rows[0]) return null
  const evs = await query<Record<string, unknown>>(
    `SELECT e.id, e.tipo, e.nombre_original, e.url_expediente, u.name as subido_por_nombre, e.creado_en
     FROM evidencias e LEFT JOIN users u ON e.subido_por = u.id
     WHERE e.solicitud_id = $1 ORDER BY e.creado_en`, [id],
  )
  return { solicitud: sol.rows[0], evidencias: evs.rows }
}

export async function crearSolicitudEvidencia(body: {
  incidenteId: string
  folioIncidente?: string | null
  solicitadoPor: string
  solicitadoNombre: string
  descripcion: string
}): Promise<string> {
  const r = await query<{ id: string }>(
    `INSERT INTO solicitudes_evidencia (incidente_id, folio_incidente, solicitado_por, solicitado_nombre, descripcion)
     VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [body.incidenteId, body.folioIncidente || null, body.solicitadoPor, body.solicitadoNombre, body.descripcion],
  )
  return r.rows[0].id
}

export async function obtenerFolioReporteCampo(id: string): Promise<string | null> {
  const r = await query<{ folio: string | null }>(
    `SELECT folio_reporte_campo as folio FROM ofi_reportes_campo WHERE id = $1 LIMIT 1`,
    [id],
  )
  return r.rows[0]?.folio ?? null
}

export async function obtenerSolicitudFolioIncidente(id: string): Promise<{ folioIncidente: string } | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, folio_incidente AS "folioIncidente" FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`,
    [id],
  )
  if (!r.rows.length) return null
  return { folioIncidente: String(r.rows[0].folioIncidente) }
}

export async function listarHistorialConFiltros(params: {
  monitoristaId: string
  desde?: string | null
  hasta?: string | null
}) {
  const filtros: string[] = []
  const vals: unknown[] = []
  let idx = 1

  filtros.push(`mh.monitorista_id = $${idx++}`)
  vals.push(params.monitoristaId)

  if (params.desde) {
    filtros.push(`mh.creado_en >= $${idx++}`)
    vals.push(params.desde)
  }
  if (params.hasta) {
    filtros.push(`mh.creado_en <= $${idx++}`)
    vals.push(params.hasta)
  }

  const r = await query<Record<string, unknown>>(
    `SELECT mh.id, mh.accion, mh.solicitud_id AS "solicitudId", mh.incidente_id AS "incidenteId",
            mh.creado_en AS "creadoEn", u.name AS "monitoristaNombre",
            se.folio_incidente AS "folioIncidente"
     FROM monitorista_historial mh
     LEFT JOIN users u ON mh.monitorista_id = u.id
     LEFT JOIN solicitudes_evidencia se ON mh.solicitud_id = se.id
     WHERE ${filtros.join(' AND ')}
     ORDER BY mh.creado_en DESC
     LIMIT 200`,
    vals,
  )
  return r.rows
}

export async function insertarEvidencia(
  solicitudId: string,
  incidenteId: string,
  tipo: string,
  nombreOriginal: string,
  urlExpediente: string,
  subidoPor: string,
) {
  const r = await query<Record<string, unknown>>(
    `INSERT INTO evidencias (solicitud_id, incidente_id, tipo, nombre_original, url_expediente, subido_por)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [solicitudId, incidenteId, tipo, nombreOriginal, urlExpediente, subidoPor],
  )
  return r.rows[0]
}

export async function obtenerIphDetenido(id: string) {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM iph_detenidos WHERE id = $1`,
    [id],
  )
  return result.rows[0] ?? null
}

export async function listarIphDetenidos() {
  const result = await query<Record<string, unknown>>(
    `SELECT id, folio_iph AS "folioIPH", alias, delito, fecha_evento AS "fechaEvento", genero
     FROM iph_detenidos ORDER BY id DESC LIMIT 100`,
  )
  return result.rows
}

export async function obtenerPrellenadoCompleto(id: string) {
  const result = await query<Record<string, unknown>>(
    `SELECT
      CONCAT_WS(' ', da.nombre_detenido, da.ap_paterno_detenido, da.ap_materno_detenido) AS "nombreDetenido",
      rc.ofi_folio_cad AS "folio",
      iph.fecha_nacimiento AS "fechaNacimiento",
      iph.ciudad_origen AS "origen",
      iph.genero AS "genero",
      CONCAT_WS(', ', da.calle, da.numero, da.colonia) AS "domicilio",
      rc.delito AS "eventosDelictivos",
      (rd.fecha_reporte::text || ' ' || rd.hora_reporte::text) AS "fechaHora",
      iph.rnd AS "rnd",
      '' AS "expediente",
      CONCAT_WS(', ', rd.lugar_hecho, rd.colonia_hecho) AS "lugarEvento",
      CONCAT_WS(', ', rd.lugar_apoyo, rd.colonia_apoyo) AS "lugarDetencion",
      rd.iph AS "iph",
      '' AS "nexosDelictivos",
      rd.sector AS "zonaOperacion",
      '' AS "puestaDisposicion",
      rc.modus_operandi AS "modusOperandi",
      rc.ofi_contenido_reporte AS "infoAdicional",
      '' AS "antecedentes",
      rc.falta_administrativa AS "faltasAdmin"
    FROM iph_detenidos iph
    LEFT JOIN ofi_reporte_denuncia rd ON rd.folio_denuncia = iph.folio_911
    LEFT JOIN ofi_reportes_campo rc ON rc.id = rd.reporte_campo_id
    LEFT JOIN ofi_detalles_asegurados da ON da.reporte_campo_id = rc.id
    WHERE iph.id = $1
    LIMIT 1`,
    [id],
  )
  return result.rows[0] ?? null
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