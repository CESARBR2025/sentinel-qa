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
