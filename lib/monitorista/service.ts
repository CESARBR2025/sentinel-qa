import { query } from '@/lib/db'
import { obtenerGuestToken, subirArchivoExpediente } from './expediente'
import type {
  DenunciaDetalle, EvidenciaArchivo, Dependencia, ReporteDetenido,
  SolicitudFoto, IncidenteCamara, Turno,
} from './types'
import {
  rowToDenunciaDetalle, rowToEvidenciaArchivo, rowToDependencia,
  rowToReporteDetenido, rowToSolicitudFotos, rowToIncidenteCamara,
  parseSolicitudesJson,
} from './mapper'
import {
  obtenerDenunciasPendientesRaw, obtenerDenunciasAtendidasRaw,
  obtenerDenunciaPorIdRaw, obtenerEvidenciasDenunciaRaw,
  getDestinosRaw, listarReportesConDetenidosRaw, obtenerReportePorIdRaw,
  obtenerSolicitudFotosRaw, listarRegistrosRaw, obtenerRegistroRaw,
  obtenerRegistroPorFechaTurnoRaw,
  insertHistorial,
} from './repository'

export const TURNOS = ['MATUTINO', 'VESPERTINO', 'NOCTURNO'] as const

// ==================== Denuncia service ====================

export async function obtenerDenunciasPendientes(): Promise<DenunciaDetalle[]> {
  const rows = await obtenerDenunciasPendientesRaw()
  return rows.map(rowToDenunciaDetalle)
}

export async function obtenerDenunciasAtendidas(): Promise<DenunciaDetalle[]> {
  const rows = await obtenerDenunciasAtendidasRaw()
  return rows.map(rowToDenunciaDetalle)
}

export async function obtenerDenunciaPorId(id: string): Promise<DenunciaDetalle | null> {
  const row = await obtenerDenunciaPorIdRaw(id)
  return row ? rowToDenunciaDetalle(row) : null
}

export async function obtenerEvidenciasDenuncia(denunciaId: string): Promise<EvidenciaArchivo[]> {
  const rows = await obtenerEvidenciasDenunciaRaw(denunciaId)
  return rows.map(rowToEvidenciaArchivo)
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

  await insertHistorial(monitoristaId, 'evidencia_subida', denunciaId)

  return url
}

// Re-export marcarSolicitudAtendida from repository
export { marcarSolicitudAtendida } from './repository'

// ==================== Detenido service ====================

export async function getDestinos(): Promise<Dependencia[]> {
  const rows = await getDestinosRaw()
  return rows.map(rowToDependencia)
}

export async function listarReportesConDetenidos(): Promise<ReporteDetenido[]> {
  const rows = await listarReportesConDetenidosRaw()
  const result: ReporteDetenido[] = []
  for (const row of rows) {
    const id = String(row.id)
    const fotosRaw = await obtenerSolicitudFotosRaw(id)
    const fotos = rowToSolicitudFotos(fotosRaw)
    const nombre = parseDetenidos(row.ofi_detenidos)
    if (nombre === 'Sin nombre' && fotosRaw.length === 0) continue
    result.push(rowToReporteDetenido(row, fotos))
  }
  return result
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

export async function obtenerReportePorId(id: string): Promise<ReporteDetenido | null> {
  const row = await obtenerReportePorIdRaw(id)
  if (!row) return null
  const fotosRaw = await obtenerSolicitudFotosRaw(id)
  const fotos = rowToSolicitudFotos(fotosRaw)
  return rowToReporteDetenido(row, fotos)
}

// ==================== Incidentes Cámara service ====================

export async function listarRegistros(turno?: Turno): Promise<IncidenteCamara[]> {
  const rows = await listarRegistrosRaw(turno)
  return rows.map(rowToIncidenteCamara)
}

export async function obtenerRegistro(id: string): Promise<IncidenteCamara | null> {
  const row = await obtenerRegistroRaw(id)
  return row ? rowToIncidenteCamara(row) : null
}

export async function obtenerRegistroPorFechaTurno(fecha: string, turno: Turno): Promise<IncidenteCamara | null> {
  const row = await obtenerRegistroPorFechaTurnoRaw(fecha, turno)
  return row ? rowToIncidenteCamara(row) : null
}

export async function crearRegistro(data: {
  fecha: string
  turno: Turno
  registradoPor: string
  personasSinNovedad?: number
  personasConAntecedentes?: number
  totalPersonasRevisadas?: number
  vehiculosRevisar?: number
  vehiculosRepuve?: number
  motosRevisadas?: number
  persecuciones?: number
  aseguradosCamara?: number
  vehiculosRecuperados?: number
  incendios?: number
  hechosTransito?: number
}): Promise<string> {
  const r = await query<{ id: string }>(
    `INSERT INTO incidentes_camara (fecha, turno, registrado_por, personas_sin_novedad, personas_con_antecedentes, total_personas_revisadas, vehiculos_revisar, vehiculos_repuve, motos_revisadas, persecuciones, asegurados_camara, vehiculos_recuperados, incendios, hechos_transito)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
    [
      data.fecha, data.turno, data.registradoPor,
      data.personasSinNovedad ?? 0,
      data.personasConAntecedentes ?? 0,
      data.totalPersonasRevisadas ?? 0,
      data.vehiculosRevisar ?? 0,
      data.vehiculosRepuve ?? 0,
      data.motosRevisadas ?? 0,
      data.persecuciones ?? 0,
      data.aseguradosCamara ?? 0,
      data.vehiculosRecuperados ?? 0,
      data.incendios ?? 0,
      data.hechosTransito ?? 0,
    ],
  )
  return r.rows[0].id
}

export async function actualizarRegistro(id: string, data: {
  fecha?: string
  turno?: Turno
  personasSinNovedad?: number
  personasConAntecedentes?: number
  totalPersonasRevisadas?: number
  vehiculosRevisar?: number
  vehiculosRepuve?: number
  motosRevisadas?: number
  persecuciones?: number
  aseguradosCamara?: number
  vehiculosRecuperados?: number
  incendios?: number
  hechosTransito?: number
}): Promise<void> {
  const cols: string[] = []
  const params: unknown[] = []
  let idx = 1
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) {
      cols.push(`${camelToSnake(k)} = $${idx++}`)
      params.push(v)
    }
  }
  if (cols.length === 0) return
  params.push(id)
  await query(
    `UPDATE incidentes_camara SET ${cols.join(', ')} WHERE id = $${idx}`, params,
  )
}

function camelToSnake(s: string): string {
  return s.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)
}
