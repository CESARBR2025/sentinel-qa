export interface IncidenteFiltros {
  canal?: string | null
  estatus?: string | null
  desde?: string | null
  hasta?: string | null
  folio?: string | null
  tipoIncidenteId?: number | null
  prioridadId?: number | null
}

export interface IncidenteListItem {
  id: string
  folio: string
  canal: string
  tipoReporte: string | null
  estatus: string
  fechaHoraInicio: string
  colonia: string | null
  tipoIncidente: string | null
  prioridad: string | null
  capturadoPor: string | null
}

export interface IncidenteConDespacho {
  id: string
  folio: string
  canal: string
  estatus: string
  fechaHoraInicio: string
  calle: string | null
  colonia: string | null
  descripcion: string | null
  tipoIncidente: string | null
  prioridad: string | null
  capturadoPor: string | null
  despachoId: string | null
  fechaHoraDespacho: string | null
  accionesRealizadas: string | null
  hayDetencion: boolean | null
  d1Pendiente: boolean
  unidades: { placa: string }[]
  elementos: { nombre: string; nomina: string }[]
}

export interface IncidentePendiente {
  id: string
  folio: string
  canal: string
  fechaHoraInicio: string
  calle: string | null
  colonia: string | null
  entreCalles: string | null
  referenciaUbicacion: string | null
  descripcion: string | null
  tipoIncidente: string | null
  prioridad: string | null
  prioridadOrden: number | null
  capturadoPor: string | null
}

export interface PersonaAfectadaRow {
  id: string
  incidenteId: string
  nombre: string | null
  sexo: string | null
  edad: number | null
  creadoEn: string
}

export interface DespachoRow {
  id: string
  incidenteId: string
  fechaHoraDespacho: string | null
  despachadorPor: string | null
  creadoEn: string
}

export interface ReporteCampoRow {
  id: string
  incidenteId: string
  contenidoReporte: string | null
  lugarCalle: string | null
  lugarColonia: string | null
  lugarEntreCalles: string | null
  lugarReferencia: string | null
  datosPositivosNegativos: string | null
  accionesRealizadas: string | null
  hayDetencion: boolean | null
  nombreDetenidos: string | null
  autoridadRecibe: string | null
  expedienteCi: string | null
  delitoFalta: string | null
  montoRobo: number | null
  objetosRecuperados: string | null
  hayCateo: boolean | null
  domicilioCateado: string | null
  resultadoCateo: string | null
  policiaCargo: string | null
  capturadoPor: string | null
  creadoEn: string
}

export interface ExtorsionRow {
  id: string
  incidenteId: string
  telefonoExtorsion: string | null
  grupoDelictivo: string | null
  modusOperandi: string | null
  unidadResultado: string | null
  folioReporte: string | null
  fecha: string | null
  creadoEn: string
}

export interface AlarmaEscolarRow {
  id: string
  incidenteId: string
  establecimiento: string | null
  direccion: string | null
  inmueble: string | null
  responsable: string | null
  reporteDescripcion: string | null
  horaCanalizacion: string | null
  unidadArribo: string | null
  horaArribo: string | null
  nombreResponsable: string | null
  nombreVerificador: string | null
  activaciones: number | null
  creadoEn: string
}

export interface IncidenteDetalleCompleto {
  id: string
  folio: string
  canal: string
  tipoReporte: string | null
  estatus: string
  nombreReportante: string | null
  anonimo: boolean | null
  sexo: string | null
  edad: number | null
  esUsuarioFrecuente: boolean | null
  esPersonaAfectada: boolean | null
  esMigrante: boolean | null
  calle: string | null
  colonia: string | null
  entreCalles: string | null
  referenciaUbicacion: string | null
  municipio: string | null
  descripcion: string | null
  observaciones: string | null
  fechaHoraInicio: string
  fechaHoraFin: string | null
  grupoWhatsapp: string | null
  nombreOficial: string | null
  requiereDespacho: boolean | null
  origenRondin: boolean | null
  creadoEn: string
  tipoIncidente: string | null
  tipoEmergencia: string | null
  prioridad: string | null
  medioCanalizacion: string | null
  capturadoPorNombre: string | null
  personasAfectadas: PersonaAfectadaRow[]
  despacho: DespachoRow | null
  reporteCampo: ReporteCampoRow | null
  extorsion: ExtorsionRow | null
  alarmaEscolar: AlarmaEscolarRow | null
}

export interface DespachoUnidadRow {
  id: string
  unidadExtId: string | null
  unidadPlaca: string | null
}

export interface DespachoElementoRow {
  id: string
  elementoExtId: string | null
  elementoNomina: string | null
  elementoNombre: string | null
  oficialId: string | null
}

export interface IncidenteBasico {
  id: string
  folio: string
  estatus: string
}

export interface DespachoCompleto {
  id: string
  incidenteId: string
  fechaHoraDespacho: string | null
  despachadorNombre: string | null
  creadoEn: string
  unidades: DespachoUnidadRow[]
  elementos: DespachoElementoRow[]
}

export interface DespachoDetalleResponse {
  incidente: IncidenteBasico
  despacho: DespachoCompleto
}

export interface ReporteCampoDetalle {
  id: string
  incidenteId: string
  contenidoReporte: string | null
  lugarCalle: string | null
  lugarColonia: string | null
  lugarEntreCalles: string | null
  lugarReferencia: string | null
  datosPositivosNegativos: string | null
  accionesRealizadas: string | null
  hayDetencion: boolean | null
  nombreDetenidos: string | null
  autoridadRecibe: string | null
  expedienteCi: string | null
  delitoFalta: string | null
  montoRobo: number | null
  objetosRecuperados: string | null
  vehiculosRecuperados: string | null
  tipoVehiculo: string | null
  destinoVehiculo: string | null
  hayCateo: boolean | null
  domicilioCateado: string | null
  resultadoCateo: string | null
  policiaCargo: string | null
  personalIngresoCi: string | null
  capturadoPorNombre: string | null
  creadoEn: string
}

export interface ReporteDetalleResponse {
  incidente: IncidenteBasico
  reporte: ReporteCampoDetalle
}

// ─── Historial generativo (timeline 911 → despacho → campo → D1) ────────────

export interface HistorialGeneracion {
  folio: string
  canal: string
  origenRondin: boolean
  nombreReportante: string | null
  descripcion: string | null
  tipoIncidente: string | null
  prioridad: string | null
  calle: string | null
  colonia: string | null
  fechaHoraInicio: string
  capturadoPorNombre: string | null
}

export interface HistorialDespacho {
  fechaHoraDespacho: string | null
  despachadorNombre: string | null
  unidades: DespachoUnidadRow[]
  elementos: DespachoElementoRow[]
}

export interface HistorialCierre {
  reporteCampoId: string
  folioReporteCampo: string | null
  acciones: string | null
  hayDetencion: boolean
  autoridadRecibe: string | null
  oficialNombre: string | null
  fechaCierre: string
  legacy: boolean
}

export interface HistorialD1 {
  folioDenuncia: string
  estadoTramite: string | null
  fechaCreacion: string | null
}

export interface HistorialIncidente {
  generacion: HistorialGeneracion
  despacho: HistorialDespacho | null
  cierre: HistorialCierre | null
  d1: HistorialD1 | null
}
