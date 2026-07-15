export interface IncidenteResumen {
  id: string
  folio: string
  folioConsecutivo: number
  tipoIncidenteNombre: string | null
  prioridadNombre: string | null
  estatus: string
  canal: string
  fechaHoraInicio: string
  creadoEn: string
}

export interface IncidenteDetalle {
  id: string
  folio: string
  folioConsecutivo: number
  canal: string
  tipoReporte: string
  nombreReportante: string | null
  anonimo: boolean
  sexo: string | null
  edad: number | null
  esUsuarioFrecuente: boolean
  esPersonaAfectada: boolean
  esMigrante: boolean
  calle: string | null
  numeroExterior: string | null
  numeroInterior: string | null
  colonia: string | null
  entreCalles: string | null
  referenciaUbicacion: string | null
  municipio: string
  latitud: number | null
  longitud: number | null
  tipoEmergenciaId: number | null
  tipoIncidenteId: number | null
  prioridadId: number | null
  descripcion: string | null
  observaciones: string | null
  fechaHoraInicio: string
  fechaHoraFin: string | null
  grupoWhatsapp: string | null
  nombreOficial: string | null
  medioCanalizacionId: number | null
  requiereDespacho: boolean
  estatus: string
  capturadoPor: string
  creadoEn: string
  actualizadoEn: string
  tipoNombre: string | null
  prioridadNombre: string | null
  emergenciaNombre: string | null
}

export interface IncidenteStats {
  total: number
  hoy: number
  sinDespachar: number
  enDespacho: number
  channels: { canal: string; count: number }[]
}

export interface CatalogoItem {
  id: number
  nombre: string
}
