import type {
  IncidenteListItem,
  IncidenteConDespacho,
  IncidentePendiente,
  PersonaAfectadaRow,
  DespachoRow,
  ReporteCampoRow,
  ExtorsionRow,
  AlarmaEscolarRow,
  IncidenteDetalleCompleto,
  DespachoUnidadRow,
  DespachoElementoRow,
  IncidenteBasico,
  DespachoCompleto,
  ReporteCampoDetalle,
  ReporteDetalleResponse,
  DespachoDetalleResponse,
} from './types'

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

function toBool(val: unknown): boolean | null {
  if (val === null || val === undefined) return null
  if (typeof val === 'boolean') return val
  if (val === 'true' || val === 't' || val === '1') return true
  return false
}

export function rowToIncidenteListItem(row: Record<string, unknown>): IncidenteListItem {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    canal: String(row.canal ?? ''),
    tipoReporte: toStr(row.tipo_reporte),
    estatus: String(row.estatus ?? ''),
    fechaHoraInicio: toStr(row.fecha_hora_inicio) ?? '',
    colonia: toStr(row.colonia),
    tipoIncidente: toStr(row.tipo_incidente_nombre),
    prioridad: toStr(row.prioridad_nombre),
    capturadoPor: toStr(row.capturado_por_nombre),
  }
}

export function rowToIncidenteConDespachoBase(row: Record<string, unknown>): Omit<IncidenteConDespacho, 'unidades' | 'elementos'> {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    canal: String(row.canal ?? ''),
    estatus: String(row.estatus ?? ''),
    fechaHoraInicio: toStr(row.fecha_hora_inicio) ?? '',
    calle: toStr(row.calle),
    colonia: toStr(row.colonia),
    descripcion: toStr(row.descripcion),
    tipoIncidente: toStr(row.tipo_incidente_nombre),
    prioridad: toStr(row.prioridad_nombre),
    capturadoPor: toStr(row.capturado_por_nombre),
    despachoId: toStr(row.despacho_id),
    fechaHoraDespacho: toStr(row.despacho_fecha_hora),
    accionesRealizadas: toStr(row.acciones_realizadas),
    hayDetencion: toBool(row.hay_detencion),
  }
}

export function rowToIncidentePendiente(row: Record<string, unknown>): IncidentePendiente {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    canal: String(row.canal ?? ''),
    fechaHoraInicio: toStr(row.fecha_hora_inicio) ?? '',
    calle: toStr(row.calle),
    colonia: toStr(row.colonia),
    entreCalles: toStr(row.entre_calles),
    referenciaUbicacion: toStr(row.referencia_ubicacion),
    descripcion: toStr(row.descripcion),
    tipoIncidente: toStr(row.tipo_incidente_nombre),
    prioridad: toStr(row.prioridad_nombre),
    prioridadOrden: toNum(row.prioridad_orden),
    capturadoPor: toStr(row.capturado_por_nombre),
  }
}

export function rowToPersonaAfectada(row: Record<string, unknown>): PersonaAfectadaRow {
  return {
    id: String(row.id ?? ''),
    incidenteId: toStr(row.incidente_id) ?? '',
    nombre: toStr(row.nombre),
    sexo: toStr(row.sexo),
    edad: toNum(row.edad),
    creadoEn: toStr(row.creado_en) ?? '',
  }
}

export function rowToDespacho(row: Record<string, unknown>): DespachoRow {
  return {
    id: String(row.id ?? ''),
    incidenteId: toStr(row.incidente_id) ?? '',
    fechaHoraDespacho: toStr(row.fecha_hora_despacho),
    despachadorPor: toStr(row.despachado_por),
    creadoEn: toStr(row.creado_en) ?? '',
  }
}

export function rowToReporteCampo(row: Record<string, unknown>): ReporteCampoRow {
  return {
    id: String(row.id ?? ''),
    incidenteId: toStr(row.incidente_id) ?? '',
    contenidoReporte: toStr(row.contenido_reporte),
    lugarCalle: toStr(row.lugar_calle),
    lugarColonia: toStr(row.lugar_colonia),
    lugarEntreCalles: toStr(row.lugar_entre_calles),
    lugarReferencia: toStr(row.lugar_referencia),
    datosPositivosNegativos: toStr(row.datos_positivos_negativos),
    accionesRealizadas: toStr(row.acciones_realizadas),
    hayDetencion: toBool(row.hay_detencion),
    nombreDetenidos: toStr(row.nombre_detenidos),
    autoridadRecibe: toStr(row.autoridad_recibe),
    expedienteCi: toStr(row.expediente_ci),
    delitoFalta: toStr(row.delito_falta),
    montoRobo: toNum(row.monto_robo),
    objetosRecuperados: toStr(row.objetos_recuperados),
    hayCateo: toBool(row.hay_cateo),
    domicilioCateado: toStr(row.domicilio_cateado),
    resultadoCateo: toStr(row.resultado_cateo),
    policiaCargo: toStr(row.policia_a_cargo),
    capturadoPor: toStr(row.capturado_por),
    creadoEn: toStr(row.creado_en) ?? '',
  }
}

export function rowToExtorsion(row: Record<string, unknown>): ExtorsionRow {
  return {
    id: String(row.id ?? ''),
    incidenteId: toStr(row.incidente_id) ?? '',
    telefonoExtorsion: toStr(row.telefono_extorsion),
    grupoDelictivo: toStr(row.grupo_delictivo),
    modusOperandi: toStr(row.modus_operandi),
    unidadResultado: toStr(row.unidad_resultado),
    folioReporte: toStr(row.folio_reporte),
    fecha: toStr(row.fecha),
    creadoEn: toStr(row.creado_en) ?? '',
  }
}

