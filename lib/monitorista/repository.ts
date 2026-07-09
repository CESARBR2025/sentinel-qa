import { query } from '@/lib/db'
import type {
  SolicitudEvidencia, Evidencia, HistorialEntry, IncidenteCamara,
  IphDetenido, EvidenciaDetenido, PrellenadoCompleto,
} from './types'
import {
  rowToSolicitudEvidencia, rowToEvidencia, rowToHistorialEntry,
  rowToIncidenteCamara, rowToIphDetenido, rowToEvidenciaDetenido,
  rowToPrellenadoCompleto, parseSolicitudesJson,
} from './mapper'

export async function getMonitoristaStats(monitoristaId: string) {
  const [solsPend, solsComp, histCount, detPend, detComp, icStats] = await Promise.all([
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitudes_evidencia WHERE status = 'pendiente'"),
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitudes_evidencia WHERE status = 'completada'"),
    query<{ c: number }>("SELECT count(*)::int as c FROM monitorista_historial WHERE monitorista_id = $1", [monitoristaId]),
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitud_fotos sf INNER JOIN ofi_reportes_campo rc ON rc.id = sf.reporte_campo_id WHERE sf.estado IN ('pendiente','enviado','rechazado')"),
    query<{ c: number }>("SELECT count(*)::int as c FROM solicitud_fotos sf INNER JOIN ofi_reportes_campo rc ON rc.id = sf.reporte_campo_id WHERE sf.estado NOT IN ('pendiente','enviado','rechazado')"),
    query<{ personas: number; vehiculos: number }>("SELECT COALESCE(SUM(total_personas_revisadas),0)::int as personas, COALESCE(SUM(vehiculos_revisar),0)::int as vehiculos FROM incidentes_camara"),
  ])
  return {
    solsPend: solsPend.rows[0]?.c ?? 0,
    solsComp: solsComp.rows[0]?.c ?? 0,
    histCount: histCount.rows[0]?.c ?? 0,
    detPend: detPend.rows[0]?.c ?? 0,
    detComp: detComp.rows[0]?.c ?? 0,
    icStats: icStats.rows[0],
  }
}

export async function listarSolicitudesEvidencia(status: 'pendiente' | 'completada'): Promise<SolicitudEvidencia[]> {
  const orderField = status === 'pendiente' ? 'creado_en' : 'completado_en'
  const result = await query<Record<string, unknown>>(
    `SELECT se.id, se.incidente_id, se.folio_incidente, se.solicitado_nombre, se.descripcion, se.status, se.creado_en, se.completado_en,
            (SELECT count(*)::int FROM evidencias e WHERE e.solicitud_id = se.id) as total_evidencias
     FROM solicitudes_evidencia se
     WHERE status = $1
     ORDER BY ${orderField} DESC LIMIT 50`,
    [status]
  )
  return result.rows.map(rowToSolicitudEvidencia)
}

export async function getHistorialCount(monitoristaId: string, desde: string) {
  const result = await query<{ c: number }>(
    "SELECT count(*)::int as c FROM monitorista_historial WHERE monitorista_id = $1 AND creado_en >= $2",
    [monitoristaId, desde]
  )
  return result.rows[0]?.c ?? 0
}

export async function listarHistorial(): Promise<HistorialEntry[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT mh.id, mh.accion, mh.incidente_id, mh.solicitud_id, mh.creado_en,
            u.name as monitorista_nombre,
            se.folio_incidente,
            rc.folio_reporte_campo as folio_detenido,
            ic.fecha as ic_fecha, ic.turno as ic_turno
     FROM monitorista_historial mh
     LEFT JOIN users u ON mh.monitorista_id = u.id
     LEFT JOIN solicitudes_evidencia se ON mh.solicitud_id = se.id
     LEFT JOIN ofi_reportes_campo rc ON mh.incidente_id = rc.id
     LEFT JOIN incidentes_camara ic ON mh.incidente_id = ic.id
     ORDER BY mh.creado_en DESC LIMIT 200`
  )
  return result.rows.map(rowToHistorialEntry)
}

export async function obtenerSolicitudEvidencia(id: string): Promise<SolicitudEvidencia | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, incidente_id, folio_incidente, solicitado_nombre, descripcion, status, creado_en, completado_en
     FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`,
    [id],
  )
  return result.rows.length ? rowToSolicitudEvidencia(result.rows[0]) : null
}

