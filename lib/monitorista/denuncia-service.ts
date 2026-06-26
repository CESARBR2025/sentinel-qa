import { query } from '@/lib/db'
import { obtenerGuestToken, subirArchivoExpediente } from './expediente'

export interface DenunciaSolicitud {
  id: string
  folioDenuncia: string
  estadoEvidencia: string
  estadoTramite: string
  createdAt: string
  monitoristaFechasRequeridas: SolicitudEvidencia[]
}

export interface SolicitudEvidencia {
  solicitud_id: number
  fecha_peticion: string
  colonia: string
  calle: string
  numero: string
  hora_inicio: string
  hora_fin: string
  atendida: boolean
}

function parsearSolicitudes(jsonb: unknown): SolicitudEvidencia[] {
  if (!jsonb) return []
  try {
    const parsed = typeof jsonb === 'string' ? JSON.parse(jsonb) : jsonb
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function obtenerDenunciasPendientes(): Promise<DenunciaSolicitud[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, folio_denuncia, estado_tramite, estado_evidencia, created_at, monitorista_fechas_requeridas
     FROM ofi_reporte_denuncia
     WHERE estado_evidencia = 'PENDIENTE_MONITORISTA'
     ORDER BY created_at DESC
     LIMIT 50`,
  )
  return result.rows.map((r) => ({
    id: String(r.id),
    folioDenuncia: String(r.folio_denuncia ?? ''),
    estadoEvidencia: String(r.estado_evidencia ?? ''),
    estadoTramite: String(r.estado_tramite ?? ''),
    createdAt: String(r.created_at ?? ''),
    monitoristaFechasRequeridas: parsearSolicitudes(r.monitorista_fechas_requeridas),
  }))
}

export async function obtenerDenunciasAtendidas(): Promise<DenunciaSolicitud[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, folio_denuncia, estado_tramite, estado_evidencia, created_at, monitorista_fechas_requeridas
     FROM ofi_reporte_denuncia
     WHERE estado_evidencia IN ('EVIDENCIA_ENVIADA', 'FINALIZADO')
       AND monitorista_fechas_requeridas IS NOT NULL
     ORDER BY updated_at DESC
     LIMIT 50`,
  )
  return result.rows.map((r) => ({
    id: String(r.id),
    folioDenuncia: String(r.folio_denuncia ?? ''),
    estadoEvidencia: String(r.estado_evidencia ?? ''),
    estadoTramite: String(r.estado_tramite ?? ''),
    createdAt: String(r.created_at ?? ''),
    monitoristaFechasRequeridas: parsearSolicitudes(r.monitorista_fechas_requeridas),
  }))
}

export async function marcarSolicitudAtendida(
  denunciaId: string,
  solicitudId: number,
): Promise<void> {
  // Obtener JSONB actual
  const result = await query<Record<string, unknown>>(
    `SELECT monitorista_fechas_requeridas FROM ofi_reporte_denuncia WHERE id = $1`,
    [denunciaId],
  )
  if (result.rows.length === 0) throw new Error('Denuncia no encontrada')

  const fechas = parsearSolicitudes(result.rows[0].monitorista_fechas_requeridas)
  const actualizadas = fechas.map((f) =>
    f.solicitud_id === solicitudId ? { ...f, atendida: true } : f,
  )

  await query(
    `UPDATE ofi_reporte_denuncia
     SET monitorista_fechas_requeridas = $1::jsonb, updated_at = NOW()
     WHERE id = $2`,
    [JSON.stringify(actualizadas), denunciaId],
  )

  // Si todas están atendidas, cambiar estado_evidencia y estado_tramite
  const todasAtendidas = actualizadas.every((f) => f.atendida)
  if (todasAtendidas) {
    await query(
      `UPDATE ofi_reporte_denuncia
       SET estado_evidencia = 'EVIDENCIA_ENVIADA', estado_tramite = 'EN_ANALISIS', updated_at = NOW()
       WHERE id = $1`,
      [denunciaId],
    )
  }
}

export interface DenunciaDetalle {
  id: string
  folioDenuncia: string
  iph: string | null
  delito: string | null
  tipoEvento: string | null
  lugarHecho: string | null
  coloniaHecho: string | null
  fechaReporte: string | null
  horaReporte: string | null
  policiaACargo: string | null
  capturadoPor: string | null
  estadoTramite: string
  estadoEvidencia: string
  createdAt: string
  monitoristaFechasRequeridas: SolicitudEvidencia[]
}

export async function obtenerDenunciaPorId(id: string): Promise<DenunciaDetalle | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, folio_denuncia, iph, delito, tipo_evento, lugar_hecho, colonia_hecho,
            fecha_reporte, hora_reporte, policia_a_cargo, capturado_por,
            estado_tramite, estado_evidencia, created_at, monitorista_fechas_requeridas
     FROM ofi_reporte_denuncia
     WHERE id = $1`,
    [id],
  )
  if (result.rows.length === 0) return null
  const r = result.rows[0]
  return {
    id: String(r.id),
    folioDenuncia: String(r.folio_denuncia ?? ''),
    iph: r.iph ? String(r.iph) : null,
    delito: r.delito ? String(r.delito) : null,
    tipoEvento: r.tipo_evento ? String(r.tipo_evento) : null,
    lugarHecho: r.lugar_hecho ? String(r.lugar_hecho) : null,
    coloniaHecho: r.colonia_hecho ? String(r.colonia_hecho) : null,
    fechaReporte: r.fecha_reporte ? String(r.fecha_reporte) : null,
    horaReporte: r.hora_reporte ? String(r.hora_reporte) : null,
    policiaACargo: r.policia_a_cargo ? String(r.policia_a_cargo) : null,
    capturadoPor: r.capturado_por ? String(r.capturado_por) : null,
    estadoTramite: String(r.estado_tramite ?? ''),
    estadoEvidencia: String(r.estado_evidencia ?? ''),
    createdAt: String(r.created_at ?? ''),
    monitoristaFechasRequeridas: parsearSolicitudes(r.monitorista_fechas_requeridas),
  }
}

export interface EvidenciaArchivo {
  id: number
  solicitudId: number
  urlArchivo: string
  nombreArchivo: string | null
}

export async function obtenerEvidenciasDenuncia(denunciaId: string): Promise<EvidenciaArchivo[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT id, solicitud_id, url_archivo, nombre_archivo
     FROM moni_evidencias_denuncia
     WHERE ofi_reporte_denuncia_id = $1
     ORDER BY id`,
    [denunciaId],
  )
  return result.rows.map((r) => {
    // Extraer solicitud_id desde el UUID: posición 3 (xxxx-xxxx-{solicitud_id}-xxxx-xxxxxxxxxxxx)
    const parts = String(r.solicitud_id ?? '').split('-')
    const sid = parseInt(parts[2] ?? '0', 16)
    return {
      id: Number(r.id),
      solicitudId: sid || 0,
      urlArchivo: String(r.url_archivo ?? ''),
      nombreArchivo: r.nombre_archivo ? String(r.nombre_archivo) : null,
    }
  })
}

