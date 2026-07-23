import type { IncidenteResumen, IncidenteDetalle, CatalogoItem } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

function toNum(val: unknown): number | null {
  if (val === null || val === undefined) return null
  const n = Number(val)
  return isNaN(n) ? null : n
}

export function rowToIncidenteResumen(row: Record<string, unknown>): IncidenteResumen {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    folioConsecutivo: Number(row.folio_consecutivo ?? 0),
    tipoIncidenteNombre: toStr(row.tipo_incidente_nombre),
    prioridadNombre: toStr(row.prioridad_nombre),
    estatus: String(row.estatus ?? ''),
    canal: String(row.canal ?? ''),
    fechaHoraInicio: toStr(row.fecha_hora_inicio) ?? '',
    creadoEn: toStr(row.creado_en) ?? '',
  }
}

export function rowToIncidenteDetalle(row: Record<string, unknown>): IncidenteDetalle {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    folioConsecutivo: Number(row.folio_consecutivo ?? 0),
    canal: String(row.canal ?? ''),
    tipoReporte: String(row.tipo_reporte ?? ''),
    nombreReportante: toStr(row.nombre_reportante),
    anonimo: Boolean(row.anonimo),
    sexo: toStr(row.sexo),
    edad: toNum(row.edad),
    esUsuarioFrecuente: Boolean(row.es_usuario_frecuente),
    esPersonaAfectada: Boolean(row.es_persona_afectada),
    esMigrante: Boolean(row.es_migrante),
    calle: toStr(row.calle),
    numeroExterior: toStr(row.numero_exterior),
    numeroInterior: toStr(row.numero_interior),
    colonia: toStr(row.colonia),
    entreCalles: toStr(row.entre_calles),
    referenciaUbicacion: toStr(row.referencia_ubicacion),
    municipio: String(row.municipio ?? ''),
    latitud: toNum(row.latitud),
    longitud: toNum(row.longitud),
    tipoEmergenciaId: toNum(row.tipo_emergencia_id),
    tipoIncidenteId: toNum(row.tipo_incidente_id),
    prioridadId: toNum(row.prioridad_id),
    descripcion: toStr(row.descripcion),
    observaciones: toStr(row.observaciones),
    fechaHoraInicio: toStr(row.fecha_hora_inicio) ?? '',
    fechaHoraFin: toStr(row.fecha_hora_fin),
    grupoWhatsapp: toStr(row.grupo_whatsapp),
    nombreOficial: toStr(row.nombre_oficial),
    medioCanalizacionId: toNum(row.medio_canalizacion_id),
    requiereDespacho: Boolean(row.requiere_despacho),
    estatus: String(row.estatus ?? ''),
    capturadoPor: String(row.capturado_por ?? ''),
    creadoEn: toStr(row.creado_en) ?? '',
    actualizadoEn: toStr(row.actualizado_en) ?? '',
    tipoNombre: toStr(row.tipo_nombre),
    prioridadNombre: toStr(row.prioridad_nombre),
    emergenciaNombre: toStr(row.emergencia_nombre),
    codigoCatalogo: toStr(row.codigo_catalogo),
    folioCad: toStr(row.folio_cad),
    svvNotificado: Boolean(row.svv_notificado),
    dependenciaId: toNum(row.dependencia_id),
    dependenciaNombre: toStr(row.dependencia_nombre),
    telefonoReportante: toStr(row.telefono_reportante),
  }
}

export function rowToCatalogo(row: Record<string, unknown>): CatalogoItem {
  return {
    id: Number(row.id ?? 0),
    nombre: String(row.nombre ?? ''),
  }
}
