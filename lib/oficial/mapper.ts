import type { OfiReporteCampo, OfiOficial, OfiDetenido, OfiVehiculo, OfiCateo, OfiReporteResumen, OfiD1Vinculada, OfiReporteDetalle, DespachoAsignado, DespachoAtendido, RondinOficialResumen, ReporteCampoParaD1 } from './types'

function parseJsonField<T>(val: unknown): T {
  if (!val) return (typeof val === 'string' ? JSON.parse(val) : val) ?? ([] as unknown as T)
  if (typeof val === 'string') return JSON.parse(val) as T
  return val as T
}

export function rowToReporteCampo(row: Record<string, unknown>): OfiReporteCampo {
  return {
    id: String(row.id ?? ''),
    incidenteId: (row.incidente_id as string) ?? null,
    folioReporteCampo: (row.folio_reporte_campo as string) ?? null,
    ofiFolioCad: String(row.ofi_folio_cad ?? ''),
    ofiNombreReportante: (row.ofi_nombre_reportante as string) ?? null,
    ofiAnonimo: Boolean(row.ofi_anonimo),
    ofiTipoIncidente: (row.ofi_tipo_incidente as string) ?? null,
    ofiTipoEmergencia: (row.ofi_tipo_emergencia as string) ?? null,
    ofiPrioridad: (row.ofi_prioridad as string) ?? null,
    tipoEmergenciaId: row.tipo_emergencia_id != null ? Number(row.tipo_emergencia_id) : null,
    tipoIncidenteId: row.tipo_incidente_id != null ? Number(row.tipo_incidente_id) : null,
    prioridadId: row.prioridad_id != null ? Number(row.prioridad_id) : null,
    ofiDescripcion: (row.ofi_descripcion as string) ?? null,
    ofiContenidoReporte: (row.ofi_contenido_reporte as string) ?? null,
    ofiCalle: (row.ofi_calle as string) ?? null,
    ofiColonia: (row.ofi_colonia as string) ?? null,
    ofiEntreCalles: (row.ofi_entre_calles as string) ?? null,
    ofiReferencia: (row.ofi_referencia as string) ?? null,
    ofiLatitud: row.ofi_latitud ? Number(row.ofi_latitud) : null,
    ofiLongitud: row.ofi_longitud ? Number(row.ofi_longitud) : null,
    ofiDatosPn: (row.ofi_datos_pn as string) ?? null,
    ofiAcciones: (row.ofi_acciones as string) ?? null,
    ofiHayDetencion: Boolean(row.ofi_hay_detencion),
    ofiDetenidos: parseJsonField<OfiDetenido[]>(row.ofi_detenidos),
    ofiAutoridadRecibe: (row.ofi_autoridad_recibe as string) ?? null,
    expedienteCi: (row.expediente_ci as string) ?? null,
    personalIngresoCi: (row.personal_ingreso_ci as string) ?? null,
    ofiMontoRobo: row.ofi_monto_robo ? Number(row.ofi_monto_robo) : null,
    ofiObjetosRecuperados: (row.ofi_objetos_recuperados as string) ?? null,
    ofiHayVehiculo: Boolean(row.ofi_hay_vehiculo),
    ofiVehiculos: parseJsonField<OfiVehiculo[]>(row.ofi_vehiculos),
    ofiHayCateo: Boolean(row.ofi_hay_cateo),
    ofiCateo: parseJsonField<OfiCateo | null>(row.ofi_cateo),
    ofiResultadoCateo: (row.ofi_resultado_cateo as string) ?? null,
    ofiOficialId: String(row.ofi_oficial_id ?? ''),
    ofiOficialNombre: String(row.ofi_oficial_nombre ?? ''),
    ofiEstatus: String(row.ofi_estatus ?? 'registrado'),
    createdAt: toStr(row.created_at) ?? '',
    updatedAt: toStr(row.updated_at) ?? '',
  }
}

export function rowToOficial(row: Record<string, unknown>): OfiOficial {
  return {
    id: String(row.id ?? ''),
    ofiNombre: String(row.ofi_nombre ?? ''),
    ofiApPaterno: String(row.ofi_ap_paterno ?? ''),
    ofiApMaterno: (row.ofi_ap_materno as string) ?? null,
    noNomina: (row.no_nomina as string) ?? null,
    numeroEmpleado: (row.numero_empleado as string) ?? null,
    telefono: (row.telefono as string) ?? null,
    departamentoId: (row.departamento_id as string) ?? null,
    departamentoNombre: (row.departamento_nombre as string) ?? null,
    patrullaId: (row.patrulla_id as string) ?? null,
    userId: (row.user_id as string) ?? null,
    ofiEstatus: String(row.ofi_estatus ?? 'activo'),
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
  }
}

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  if (val instanceof Date) return val.toISOString()
  return String(val)
}

export function rowToReporteResumen(row: Record<string, unknown>): OfiReporteResumen {
  return {
    id: String(row.id ?? ''),
    folioReporteCampo: (row.folio_reporte_campo as string) ?? null,
    ofiFolioCad: String(row.ofi_folio_cad ?? ''),
    ofiTipoIncidente: (row.ofi_tipo_incidente as string) ?? null,
    ofiCalle: (row.ofi_calle as string) ?? null,
    ofiColonia: (row.ofi_colonia as string) ?? null,
    ofiLatitud: row.ofi_latitud ? Number(row.ofi_latitud) : null,
    ofiLongitud: row.ofi_longitud ? Number(row.ofi_longitud) : null,
    quiereDenuncia: Boolean(row.quiere_denuncia),
    createdAt: toStr(row.created_at) ?? '',
    d1Id: (row.d1_id as string) ?? null,
    d1Folio: (row.d1_folio as string) ?? null,
    d1Pendiente: Boolean(row.ofi_hay_detencion) && !row.d1_id,
  }
}