function solicitudIdToUuid(denunciaId: string, solicitudId: number): string {
  const d = denunciaId.replace(/-/g, '').substring(0, 16).padEnd(16, '0')
  const s = solicitudId.toString(16).padStart(4, '0').slice(-4)
  return `00000000-0000-${s}-${d.substring(0, 4)}-${d.substring(4, 16)}`
}

export async function subirEvidenciaDenuncia(
  monitoristaId: string,
  monitoristaNombre: string,
  denunciaId: string,
  solicitudId: number,
  archivoBuffer: Buffer,
  nombreOriginal: string,
  mime: string,
  tipo: string,
): Promise<string> {
  const token = await obtenerGuestToken(monitoristaNombre)
  const url = await subirArchivoExpediente(
    token,
    { buffer: archivoBuffer, nombre: nombreOriginal, tipo: mime },
    denunciaId.substring(0, 8),
    `EVIDENCIA_${tipo.toUpperCase()}`,
  )

  await query(
    `INSERT INTO moni_evidencias_denuncia (ofi_reporte_denuncia_id, solicitud_id, url_archivo, nombre_archivo)
     VALUES ($1, $2, $3, $4)`,
    [denunciaId, solicitudIdToUuid(denunciaId, solicitudId), url, nombreOriginal],
  )

  await query(
    `INSERT INTO monitorista_historial (monitorista_id, accion, incidente_id)
     VALUES ($1, 'evidencia_subida', $2)`,
    [monitoristaId, denunciaId],
  )

  return url
}