export async function listarEvidencias(solicitudId: string): Promise<Evidencia[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT e.id, e.tipo, e.nombre_original, e.url_expediente,
            u.name AS subido_por_nombre, e.creado_en
     FROM evidencias e
     LEFT JOIN users u ON e.subido_por = u.id
     WHERE e.solicitud_id = $1
     ORDER BY e.creado_en`,
    [solicitudId],
  )
  return result.rows.map(rowToEvidencia)
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

export async function obtenerSolicitudConIncidente(id: string): Promise<{ id: string; status: string; incidenteId: string } | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, status, incidente_id FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`,
    [id],
  )
  if (!r.rows.length) return null
  return {
    id: String(r.rows[0].id),
    status: String(r.rows[0].status),
    incidenteId: String(r.rows[0].incidente_id),
  }
}

export async function actualizarEstadoSolicitud(id: string, status: string) {
  const setClause = status === 'completada'
    ? `SET status = $1, completado_en = NOW()`
    : `SET status = $1, completado_en = NULL`
  await query(
    `UPDATE solicitudes_evidencia ${setClause} WHERE id = $2`,
    [status, id],
  )
}

export async function listarSolicitudesConFiltro(status?: string): Promise<SolicitudEvidencia[]> {
  const statuses = ['pendiente', 'completada', 'cancelada']
  const filtro = status && statuses.includes(status) ? `WHERE status = '${status}'` : ''
  const r = await query<Record<string, unknown>>(
    `SELECT id, incidente_id, folio_incidente, solicitado_nombre, descripcion, status, creado_en, completado_en,
     (SELECT count(*)::int FROM evidencias WHERE evidencias.solicitud_id = solicitudes_evidencia.id) as total_evidencias
     FROM solicitudes_evidencia ${filtro} ORDER BY creado_en DESC LIMIT 100`,
  )
  return r.rows.map(rowToSolicitudEvidencia)
}

export async function obtenerSolicitudConEvidencias(id: string): Promise<{ solicitud: SolicitudEvidencia; evidencias: Evidencia[] } | null> {
  const sol = await query<Record<string, unknown>>(
    `SELECT id, incidente_id, folio_incidente, solicitado_nombre, descripcion, status, creado_en, completado_en
     FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`, [id],
  )
  if (!sol.rows[0]) return null
  const evs = await query<Record<string, unknown>>(
    `SELECT e.id, e.tipo, e.nombre_original, e.url_expediente, u.name as subido_por_nombre, e.creado_en
     FROM evidencias e LEFT JOIN users u ON e.subido_por = u.id
     WHERE e.solicitud_id = $1 ORDER BY e.creado_en`, [id],
  )
  return {
    solicitud: rowToSolicitudEvidencia(sol.rows[0]),
    evidencias: evs.rows.map(rowToEvidencia),
  }
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
    `SELECT folio_incidente FROM solicitudes_evidencia WHERE id = $1 LIMIT 1`,
    [id],
  )
  if (!r.rows.length) return null
  return { folioIncidente: String(r.rows[0].folio_incidente ?? '') }
}

export async function listarHistorialConFiltros(params: {
  monitoristaId: string
  desde?: string | null
  hasta?: string | null
}): Promise<HistorialEntry[]> {
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
    `SELECT mh.id, mh.accion, mh.solicitud_id, mh.incidente_id,
            mh.creado_en, u.name AS monitorista_nombre,
            se.folio_incidente
     FROM monitorista_historial mh
     LEFT JOIN users u ON mh.monitorista_id = u.id
     LEFT JOIN solicitudes_evidencia se ON mh.solicitud_id = se.id
     WHERE ${filtros.join(' AND ')}
     ORDER BY mh.creado_en DESC
     LIMIT 200`,
    vals,
  )
  return r.rows.map(rowToHistorialEntry)
}

export async function insertarEvidencia(
  solicitudId: string,
  incidenteId: string,
  tipo: string,
  nombreOriginal: string,
  urlExpediente: string,
  subidoPor: string,
) {
  await query(
    `INSERT INTO evidencias (solicitud_id, incidente_id, tipo, nombre_original, url_expediente, subido_por)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [solicitudId, incidenteId, tipo, nombreOriginal, urlExpediente, subidoPor],
  )
}

export async function obtenerIphDetenido(id: string): Promise<IphDetenido | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, folio_iph, alias, delito, fecha_evento, genero FROM iph_detenidos WHERE id = $1`,
    [id],
  )
  return result.rows[0] ? rowToIphDetenido(result.rows[0]) : null
}

