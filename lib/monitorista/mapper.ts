import type {
  SolicitudEvidencia, Evidencia, HistorialEntry, DenunciaDetalle,
  SolicitudEvidenciaJson, EvidenciaArchivo, ReporteDetenido, SolicitudFoto,
  Dependencia, IncidenteCamara, Turno, IphDetenido, EvidenciaDetenido,
  PrellenadoCompleto,
} from './types'

function str(val: unknown): string | null {
  if (val === null || val === undefined) return null
  return String(val)
}

function num(val: unknown): number | null {
  if (val === null || val === undefined) return null
  const n = Number(val)
  return Number.isNaN(n) ? null : n
}

function bool(val: unknown): boolean {
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') return val === 'true' || val === '1'
  return Boolean(val)
}

function parseTurno(t: unknown): Turno {
  const s = String(t ?? '')
  if (s === 'MATUTINO' || s === 'VESPERTINO' || s === 'NOCTURNO') return s
  return 'MATUTINO'
}

export function parseSolicitudesJson(jsonb: unknown): SolicitudEvidenciaJson[] {
  if (!jsonb) return []
  try {
    const parsed = typeof jsonb === 'string' ? JSON.parse(jsonb) : jsonb
    if (!Array.isArray(parsed)) return []
    return parsed.map((item: Record<string, unknown>) => ({
      solicitudId: Number(item.solicitud_id ?? 0),
      fechaPeticion: str(item.fecha_peticion) ?? '',
      colonia: str(item.colonia) ?? '',
      calle: str(item.calle) ?? '',
      numero: str(item.numero) ?? '',
      horaInicio: str(item.hora_inicio) ?? '',
      horaFin: str(item.hora_fin) ?? '',
      atendida: bool(item.atendida),
    }))
  } catch {
    return []
  }
}

export function rowToSolicitudEvidencia(row: Record<string, unknown>): SolicitudEvidencia {
  return {
    id: str(row.id) ?? '',
    incidenteId: str(row.incidente_id) ?? '',
    folioIncidente: str(row.folio_incidente),
    solicitadoNombre: str(row.solicitado_nombre) ?? '',
    descripcion: str(row.descripcion) ?? '',
    status: str(row.status) ?? '',
    creadoEn: str(row.creado_en),
    completadoEn: str(row.completado_en),
    totalEvidencias: num(row.total_evidencias) ?? 0,
  }
}

export function rowToEvidencia(row: Record<string, unknown>): Evidencia {
  return {
    id: str(row.id) ?? '',
    tipo: str(row.tipo) ?? '',
    nombreOriginal: str(row.nombre_original),
    urlExpediente: str(row.url_expediente),
    subidoPorNombre: str(row.subido_por_nombre),
    creadoEn: str(row.creado_en),
  }
}

export function rowToHistorialEntry(row: Record<string, unknown>): HistorialEntry {
  return {
    id: str(row.id) ?? '',
    accion: str(row.accion) ?? '',
    incidenteId: str(row.incidente_id),
    solicitudId: str(row.solicitud_id),
    creadoEn: str(row.creado_en),
    monitoristaNombre: str(row.monitorista_nombre),
    folioIncidente: str(row.folio_incidente) ?? str(row.folioIncidente),
    folioDetenido: str(row.folio_detenido),
    icFecha: str(row.ic_fecha),
    icTurno: str(row.ic_turno),
  }
}

export function rowToDenunciaDetalle(row: Record<string, unknown>): DenunciaDetalle {
  return {
    id: str(row.id) ?? '',
    folioDenuncia: str(row.folio_denuncia) ?? '',
    iph: str(row.iph),
    delito: str(row.delito),
    tipoEvento: str(row.tipo_evento),
    lugarHecho: str(row.lugar_hecho),
    coloniaHecho: str(row.colonia_hecho),
    fechaReporte: str(row.fecha_reporte),
    horaReporte: str(row.hora_reporte),
    policiaACargo: str(row.policia_a_cargo),
    capturadoPor: str(row.capturado_por),
    estadoTramite: str(row.estado_tramite) ?? '',
    estadoEvidencia: str(row.estado_evidencia) ?? '',
    createdAt: str(row.created_at) ?? '',
    monitoristaFechasRequeridas: parseSolicitudesJson(row.monitorista_fechas_requeridas),
  }
}

export function rowToEvidenciaArchivo(row: Record<string, unknown>): EvidenciaArchivo {
  const parts = String(row.solicitud_id ?? '').split('-')
  const sid = parseInt(parts[2] ?? '0', 16)
  return {
    id: Number(row.id),
    solicitudId: sid || 0,
    urlArchivo: str(row.url_archivo) ?? '',
    nombreArchivo: str(row.nombre_archivo),
  }
}

export function rowToDependencia(row: Record<string, unknown>): Dependencia {
  return {
    id: Number(row.id),
    clave: str(row.clave) ?? '',
    nombre: str(row.nombre) ?? '',
  }
}

