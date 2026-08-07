export interface VehiculoRow {
  fecha: unknown
  folio: string | null
  seguimiento: string | null
  vehiculo: unknown
}

export interface CateoRow {
  fecha: unknown
  folio: string | null
  ubicacion: string | null
  dependencia: string | null
  seguimiento: string | null
}

export interface DetencionOfiRow {
  fecha: unknown
  folio: string | null
  detenidos: unknown
  fiscalia: string | null
  seguimiento: string | null
}

export interface DetencionIncRow {
  fecha: unknown
  folio: string | null
  nombre: string | null
  fiscalia: string | null
  seguimiento: string | null
}

export interface DetencionResult {
  ofi: DetencionOfiRow[]
  inc: DetencionIncRow[]
}

export interface OrdenAprehensionRow {
  fecha: unknown
  folio: string | null
  ordenes: unknown
  seguimientoReporte: string | null
}

export interface HidrocarburoRow {
  fecha: unknown
  folio: string | null
  hidrocarburos: unknown
  seguimientoReporte: string | null
}

export interface ArmaRow {
  fecha: unknown
  folio: string | null
  armas: unknown
  seguimientoReporte: string | null
}

export interface DrogaRow {
  fecha: unknown
  folio: string | null
  drogas: unknown
  seguimientoReporte: string | null
}

export interface ExtorsionRow {
  folio: string | null
  telefono: string | null
  fecha: unknown
  incidencia: string | null
}

// Reporte de Llamadas de Extorsión 911 (formato C4): 9 columnas oficiales.
export interface ExtorsionDetalleRow {
  folio: string | null
  folioReporte: string | null
  telefono: string | null
  fecha: unknown
  hora: string | null
  lugar: string | null
  grupoDelictivo: string | null
  modusOperandi: string | null
  unidad: string | null
  resultado: string | null
}

// Reporte de Alarmas Escolares 911: establecimiento y detalle de atención.
// unidadArribo/horaArribo/horaCanalizacion/oficial vienen del join con el flujo real de
// Despacho + Reporte de Campo (incidente_despacho*), no se capturan a mano.
export interface AlarmaEscolarDetalleRow {
  folio: string | null
  folioReporte: string | null
  fecha: unknown
  hora: string | null
  establecimiento: string | null
  direccion: string | null
  inmueble: string | null
  responsable: string | null
  nombreResponsable: string | null
  reporteDescripcion: string | null
  prioridad: string | null
  activaciones: number | null
  esFalso: boolean | null
  horaCanalizacion: unknown
  unidadArribo: string | null
  horaArribo: unknown
  oficial: string | null
  nombreVerificador: string | null
}

export interface ReporteCampoGeneralRow {
  fecha: unknown
  folio: string | null
  oficial: string | null
  hayCateo: unknown
  cateoData: unknown
  hayDetencion: unknown
  detenidosData: unknown
  hayVehiculo: unknown
  vehiculosData: unknown
  hayArma: unknown
  armasData: unknown
  hayDroga: unknown
  drogasData: unknown
  hayHidro: unknown
  hidroData: unknown
  hayOrden: unknown
  ordenesData: unknown
  hayRobo: unknown
  montoRobo: unknown
  objetos: string | null
}

export interface ReporteCampoIncidenteGeneralRow {
  fecha: unknown
  folio: string | null
  oficial: string | null
  hayCateo: unknown
  cateoCalle: string | null
  cateoColonia: string | null
  hayDetencion: unknown
  detenidosData: unknown
  hayVehiculo: unknown
  vehiculosData: unknown
  hayArma: unknown
  armasData: unknown
  hayDroga: unknown
  drogasData: unknown
  hayHidro: unknown
  hidroData: unknown
  hayOrden: unknown
  ordenesData: unknown
  hayRobo: unknown
  montoRobo: unknown
  objetos: string | null
}