export async function listarIphDetenidos(): Promise<IphDetenido[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, folio_iph, alias, delito, fecha_evento, genero FROM iph_detenidos ORDER BY id DESC LIMIT 100`,
  )
  return result.rows.map(rowToIphDetenido)
}

export async function obtenerPrellenadoCompleto(id: string): Promise<PrellenadoCompleto | null> {
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
  return result.rows[0] ? rowToPrellenadoCompleto(result.rows[0]) : null
}

export async function listarEvidenciasDetenido(reporteCampoId: string): Promise<EvidenciaDetenido[]> {
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
  return result.rows.map(rowToEvidenciaDetenido)
}

export async function obtenerDenunciasPendientesRaw(): Promise<Record<string, unknown>[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, folio_denuncia, estado_tramite, estado_evidencia, created_at, monitorista_fechas_requeridas
     FROM ofi_reporte_denuncia
     WHERE estado_evidencia = 'PENDIENTE_MONITORISTA'
     ORDER BY created_at DESC
     LIMIT 50`,
  )
  return result.rows
}

export async function obtenerDenunciasAtendidasRaw(): Promise<Record<string, unknown>[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, folio_denuncia, estado_tramite, estado_evidencia, created_at, monitorista_fechas_requeridas
     FROM ofi_reporte_denuncia
     WHERE estado_evidencia IN ('EVIDENCIA_ENVIADA', 'FINALIZADO')
       AND monitorista_fechas_requeridas IS NOT NULL
     ORDER BY updated_at DESC
     LIMIT 50`,
  )
  return result.rows
}

export async function obtenerDenunciaPorIdRaw(id: string): Promise<Record<string, unknown> | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, folio_denuncia, iph, delito, tipo_evento, lugar_hecho, colonia_hecho,
            fecha_reporte, hora_reporte, policia_a_cargo, capturado_por,
            estado_tramite, estado_evidencia, created_at, monitorista_fechas_requeridas
     FROM ofi_reporte_denuncia
     WHERE id = $1`,
    [id],
  )
  return result.rows[0] ?? null
}

export async function obtenerEvidenciasDenunciaRaw(denunciaId: string): Promise<Record<string, unknown>[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, solicitud_id, url_archivo, nombre_archivo
     FROM moni_evidencias_denuncia
     WHERE ofi_reporte_denuncia_id = $1
     ORDER BY id`,
    [denunciaId],
  )
  return result.rows
}

export async function getDestinosRaw(): Promise<Record<string, unknown>[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, clave, nombre FROM cat_dependencias WHERE tipo = 'externa' AND activo = true AND clave IN ('FISCALIA','JUZGADO_CIVICO') ORDER BY nombre`,
  )
  return r.rows
}

export async function listarReportesConDetenidosRaw(): Promise<Record<string, unknown>[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT rc.id, rc.ofi_folio_cad, rc.folio_reporte_campo, rc.ofi_tipo_incidente,
       rc.modus_operandi, rc.falta_administrativa, rc.delito, rc.marco_legal,
       rc.ofi_autoridad_recibe, CONCAT(u.name, ' ', u.apellido) AS ofi_oficial_nombre,
       rc.ofi_hay_detencion, rc.ofi_hay_vehiculo, rc.ofi_hay_cateo,
       rc.ofi_detenidos, rc.created_at,
       COALESCE(rc.delito, ord.delito) as delito_denuncia,
       COALESCE(rc.marco_legal, ord.marco_legal) as marco_legal_mostrar
    FROM ofi_reportes_campo rc
    LEFT JOIN ofi_oficiales o ON o.id = rc.ofi_oficial_id
    LEFT JOIN users u ON u.id = o.user_id
    LEFT JOIN ofi_reporte_denuncia ord ON ord.reporte_campo_id = rc.id
    WHERE rc.ofi_detenidos IS NOT NULL
      AND rc.ofi_detenidos::text NOT IN ('[]', '1')
    ORDER BY rc.created_at DESC LIMIT 100`,
  )
  return r.rows
}

export async function obtenerReportePorIdRaw(id: string): Promise<Record<string, unknown> | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT rc.id, rc.ofi_folio_cad, rc.folio_reporte_campo, rc.ofi_tipo_incidente,
       rc.modus_operandi, rc.falta_administrativa, rc.delito, rc.marco_legal,
       rc.ofi_autoridad_recibe, CONCAT(u.name, ' ', u.apellido) AS ofi_oficial_nombre,
       rc.ofi_hay_detencion, rc.ofi_hay_vehiculo, rc.ofi_hay_cateo,
       rc.ofi_detenidos, rc.created_at,
       COALESCE(rc.delito, ord.delito) as delito_denuncia,
       COALESCE(rc.marco_legal, ord.marco_legal) as marco_legal_mostrar
    FROM ofi_reportes_campo rc
    LEFT JOIN ofi_oficiales o ON o.id = rc.ofi_oficial_id
    LEFT JOIN users u ON u.id = o.user_id
    LEFT JOIN ofi_reporte_denuncia ord ON ord.reporte_campo_id = rc.id
    WHERE rc.id = $1 LIMIT 1`,
    [id],
  )
  return r.rows[0] ?? null
}

