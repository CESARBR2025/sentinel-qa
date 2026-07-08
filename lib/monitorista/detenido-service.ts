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

export async function rechazarFoto(fotoId: string): Promise<void> {
  await query(
    `UPDATE solicitud_fotos SET estado = 'rechazado' WHERE id = $1 AND estado = 'enviado'`,
    [fotoId],
  )
}
