import { query } from '@/lib/db'

export interface Dependencia {
  id: number
  clave: string
  nombre: string
}

export interface SolicitudDetenido {
  id: string
  nombre_detenido: string
  folio: string
  tipo_evento: string | null
  delitos: string | null
  falta_admin: string | null
  modus_operandi: string | null
  solicitado_por: string
  creado_en: string
  completado_en: string | null
  fotos: SolicitudFoto[]
}

export interface SolicitudFoto {
  id: string
  tipo_foto: string
  enviado_a: string | null
  estado: string
}

export async function getDestinos(): Promise<Dependencia[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, clave, nombre FROM cat_dependencias WHERE tipo = 'externa' AND activo = true AND clave IN ('FISCALIA','JUZGADO_CIVICO') ORDER BY nombre`,
  )
  return r.rows.map((d) => ({ id: Number(d.id), clave: String(d.clave), nombre: String(d.nombre) }))
}

export async function crearSolicitud(data: {
  nombre_detenido: string
  folio: string
  tipo_evento: string | null
  delitos: string | null
  falta_admin: string | null
  modus_operandi: string | null
  solicitado_por: string
}): Promise<string> {
  const r = await query<{ id: string }>(
    `INSERT INTO solicitudes_detenido (nombre_detenido, folio, tipo_evento, delitos, falta_admin, modus_operandi, solicitado_por)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [data.nombre_detenido, data.folio, data.tipo_evento, data.delitos, data.falta_admin, data.modus_operandi, data.solicitado_por],
  )
  const id = r.rows[0].id
  // Crear 3 filas de fotos automáticamente
  for (const tipo of ['frontal', 'derecho', 'izquierdo']) {
    await query(
      `INSERT INTO solicitud_fotos (solicitud_id, tipo_foto, estado) VALUES ($1, $2, 'pendiente') ON CONFLICT (solicitud_id, tipo_foto) DO NOTHING`,
      [id, tipo],
    )
  }
  return id
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

export async function listarPendientes(): Promise<SolicitudDetenido[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT DISTINCT sd.* FROM solicitudes_detenido sd
     INNER JOIN solicitud_fotos sf ON sf.solicitud_id = sd.id
     WHERE sf.estado IN ('pendiente','enviado','rechazado')
     ORDER BY sd.creado_en DESC LIMIT 50`,
  )
  return await Promise.all(r.rows.map(r => rowToDetenidoConFotos(r)))
}

export async function listarCompletadas(): Promise<SolicitudDetenido[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT DISTINCT sd.* FROM solicitudes_detenido sd
     WHERE NOT EXISTS (
       SELECT 1 FROM solicitud_fotos sf WHERE sf.solicitud_id = sd.id AND sf.estado IN ('pendiente','enviado','rechazado')
     )
     ORDER BY sd.creado_en DESC LIMIT 50`,
  )
  return await Promise.all(r.rows.map(r => rowToDetenidoConFotos(r)))
}

export async function obtenerDetenidoPorId(id: string): Promise<SolicitudDetenido | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM solicitudes_detenido WHERE id = $1`, [id],
  )
  if (!r.rows.length) return null
  return await rowToDetenidoConFotos(r.rows[0])
}

async function rowToDetenidoConFotos(r: Record<string, unknown>): Promise<SolicitudDetenido> {
  const id = String(r.id)
  const fotos = await query<Record<string, unknown>>(
    `SELECT id, tipo_foto, enviado_a, estado FROM solicitud_fotos WHERE solicitud_id = $1 ORDER BY tipo_foto`,
    [id],
  )
  return {
    id,
    nombre_detenido: String(r.nombre_detenido),
    folio: String(r.folio),
    tipo_evento: r.tipo_evento ? String(r.tipo_evento) : null,
    delitos: r.delitos ? String(r.delitos) : null,
    falta_admin: r.falta_admin ? String(r.falta_admin) : null,
    modus_operandi: r.modus_operandi ? String(r.modus_operandi) : null,
    solicitado_por: String(r.solicitado_por),
    creado_en: String(r.creado_en),
    completado_en: r.completado_en ? String(r.completado_en) : null,
    fotos: fotos.rows.map(f => ({
      id: String(f.id),
      tipo_foto: String(f.tipo_foto),
      enviado_a: f.enviado_a ? String(f.enviado_a) : null,
      estado: String(f.estado),
    })),
  }
}