export function rowToAlarmaEscolar(row: Record<string, unknown>): AlarmaEscolarRow {
  return {
    id: String(row.id ?? ''),
    incidenteId: toStr(row.incidente_id) ?? '',
    establecimiento: toStr(row.establecimiento),
    direccion: toStr(row.direccion),
    inmueble: toStr(row.inmueble),
    responsable: toStr(row.responsable),
    reporteDescripcion: toStr(row.reporte_descripcion),
    horaCanalizacion: toStr(row.hora_canalizacion),
    unidadArribo: toStr(row.unidad_arribo),
    horaArribo: toStr(row.hora_arribo),
    nombreResponsable: toStr(row.nombre_responsable),
    nombreVerificador: toStr(row.nombre_verificador),
    activaciones: toNum(row.activaciones),
    creadoEn: toStr(row.creado_en) ?? '',
  }
}

export function rowToDespachoUnidad(row: Record<string, unknown>): DespachoUnidadRow {
  return {
    id: String(row.id ?? ''),
    unidadExtId: toStr(row.unidad_ext_id),
    unidadPlaca: toStr(row.unidad_placa),
  }
}

export function rowToDespachoElemento(row: Record<string, unknown>): DespachoElementoRow {
  return {
    id: String(row.id ?? ''),
    elementoExtId: toStr(row.elemento_ext_id),
    elementoNomina: toStr(row.elemento_nomina),
    elementoNombre: toStr(row.elemento_nombre),
  }
}

export function rowToIncidenteBasico(row: Record<string, unknown>): IncidenteBasico {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    estatus: String(row.estatus ?? ''),
  }
}

export function rowToIncidenteDetalleCompletoBase(row: Record<string, unknown>): Omit<IncidenteDetalleCompleto, 'personasAfectadas' | 'despacho' | 'reporteCampo' | 'extorsion' | 'alarmaEscolar'> {
  return {
    id: String(row.id ?? ''),
    folio: String(row.folio ?? ''),
    canal: String(row.canal ?? ''),
    tipoReporte: toStr(row.tipo_reporte),
    estatus: String(row.estatus ?? ''),
    nombreReportante: toStr(row.nombre_reportante),
    anonimo: toBool(row.anonimo),
    sexo: toStr(row.sexo),
    edad: toNum(row.edad),
    esUsuarioFrecuente: toBool(row.es_usuario_frecuente),
    esPersonaAfectada: toBool(row.es_persona_afectada),
    esMigrante: toBool(row.es_migrante),
    calle: toStr(row.calle),
    colonia: toStr(row.colonia),
    entreCalles: toStr(row.entre_calles),
    referenciaUbicacion: toStr(row.referencia_ubicacion),
    municipio: toStr(row.municipio),
    descripcion: toStr(row.descripcion),
    observaciones: toStr(row.observaciones),
    fechaHoraInicio: toStr(row.fecha_hora_inicio) ?? '',
    fechaHoraFin: toStr(row.fecha_hora_fin),
    grupoWhatsapp: toStr(row.grupo_whatsapp),
    nombreOficial: toStr(row.nombre_oficial),
    requiereDespacho: toBool(row.requiere_despacho),
    creadoEn: toStr(row.creado_en) ?? '',
    tipoIncidente: toStr(row.tipo_incidente_nombre),
    tipoEmergencia: toStr(row.tipo_emergencia_nombre),
    prioridad: toStr(row.prioridad_nombre),
    medioCanalizacion: toStr(row.medio_canalizacion_nombre),
    capturadoPorNombre: toStr(row.capturado_por_nombre),
  }
}

export function rowToReporteCampoDetalle(row: Record<string, unknown>): ReporteCampoDetalle {
  return {
    id: String(row.id ?? ''),
    incidenteId: toStr(row.incidente_id) ?? '',
    contenidoReporte: toStr(row.contenido_reporte),
    lugarCalle: toStr(row.lugar_calle),
    lugarColonia: toStr(row.lugar_colonia),
    lugarEntreCalles: toStr(row.lugar_entre_calles),
    lugarReferencia: toStr(row.lugar_referencia),
    datosPositivosNegativos: toStr(row.datos_positivos_negativos),
    accionesRealizadas: toStr(row.acciones_realizadas),
    hayDetencion: toBool(row.hay_detencion),
    nombreDetenidos: toStr(row.nombre_detenidos),
    autoridadRecibe: toStr(row.autoridad_recibe),
    expedienteCi: toStr(row.expediente_ci),
    delitoFalta: toStr(row.delito_falta),
    montoRobo: toNum(row.monto_robo),
    objetosRecuperados: toStr(row.objetos_recuperados),
    vehiculosRecuperados: toStr(row.vehiculos_recuperados),
    tipoVehiculo: toStr(row.tipo_vehiculo),
    destinoVehiculo: toStr(row.destino_vehiculo),
    hayCateo: toBool(row.hay_cateo),
    domicilioCateado: toStr(row.domicilio_cateado),
    resultadoCateo: toStr(row.resultado_cateo),
    policiaCargo: toStr(row.policia_a_cargo),
    personalIngresoCi: toStr(row.personal_ingreso_ci),
    capturadoPorNombre: toStr(row.capturado_por_nombre),
    creadoEn: toStr(row.creado_en) ?? '',
  }
}