export function rowToDespachoAsignado(row: Record<string, unknown>): DespachoAsignado {
  return {
    incidenteId: String(row.incidente_id ?? ''),
    folio: String(row.folio ?? ''),
    canal: String(row.canal ?? ''),
    estatus: String(row.estatus ?? ''),
    descripcion: (row.descripcion as string) ?? null,
    calle: (row.calle as string) ?? null,
    colonia: (row.colonia as string) ?? null,
    entreCalles: (row.entre_calles as string) ?? null,
    referenciaUbicacion: (row.referencia_ubicacion as string) ?? null,
    tipoIncidente: (row.tipo_incidente_nombre as string) ?? null,
    prioridad: (row.prioridad_nombre as string) ?? null,
    tipoEmergenciaId: row.tipo_emergencia_id != null ? Number(row.tipo_emergencia_id) : null,
    tipoIncidenteId: row.tipo_incidente_id != null ? Number(row.tipo_incidente_id) : null,
    prioridadId: row.prioridad_id != null ? Number(row.prioridad_id) : null,
    fechaHoraInicio: toStr(row.fecha_hora_inicio) ?? '',
    fechaHoraDespacho: toStr(row.fecha_hora_despacho),
    despachadorNombre: (row.despachador_nombre as string) ?? null,
    unidades: Array.isArray(row.unidades) ? (row.unidades as string[]).filter(Boolean) : [],
  }
}

export function rowToD1(row: Record<string, unknown>): OfiD1Vinculada {
  return {
    id: String(row.d1_id ?? ''),
    folioDenuncia: String(row.d1_folio ?? ''),
    iph: (row.d1_iph as string) ?? null,
    folioCu: (row.d1_folio_cu as string) ?? null,
    // Convertir explícitamente a string — pueden llegar como Date
    fechaReporte: toStr(row.d1_fecha_reporte),
    horaReporte: toStr(row.d1_hora_reporte),
    tipoEvento: (row.d1_tipo_evento as string) ?? null,
    delito: (row.d1_delito as string) ?? null,
    violencia: Boolean(row.d1_violencia),
    lugarHecho: (row.d1_lugar_hecho as string) ?? null,
    coloniaHecho: (row.d1_colonia_hecho as string) ?? null,
    latitud: row.d1_latitud ? Number(row.d1_latitud) : null,
    longitud: row.d1_longitud ? Number(row.d1_longitud) : null,
    policiaCargo: (row.d1_policia_cargo as string) ?? null,
    seGeneroD1: Boolean(row.d1_se_genero),
    observaciones: (row.d1_observaciones as string) ?? null,
    ofendidoHombre: Number(row.d1_ofendido_hombre ?? 0),
    ofendidoMujer: Number(row.d1_ofendido_mujer ?? 0),
  }
}

export function rowToReporteCampoParaD1(row: Record<string, unknown>): ReporteCampoParaD1 {
  return {
    id: String(row.id ?? ''),
    folioReporteCampo: (row.folio_reporte_campo as string) ?? null,
    tipoIncidente: (row.ofi_tipo_incidente as string) ?? null,
    descripcion: (row.ofi_descripcion as string) ?? null,
    calle: (row.calle as string) ?? null,
    colonia: (row.colonia as string) ?? null,
    latitud: row.latitud ? Number(row.latitud) : null,
    longitud: row.longitud ? Number(row.longitud) : null,
    autoridadRecibe: (row.ofi_autoridad_recibe as string) ?? null,
    oficialNombre: (row.oficial_nombre as string) ?? null,
    oficialNomina: (row.oficial_nomina as string) ?? null,
    fechaHoraInicioIncidente: toStr(row.incidente_fecha_hora_inicio),
    fechaHoraDespacho: toStr(row.despacho_fecha_hora_despacho),
    created_at: toStr(row.created_at),
  }
}

export function rowToDespachoAtendido(row: Record<string, unknown>): DespachoAtendido {
  return {
    ...rowToDespachoAsignado(row),
    reporteCampoId: String(row.reporte_campo_id ?? ''),
    folioReporteCampo: (row.folio_reporte_campo as string) ?? null,
    fechaCierre: toStr(row.fecha_cierre),
    hayDetencion: Boolean(row.ofi_hay_detencion),
    acciones: (row.ofi_acciones as string) ?? null,
    quiereDenuncia: Boolean(row.quiere_denuncia),
    d1Id: (row.d1_id as string) ?? null,
    d1Folio: (row.d1_folio as string) ?? null,
  }
}

export function rowToRondinOficialResumen(row: Record<string, unknown>): RondinOficialResumen {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    fechaHoraInicio: toStr(row.fecha_hora_inicio) ?? '',
    tipoIncidente: (row.tipo_incidente_nombre as string) ?? null,
    calle: (row.calle as string) ?? null,
    colonia: (row.colonia as string) ?? null,
    estatus: String(row.estatus ?? ''),
    fechaHoraDespacho: toStr(row.fecha_hora_despacho),
    capturadoPor: (row.capturado_por_nombre as string) ?? null,
  }
}

export function rowToReporteDetalle(row: Record<string, unknown>): OfiReporteDetalle {
  return {
    ...rowToReporteCampo(row),
    quiereDenuncia: Boolean(row.quiere_denuncia),
    d1: row.d1_id ? rowToD1(row) : null,
  }
}