export function rowToSolicitudFotos(rows: Record<string, unknown>[]): SolicitudFoto[] {
  return rows.map(r => ({
    id: str(r.id) ?? '',
    tipoFoto: str(r.tipo_foto) ?? '',
    enviadoA: str(r.enviado_a),
    estado: str(r.estado) ?? '',
  }))
}

function parseDetenidos(raw: unknown): string {
  if (typeof raw === 'string') {
    try {
      const arr = JSON.parse(raw)
      return Array.isArray(arr) && arr.length > 0 ? (arr[0].nombre || 'Sin nombre') : 'Sin nombre'
    } catch {
      return str(raw) || 'Sin nombre'
    }
  }
  if (Array.isArray(raw) && raw.length > 0) return raw[0].nombre || 'Sin nombre'
  return 'Sin nombre'
}

export function rowToReporteDetenido(
  row: Record<string, unknown>,
  fotos: SolicitudFoto[],
): ReporteDetenido {
  return {
    id: str(row.id) ?? '',
    folioDetenido: str(row.folio_reporte_campo) ?? 'Sin folio',
    nombreDetenido: parseDetenidos(row.ofi_detenidos),
    tipoIncidente: str(row.ofi_tipo_incidente),
    delitoDenuncia: str(row.delito_denuncia),
    marcoLegal: str(row.marco_legal_mostrar),
    faltaAdministrativa: str(row.falta_administrativa),
    modusOperandi: str(row.modus_operandi),
    autoridadRecibe: str(row.ofi_autoridad_recibe),
    oficialNombre: str(row.ofi_oficial_nombre),
    hayDetencion: bool(row.ofi_hay_detencion),
    hayVehiculo: bool(row.ofi_hay_vehiculo),
    hayCateo: bool(row.ofi_hay_cateo),
    createdAt: str(row.created_at) ?? '',
    fotos,
  }
}

export function rowToIncidenteCamara(row: Record<string, unknown>): IncidenteCamara {
  function fmtFecha(v: unknown): string {
    if (v instanceof Date) return v.toISOString().slice(0, 10)
    if (typeof v === 'string') return v.slice(0, 10)
    return String(v).slice(0, 10)
  }
  return {
    id: str(row.id) ?? '',
    fecha: fmtFecha(row.fecha),
    turno: parseTurno(row.turno),
    registradoPor: str(row.registrado_por) ?? '',
    personasSinNovedad: num(row.personas_sin_novedad) ?? 0,
    personasConAntecedentes: num(row.personas_con_antecedentes) ?? 0,
    totalPersonasRevisadas: num(row.total_personas_revisadas) ?? 0,
    vehiculosRevisar: num(row.vehiculos_revisar) ?? 0,
    vehiculosRepuve: num(row.vehiculos_repuve) ?? 0,
    motosRevisadas: num(row.motos_revisadas) ?? 0,
    persecuciones: num(row.persecuciones) ?? 0,
    aseguradosCamara: num(row.asegurados_camara) ?? 0,
    vehiculosRecuperados: num(row.vehiculos_recuperados) ?? 0,
    incendios: num(row.incendios) ?? 0,
    hechosTransito: num(row.hechos_transito) ?? 0,
  }
}

export function rowToIphDetenido(row: Record<string, unknown>): IphDetenido {
  return {
    id: str(row.id) ?? '',
    folioIPH: str(row.folio_iph) ?? str(row.folioIPH),
    alias: str(row.alias),
    delito: str(row.delito),
    fechaEvento: str(row.fecha_evento) ?? str(row.fechaEvento),
    genero: str(row.genero),
  }
}

export function rowToEvidenciaDetenido(row: Record<string, unknown>): EvidenciaDetenido {
  return {
    id: str(row.id) ?? '',
    tipoFoto: str(row.tipo_foto) ?? '',
    urlArchivo: str(row.url_archivo),
    nombreArchivo: str(row.nombre_archivo),
    subidoPor: str(row.subido_por),
    rolSubio: str(row.rol_subio),
  }
}

export function rowToPrellenadoCompleto(row: Record<string, unknown>): PrellenadoCompleto {
  return {
    nombreDetenido: str(row.nombreDetenido),
    folio: str(row.folio),
    fechaNacimiento: str(row.fechaNacimiento),
    origen: str(row.origen),
    genero: str(row.genero),
    domicilio: str(row.domicilio),
    eventosDelictivos: str(row.eventosDelictivos),
    fechaHora: str(row.fechaHora),
    rnd: str(row.rnd),
    expediente: str(row.expediente),
    lugarEvento: str(row.lugarEvento),
    lugarDetencion: str(row.lugarDetencion),
    iph: str(row.iph),
    nexosDelictivos: str(row.nexosDelictivos),
    zonaOperacion: str(row.zonaOperacion),
    puestaDisposicion: str(row.puestaDisposicion),
    modusOperandi: str(row.modusOperandi),
    infoAdicional: str(row.infoAdicional),
    antecedentes: str(row.antecedentes),
    faltasAdmin: str(row.faltasAdmin),
  }
}