export async function obtenerSolicitudFotosRaw(reporteCampoId: string): Promise<Record<string, unknown>[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, tipo_foto, enviado_a, estado FROM solicitud_fotos WHERE reporte_campo_id = $1 ORDER BY tipo_foto`,
    [reporteCampoId],
  )
  return r.rows
}

export async function listarRegistrosRaw(turno?: string): Promise<Record<string, unknown>[]> {
  let sql = `SELECT * FROM incidentes_camara`
  const params: unknown[] = []
  if (turno) {
    sql += ` WHERE turno = $1`
    params.push(turno)
  }
  sql += ` ORDER BY fecha DESC, turno ASC LIMIT 100`
  const r = await query<Record<string, unknown>>(sql, params)
  return r.rows
}

export async function obtenerRegistroRaw(id: string): Promise<Record<string, unknown> | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM incidentes_camara WHERE id = $1`,
    [id],
  )
  return r.rows[0] ?? null
}

export async function obtenerRegistroPorFechaTurnoRaw(fecha: string, turno: string): Promise<Record<string, unknown> | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM incidentes_camara WHERE fecha = $1 AND turno = $2 LIMIT 1`,
    [fecha, turno],
  )
  return r.rows[0] ?? null
}

export async function actualizarCampo(id: string, campo: string, valor: string): Promise<void> {
  if (!['modus_operandi', 'falta_administrativa', 'delito', 'marco_legal'].includes(campo)) {
    throw new Error('Campo no válido para edición')
  }
  await query(
    `UPDATE ofi_reportes_campo
     SET modus_operandi = CASE WHEN $1 = 'modus_operandi' THEN $2 ELSE modus_operandi END,
         falta_administrativa = CASE WHEN $1 = 'falta_administrativa' THEN $2 ELSE falta_administrativa END,
         delito = CASE WHEN $1 = 'delito' THEN $2 ELSE delito END,
         marco_legal = CASE WHEN $1 = 'marco_legal' THEN $2 ELSE marco_legal END
     WHERE id = $3`,
    [campo, valor || null, id],
  )
}

export async function crearSolicitudFotos(reporteCampoId: string): Promise<boolean> {
  const existentes = await query<{ c: number }>(
    `SELECT count(*)::int as c FROM solicitud_fotos WHERE reporte_campo_id = $1`, [reporteCampoId],
  )
  if (existentes.rows[0].c > 0) return false
  for (const tipo of ['frontal', 'derecho', 'izquierdo']) {
    await query(
      `INSERT INTO solicitud_fotos (reporte_campo_id, tipo_foto, estado) VALUES ($1, $2, 'pendiente')`,
      [reporteCampoId, tipo],
    )
  }
  return true
}

export async function enviarFoto(fotoId: string, destino: string): Promise<void> {
  await query(
    `UPDATE solicitud_fotos SET estado = 'enviado', enviado_a = $1 WHERE id = $2 AND estado = 'pendiente'`,
    [destino, fotoId],
  )
}

export async function subirFotoDetenido(
  reporteCampoId: string,
  tipoFoto: string,
  urlArchivo: string,
  nombreArchivo: string,
  subidoPor: string,
) {
  await query(
    `INSERT INTO evidencias_detenido (reporte_campo_id, tipo_foto, url_archivo, nombre_archivo, subido_por)
     VALUES ($1, $2, $3, $4, $5)`,
    [reporteCampoId, tipoFoto, urlArchivo, nombreArchivo, subidoPor],
  )
}

export async function completarSolicitudFoto(reporteCampoId: string, tipoFoto: string): Promise<boolean> {
  const updResult = await query(
    `UPDATE solicitud_fotos SET estado = 'completado', enviado_a = 'MONITORISTA'
     WHERE reporte_campo_id = $1::uuid AND tipo_foto = $2::varchar`,
    [reporteCampoId, tipoFoto],
  )
  if (updResult.rowCount === 0) {
    await query(
      `INSERT INTO solicitud_fotos (reporte_campo_id, tipo_foto, estado, enviado_a)
       VALUES ($1::uuid, $2::varchar, 'completado', 'MONITORISTA')`,
      [reporteCampoId, tipoFoto],
    )
  }
  return true
}

export async function obtenerObtenerSolicitudFoto(reporteCampoId: string, tipoFoto: string): Promise<{ id: string; estado: string; enviadoA: string } | undefined> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, estado, enviado_a FROM solicitud_fotos WHERE reporte_campo_id = $1 AND tipo_foto = $2 LIMIT 1`,
    [reporteCampoId, tipoFoto],
  )
  if (!r.rows[0]) return undefined
  return {
    id: String(r.rows[0].id),
    estado: String(r.rows[0].estado),
    enviadoA: String(r.rows[0].enviado_a ?? ''),
  }
}

