import type {
  BodyCam, EstadoFuerzaConcepto, MedioCanalizacion, Radio, RolAsignacion,
  RolEstadoFuerza, RolObservacion, RolServicio, Sector,
  ServiceRow, TipoEmergencia, TipoObservacion,
} from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  return String(val)
}

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null
  const n = Number(val)
  return Number.isNaN(n) ? null : n
}

function toBool(val: unknown): boolean {
  if (typeof val === 'boolean') return val
  if (typeof val === 'string') return val === 'true'
  return Boolean(val)
}

export function rowToServiceRow(row: Record<string, unknown>): ServiceRow {
  return {
    id: String(row.id ?? ''),
    unidad: String(row.unidad ?? ''),
    nomina: String(row.nomina ?? ''),
    nombre: String(row.nombre ?? ''),
    zona: String(row.zona ?? ''),
    gpsRadio: String(row.gps_radio ?? ''),
    bodyCam: String(row.body_cam ?? ''),
  }
}

export function rowToRolServicio(row: Record<string, unknown>): RolServicio {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    folioConsecutivo: Number(row.folio_consecutivo ?? 0),
    turno: String(row.turno ?? ''),
    horarioInicio: toStr(row.horario_inicio),
    horarioFin: toStr(row.horario_fin),
    responsableTurno: toStr(row.responsable_turno),
    sectorId: toNum(row.sector_id) as number | null,
    fecha: toStr(row.fecha) ?? '',
    fundamentoLegal: toStr(row.fundamento_legal),
    status: String(row.status ?? ''),
    creadoPor: String(row.creado_por ?? ''),
    firmaResponsableUrl: toStr(row.firma_responsable_url),
    firmaJefeSectorialUrl: toStr(row.firma_jefe_sectorial_url),
    firmadoPor: toStr(row.firmado_por),
    firmadoEn: toStr(row.firmado_en),
    actualizadoEn: toStr(row.actualizado_en),
    creadoEn: toStr(row.creado_en) ?? '',
  }
}

export function rowToRolAsignacion(row: Record<string, unknown>): RolAsignacion {
  return {
    id: String(row.id ?? ''),
    rolId: String(row.rol_id ?? ''),
    seccion: String(row.seccion ?? ''),
    unidadExtId: toStr(row.unidad_ext_id),
    unidadPlaca: toStr(row.unidad_placa),
    elementoExtId: toStr(row.elemento_ext_id),
    elementoNomina: toStr(row.elemento_nomina),
    elementoNombre: toStr(row.elemento_nombre),
    zona: toStr(row.zona),
    servicio: toStr(row.servicio),
    radioId: toNum(row.radio_id) as number | null,
    bodyCamId: toNum(row.body_cam_id) as number | null,
    orden: Number(row.orden ?? 0),
  }
}

export function rowToRolEstadoFuerza(row: Record<string, unknown>): RolEstadoFuerza {
  return {
    id: String(row.id ?? ''),
    rolId: String(row.rol_id ?? ''),
    conceptoId: Number(row.concepto_id ?? 0),
    cantidad: Number(row.cantidad ?? 0),
  }
}

export function rowToRolObservacion(row: Record<string, unknown>): RolObservacion {
  return {
    id: String(row.id ?? ''),
    rolId: String(row.rol_id ?? ''),
    tipoId: Number(row.tipo_id ?? 0),
    descripcion: toStr(row.descripcion),
  }
}

export function rowToSector(row: Record<string, unknown>): Sector {
  return {
    id: Number(row.id ?? 0),
    nombre: String(row.nombre ?? ''),
    clave: String(row.clave ?? ''),
    activo: toBool(row.activo),
  }
}

export function rowToRadio(row: Record<string, unknown>): Radio {
  return {
    id: Number(row.id ?? 0),
    codigo: String(row.codigo ?? ''),
    tipo: toStr(row.tipo),
    estado: String(row.estado ?? ''),
    activo: toBool(row.activo),
  }
}

export function rowToBodyCam(row: Record<string, unknown>): BodyCam {
  return {
    id: Number(row.id ?? 0),
    codigo: String(row.codigo ?? ''),
    estado: String(row.estado ?? ''),
    activo: toBool(row.activo),
  }
}

export function rowToEstadoFuerzaConcepto(row: Record<string, unknown>): EstadoFuerzaConcepto {
  return {
    id: Number(row.id ?? 0),
    nombre: String(row.nombre ?? ''),
    codigo: String(row.codigo ?? ''),
    grupo: toStr(row.grupo),
    orden: Number(row.orden ?? 0),
    activo: toBool(row.activo),
  }
}

export function rowToTipoObservacion(row: Record<string, unknown>): TipoObservacion {
  return {
    id: Number(row.id ?? 0),
    nombre: String(row.nombre ?? ''),
    codigo: String(row.codigo ?? ''),
    activo: toBool(row.activo),
  }
}

export function rowToTipoEmergencia(row: Record<string, unknown>): TipoEmergencia {
  return {
    id: Number(row.id ?? 0),
    clave: String(row.clave ?? ''),
    nombre: String(row.nombre ?? ''),
    activo: toBool(row.activo),
  }
}

export function rowToMedioCanalizacion(row: Record<string, unknown>): MedioCanalizacion {
  return {
    id: Number(row.id ?? 0),
    clave: String(row.clave ?? ''),
    nombre: String(row.nombre ?? ''),
    activo: toBool(row.activo),
  }
}
