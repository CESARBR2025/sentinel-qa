import {
  obtenerSolicitudesPendientes,
  obtenerSolicitudesSinEvidencias,
  obtenerSolicitudesConEvidencias,
  obtenerSolicitudesFinalizadas,
  actualizarEstadoSolicitud,
  actualizarSolicitudConEvidencias,
  obtenerDetalleAsegurado,
  actualizarDetallesAsegurado,
  listarAsegurados,
  obtenerDetalleAseguradoCompleto,
  obtenerDetenidosGuardados,
  guardarDetenidosDirecciones,
  generarFolioAsegurados,
  listarLiberaciones,
  obtenerDetalleInfraccionVia,
  listarAseguradosConDisposicion,
  obtenerPuestaDisposicionPorReporte,
  guardarPuestaDisposicion,
} from './repository'
import { rowToSolicitud } from './mapper'
import { tienePermiso as tienePermisoFiscalia } from './permisos'
import { tienePermiso as tienePermisoJuzgado } from '@/lib/agente_juzgado/permisos'
import type { SolicitudEvidencia, DetalleAsegurado, DatosAseguradoInput, AseguradoRow, DetalleAseguradoCompleto, DetenidoDireccionInput, PuestaDisposicionInput, PuestaDisposicionRow } from './types'

export async function verificarRolFiscalia(userId: string): Promise<boolean> {
  return tienePermisoFiscalia(userId, 'fiscalia', 'ver')
}

export async function verificarRolJuzgado(userId: string): Promise<boolean> {
  return tienePermisoJuzgado(userId, 'juzgado', 'ver')
}

export async function listarSolicitudesPendientes(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesPendientes()
  return rows.map(rowToSolicitud)
}

export async function listarSolicitudesSinEvidencias(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesSinEvidencias()
  return rows.map(rowToSolicitud)
}

export async function listarSolicitudesFinalizadas(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesFinalizadas()
  return rows.map(rowToSolicitud)
}

export async function listarSolicitudesConEvidencias(): Promise<SolicitudEvidencia[]> {
  const rows = await obtenerSolicitudesConEvidencias()
  return rows.map(rowToSolicitud)
}

export async function tomarCaso(id: string): Promise<void> {
  await actualizarEstadoSolicitud(id, 'EN_ANALISIS', 'SIN_SOLICITUD')
}

export async function pedirEvidencias(id: string, evidencias: string): Promise<void> {
  await actualizarSolicitudConEvidencias(id, 'EN_ANALISIS', 'PENDIENTE_MONITORISTA', evidencias)
}

export async function obtenerDatosAsegurado(solicitudId: string): Promise<DetalleAsegurado | null> {
  return obtenerDetalleAsegurado(solicitudId)
}

export async function guardarDetallesAsegurado(id: string, datos: DatosAseguradoInput): Promise<void> {
  await actualizarDetallesAsegurado(id, datos)
}

function parseDetenidos(raw: unknown): { nombre?: string }[] {
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) } catch { return [] }
  }
  if (Array.isArray(raw)) return raw
  return []
}

export async function listarAseguradosPendientes(autoridad: string = 'FISCALIA'): Promise<AseguradoRow[]> {
  return listarAsegurados(true, autoridad)
}

export async function listarAseguradosCompletados(autoridad: string = 'FISCALIA'): Promise<AseguradoRow[]> {
  return listarAsegurados(false, autoridad)
}

export async function obtenerDetalleAseguradoCompletoService(
  reporteCampoId: string,
): Promise<DetalleAseguradoCompleto | null> {
  const row = await obtenerDetalleAseguradoCompleto(reporteCampoId)
  if (!row) return null

  let folioReporteAsegurados = row.folio_reporte_asegurados
    ? String(row.folio_reporte_asegurados)
    : null
  if (!folioReporteAsegurados) {
    folioReporteAsegurados = await generarFolioAsegurados()
  }

  const detenidos = parseDetenidos(row.ofi_detenidos)
  const detenidosGuardados = await obtenerDetenidosGuardados(reporteCampoId)

  const ahora = new Date()
  const fechaStr = `${ahora.getFullYear()}-${String(ahora.getMonth() + 1).padStart(2, '0')}-${String(ahora.getDate()).padStart(2, '0')}`
  const horaStr = `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`

  return {
    reporteCampoId: String(row.reporte_campo_id ?? ''),
    folioReporteAsegurados,
    folioReporteCampo: row.folio_reporte_campo ? String(row.folio_reporte_campo) : null,
    folioDenuncia: row.folio_denuncia ? String(row.folio_denuncia) : null,
    iph: row.iph ? String(row.iph) : null,
    folioSija: row.folio_sija ? String(row.folio_sija) : null,
    folioRemision: row.folio_remision ? String(row.folio_remision) : null,
    marcoLegal: row.marco_legal ? String(row.marco_legal) : null,
    registroTableta: row.registro_tableta ? String(row.registro_tableta) : null,
    fechaHoy: fechaStr,
    horaAhora: horaStr,
    lugarDetencionCalle: row.lugar_calle ? String(row.lugar_calle) : null,
    lugarDetencionColonia: row.lugar_colonia ? String(row.lugar_colonia) : null,
    lugarLatitud: row.ofi_latitud != null ? Number(row.ofi_latitud) : null,
    lugarLongitud: row.ofi_longitud != null ? Number(row.ofi_longitud) : null,
    oficialNombre: row.ofi_oficial_nombre ? String(row.ofi_oficial_nombre) : null,
    oficialApPaterno: null,
    oficialApMaterno: null,
    oficialPlaca: row.ofi_placa_unidad_asignada ? String(row.ofi_placa_unidad_asignada) : null,
    oficialNomina: row.no_nomina ? String(row.no_nomina) : null,
    capturadoPorNombre: row.capturado_por_nombre ? String(row.capturado_por_nombre) : null,
    detenidos,
    detenidosDirecciones: detenidosGuardados,
  }
}

export async function guardarDetallesAseguradosService(
  reporteCampoId: string,
  detenidos: DetenidoDireccionInput[],
  folio: string,
): Promise<string> {
  await guardarDetenidosDirecciones(reporteCampoId, detenidos, folio)
  return folio
}

export async function obtenerLiberaciones() {
  return listarLiberaciones()
}

export async function obtenerDetalleInfraccionViaService(id: string) {
  return obtenerDetalleInfraccionVia(id)
}

export async function listarAseguradosConDisposicionService(autoridad: string = 'FISCALIA'): Promise<(AseguradoRow & { puestaDisposicionId: string | null })[]> {
  return listarAseguradosConDisposicion(autoridad)
}

export async function obtenerPuestaDisposicionService(reporteCampoId: string): Promise<PuestaDisposicionRow | null> {
  return obtenerPuestaDisposicionPorReporte(reporteCampoId)
}

export async function guardarPuestaDisposicionService(
  reporteCampoId: string,
  datos: PuestaDisposicionInput,
  creadoPor: string,
): Promise<void> {
  await guardarPuestaDisposicion(reporteCampoId, datos, creadoPor)
}