export async function insertarEvidenciaDetenido(
  reporteCampoId: string,
  tipoFoto: string,
  urlArchivo: string,
  nombreArchivo: string,
  subidoPor: string,
) {
  await query(
    `INSERT INTO evidencias_detenido (reporte_campo_id, tipo_foto, url_archivo, nombre_archivo, subido_por)
     VALUES ($1, $2, $3, $4, $5)`,
    [reporteCampoId, tipoFoto, urlArchivo, nombreArchivo, subidoPor],
  )
}

export async function actualizarSolicitudFotoEstado(fotoId: string) {
  await query(
    `UPDATE solicitud_fotos SET estado = 'completado' WHERE id = $1`,
    [fotoId],
  )
}

export async function registrarIphDetenido(data: Record<string, unknown>) {
  const result = await query<any>(
    `INSERT INTO iph_detenidos(
      fecha_nacimiento, edad, genero, alias, ciudad_origen,
      calle_detenido, numero_detenido, colonia_detenido,
      articulo, tipo_falta, es_rnd, rnd,
      calle_arresto, colonia_arresto, sector_arresto, agrupamiento_arresto,
      latitud_arresto, longitud_arresto,
      presencia, verbalizacion, control_contacto, control_fisico,
      tecnicas_no_letales, fuerza_letal,
      folio_iph, folio_911, dia_evento, fecha_evento, fecha_reporte,
      hora_reporte, hora_inicio_evento, hora_final_evento, hora_promedio,
      delito, modus_operandi, articulos_objetos,
      calle_hecho, numero_hecho, colonia_hecho, latitud_hecho, longitud_hecho, sector_hecho,
      rt_responsable, turno_responsable, crp_unidad,
      nombre_afectado, telefono_afectado, calle_afectado, numero_afectado, colonia_afectado,
      marca_vehiculo, submarca_vehiculo, tipo_vehiculo, color_vehiculo,
      placas_vehiculo, estado_vehiculo, niv_vehiculo, motor_vehiculo, modelo_vehiculo,
      ap_nuc, fuero, agente_aprehensor, reporte_denuncia_id
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63) RETURNING id, folio;`,
    [
      data.fechaNacimiento, data.edad, data.genero, data.alias, data.ciudadOrigen,
      data.calleDetenido, data.numeroDetenido, data.coloniaDetenido,
      data.articulo, data.tipoFalta, data.esRND, data.rnd,
      data.calleArresto, data.coloniaArresto, data.sectorArresto, data.agrupamientoArresto,
      data.latitudArresto, data.longitudArresto,
      data.presencia, data.verbalizacion, data.controlContacto, data.controlFisico,
      data.tecnicasNoLetales, data.fuerzaLetal,
      data.folioIPH, data.folio911, data.diaEvento, data.fechaEvento, data.fechaReporte,
      data.horaReporte, data.horaInicioEvento, data.horaFinalEvento, data.horaPromedio,
      data.delito, data.modusOperandi, data.articulosObjetos,
      data.calleHecho, data.numeroHecho, data.coloniaHecho, data.latitudHecho, data.longitudHecho, data.sectorHecho,
      data.rtResponsable, data.turnoResponsable, data.crpUnidad,
      data.nombreAfectado, data.telefonoAfectado, data.calleAfectado, data.numeroAfectado, data.coloniaAfectado,
      data.marcaVehiculo, data.submarcaVehiculo, data.tipoVehiculo, data.colorVehiculo,
      data.placasVehiculo, data.estadoVehiculo, data.nivVehiculo, data.motorVehiculo, data.modeloVehiculo,
      data.apNuc, data.fuero, data.agenteAprehensor, data.reporteDenunciaId
    ],
  )
  return result.rows[0]
}

