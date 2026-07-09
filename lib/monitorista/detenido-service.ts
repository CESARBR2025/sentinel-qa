import { query } from '@/lib/db'

export interface Dependencia {
  id: number
  clave: string
  nombre: string
}

export interface ReporteDetenido {
  id: string
  folio_detenido: string
  nombre_detenido: string
  tipo_incidente: string | null
  delito_denuncia: string | null
  marco_legal: string | null
  falta_administrativa: string | null
  modus_operandi: string | null
  autoridad_recibe: string | null
  oficial_nombre: string | null
  hay_detencion: boolean
  hay_vehiculo: boolean
  hay_cateo: boolean
  created_at: string
  fotos: SolicitudFoto[]
}

export interface SolicitudFoto {
  id: string
  tipo_foto: string
  enviado_a: string | null
  estado: string
}

function parseDetenidos(raw: unknown): string {
  if (typeof raw === 'string') {
    try {
      const arr = JSON.parse(raw)
      return Array.isArray(arr) && arr.length > 0 ? (arr[0].nombre || 'Sin nombre') : 'Sin nombre'
    } catch {
      return String(raw || 'Sin nombre')
    }
  }
  if (Array.isArray(raw) && raw.length > 0) return raw[0].nombre || 'Sin nombre'
  return 'Sin nombre'
}

const QUERY_BASE = `SELECT rc.id, rc.ofi_folio_cad, rc.folio_reporte_campo, rc.ofi_tipo_incidente,
  rc.modus_operandi, rc.falta_administrativa, rc.delito, rc.marco_legal,
  rc.ofi_autoridad_recibe, CONCAT(u.name, ' ', u.apellido) AS ofi_oficial_nombre,
  rc.ofi_hay_detencion, rc.ofi_hay_vehiculo, rc.ofi_hay_cateo,
  rc.ofi_detenidos, rc.created_at,
  COALESCE(rc.delito, ord.delito) as delito_denuncia,
  COALESCE(rc.marco_legal, ord.marco_legal) as marco_legal_mostrar
FROM ofi_reportes_campo rc
LEFT JOIN ofi_oficiales o ON o.id = rc.ofi_oficial_id
LEFT JOIN users u ON u.id = o.user_id
LEFT JOIN ofi_reporte_denuncia ord ON ord.reporte_campo_id = rc.id`

export async function getDestinos(): Promise<Dependencia[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, clave, nombre FROM cat_dependencias WHERE tipo = 'externa' AND activo = true AND clave IN ('FISCALIA','JUZGADO_CIVICO') ORDER BY nombre`,
  )
  return r.rows.map((d) => ({ id: Number(d.id), clave: String(d.clave), nombre: String(d.nombre) }))
}

export async function listarReportesConDetenidos(): Promise<ReporteDetenido[]> {
  const r = await query<Record<string, unknown>>(
    `${QUERY_BASE}
     WHERE rc.ofi_detenidos IS NOT NULL
       AND rc.ofi_detenidos::text NOT IN ('[]', '1')
     ORDER BY rc.created_at DESC LIMIT 100`,
  )
  const result: ReporteDetenido[] = []
  for (const row of r.rows) {
    const id = String(row.id)
    const fotos = await query<Record<string, unknown>>(
      `SELECT id, tipo_foto, enviado_a, estado FROM solicitud_fotos WHERE reporte_campo_id = $1 ORDER BY tipo_foto`, [id],
    )
    const nombre = parseDetenidos(row.ofi_detenidos)
    if (nombre === 'Sin nombre' && fotos.rows.length === 0) continue
    result.push(rowToReporte(row, fotos))
  }
  return result
}

export async function obtenerReportePorId(id: string): Promise<ReporteDetenido | null> {
  const r = await query<Record<string, unknown>>(
    `${QUERY_BASE} WHERE rc.id = $1 LIMIT 1`, [id],
  )
  if (!r.rows.length) return null
  const fotos = await query<Record<string, unknown>>(
    `SELECT id, tipo_foto, enviado_a, estado FROM solicitud_fotos WHERE reporte_campo_id = $1 ORDER BY tipo_foto`, [id],
  )
  return rowToReporte(r.rows[0], fotos)
}

function rowToReporte(row: Record<string, unknown>, fotosQ: { rows: Record<string, unknown>[] }): ReporteDetenido {
  const id = String(row.id)
  return {
    id,
    folio_detenido: row.folio_reporte_campo ? String(row.folio_reporte_campo) : 'Sin folio',
    nombre_detenido: parseDetenidos(row.ofi_detenidos),
    tipo_incidente: row.ofi_tipo_incidente ? String(row.ofi_tipo_incidente) : null,
    delito_denuncia: row.delito_denuncia ? String(row.delito_denuncia) : null,
    marco_legal: row.marco_legal_mostrar ? String(row.marco_legal_mostrar) : null,
    falta_administrativa: row.falta_administrativa ? String(row.falta_administrativa) : null,
    modus_operandi: row.modus_operandi ? String(row.modus_operandi) : null,
    autoridad_recibe: row.ofi_autoridad_recibe ? String(row.ofi_autoridad_recibe) : null,
    oficial_nombre: row.ofi_oficial_nombre ? String(row.ofi_oficial_nombre) : null,
    hay_detencion: Boolean(row.ofi_hay_detencion),
    hay_vehiculo: Boolean(row.ofi_hay_vehiculo),
    hay_cateo: Boolean(row.ofi_hay_cateo),
    created_at: String(row.created_at),
    fotos: fotosQ.rows.map(f => ({
      id: String(f.id),
      tipo_foto: String(f.tipo_foto),
      enviado_a: f.enviado_a ? String(f.enviado_a) : null,
      estado: String(f.estado),
    })),
  }
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
    return true
  }
  return true
}

export async function obtenerObtenerSolicitudFoto(reporteCampoId: string, tipoFoto: string) {
  const r = await query<Record<string, unknown>>(
    `SELECT id, estado, enviado_a FROM solicitud_fotos WHERE reporte_campo_id = $1 AND tipo_foto = $2 LIMIT 1`,
    [reporteCampoId, tipoFoto],
  )
  return r.rows[0] as { id: string; estado: string; enviado_a: string } | undefined
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

export async function registrarFichaInteligencia(data: {
  nombreDetenido: string | null
  folio: string | null
  fotoFrontalUrl: string | null
  fotoObjetosUrl: string | null
  fechaNacimiento: string | null
  origen: string | null
  genero: string | null
  escolaridad: string | null
  estadoCivil: string | null
  ocupacion: string | null
  domicilio: string | null
  rasgosParticulares: string | null
  eventosDelictivos: string | null
  fechaHora: string | null
  rnd: string | null
  iph: string | null
  expediente: string | null
  lugarEvento: string | null
  lugarDetencion: string | null
  nexosDelictivos: string | null
  zonaOperacion: string | null
  puestaDisposicion: string | null
  modusOperandi: string | null
  infoAdicional: string | null
  antecedentes: string | null
  faltasAdmin: string | null
  capturadoPor: string | null
}) {
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