export async function registrarFichaInteligencia(data: Record<string, unknown>) {
  await query(
    `INSERT INTO fichas_inteligencia_detenidos (
      nombre_detenido, folio, foto_frontal_url, foto_objetos_url, fecha_nacimiento,
      origen, genero, escolaridad, estado_civil, ocupacion, domicilio,
      rasgos_particulares, eventos_delictivos, fecha_hora_evento, rnd, iph,
      expediente, lugar_evento, lugar_detencion, nexos_delictivos, zona_operacion,
      puesta_disposicion, modus_operandi, info_adicional, antecedentes, faltas_admin,
      capturado_por
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
      $21, $22, $23, $24, $25, $26, $27
    )`,
    [
      data.nombreDetenido, data.folio, data.fotoFrontalUrl, data.fotoObjetosUrl,
      data.fechaNacimiento, data.origen, data.genero, data.escolaridad,
      data.estadoCivil, data.ocupacion, data.domicilio, data.rasgosParticulares,
      data.eventosDelictivos, data.fechaHora, data.rnd, data.iph,
      data.expediente, data.lugarEvento, data.lugarDetencion, data.nexosDelictivos,
      data.zonaOperacion, data.puestaDisposicion, data.modusOperandi,
      data.infoAdicional, data.antecedentes, data.faltasAdmin, data.capturadoPor,
    ],
  )
}

export async function getRolUsuario(userId: string): Promise<string> {
  const r = await query<{ rol: string }>(
    `SELECT r.nombre AS rol FROM users u LEFT JOIN roles r ON u.rol_id = r.id WHERE u.id = $1 LIMIT 1`,
    [userId],
  )
  return r.rows[0]?.rol ?? ''
}

export async function rechazarFoto(fotoId: string): Promise<void> {
  await query(
    `UPDATE solicitud_fotos SET estado = 'rechazado' WHERE id = $1 AND estado = 'enviado'`,
    [fotoId],
  )
}

export async function marcarSolicitudAtendida(
  denunciaId: string,
  solicitudId: number,
): Promise<void> {
  const result = await query<Record<string, unknown>>(
    `SELECT monitorista_fechas_requeridas FROM ofi_reporte_denuncia WHERE id = $1`,
    [denunciaId],
  )
  if (result.rows.length === 0) throw new Error('Denuncia no encontrada')

  const fechas = parseSolicitudesJson(result.rows[0].monitorista_fechas_requeridas)
  const actualizadas = fechas.map((f) =>
    f.solicitudId === solicitudId ? { ...f, atendida: true } : f,
  )

  const rawJson = actualizadas.map(f => ({
    solicitud_id: f.solicitudId,
    fecha_peticion: f.fechaPeticion,
    colonia: f.colonia,
    calle: f.calle,
    numero: f.numero,
    hora_inicio: f.horaInicio,
    hora_fin: f.horaFin,
    atendida: f.atendida,
  }))

  await query(
    `UPDATE ofi_reporte_denuncia
     SET monitorista_fechas_requeridas = $1::jsonb, updated_at = NOW()
     WHERE id = $2`,
    [JSON.stringify(rawJson), denunciaId],
  )

  const todasAtendidas = actualizadas.every((f) => f.atendida)
  if (todasAtendidas) {
    await query(
      `UPDATE ofi_reporte_denuncia
       SET estado_evidencia = 'EVIDENCIA_ENVIADA', updated_at = NOW()
       WHERE id = $1`,
      [denunciaId],
    )
  }
}


