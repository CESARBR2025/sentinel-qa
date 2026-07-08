export interface OfiOficial {
  id: string;
  ofiNombre: string;
  ofiApPaterno: string;
  ofiApMaterno: string | null;
  noNomina: string | null;
  numeroEmpleado: string | null;
  telefono: string | null;
  departamentoId: string | null;
  departamentoNombre: string | null;
  patrullaId: string | null;
  userId: string | null;
  ofiEstatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfiDetenido {
  nombre: string;
}

export interface OfiVehiculo {
  tipo: string;
  placas: string;
  serie: string;
  color: string;
  destino: string;
}

export interface OfiCateo {
  calle: string | null;
  colonia: string | null;
  numero: string | null;
  lat: number | null;
  lng: number | null;
}

export interface OfiReporteCampo {
  id: string;
  folioReporteCampo: string | null;
  ofiFolioCad: string;
  ofiNombreReportante: string | null;
  ofiAnonimo: boolean;
  ofiTipoIncidente: string | null;
  ofiTipoEmergencia: string | null;
  ofiPrioridad: string | null;
  ofiDescripcion: string | null;
  ofiContenidoReporte: string | null;
  ofiCalle: string | null;
  ofiColonia: string | null;
  ofiLatitud: number | null;
  ofiLongitud: number | null;
  ofiDatosPn: string | null;
  ofiAcciones: string | null;
  ofiHayDetencion: boolean;
  ofiDetenidos: OfiDetenido[];
  ofiAutoridadRecibe: string | null;
  ofiMontoRobo: number | null;
  ofiObjetosRecuperados: string | null;
  ofiHayVehiculo: boolean;
  ofiVehiculos: OfiVehiculo[];
  ofiHayCateo: boolean;
  ofiCateo: OfiCateo | null;
  ofiResultadoCateo: string | null;
  ofiOficialId: string;
  ofiOficialNombre: string;
  ofiEstatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrearReporteCampoInput {
  folioReporteCampo: string;
  ofiFolioCad: string;
  ofiNombreReportante: string | null;
  ofiAnonimo: boolean;
  ofiTipoIncidente: string | null;
  ofiTipoEmergencia: string | null;
  ofiPrioridad: string | null;
  ofiDescripcion: string | null;
  ofiContenidoReporte: string | null;
  ofiCalle: string | null;
  ofiColonia: string | null;
  ofiLatitud: number | null;
  ofiLongitud: number | null;
  ofiDatosPn: string | null;
  ofiAcciones: string | null;
  ofiHayDetencion: boolean;
  ofiDetenidos: OfiDetenido[];
  ofiAutoridadRecibe: string | null;
  ofiMontoRobo: number | null;
  ofiHayRobo: boolean
  ofiObjetosRecuperados: string | null;
  ofiHayVehiculo: boolean;
  ofiVehiculos: OfiVehiculo[];
  ofiHayCateo: boolean;
  ofiCateo: OfiCateo | null;
  ofiResultadoCateo: string | null;
  ofiOficialId: string;
  ofiQuiereDenuncia: boolean;
  ofiHayOrdenAprehension: boolean
  ofiOrdenesAprehension: OfiOrdenAprehension[]
  ofiHayHidrocarburo: boolean
  ofiHidrocarburos: OfiHidrocarburo[]
  ofiHayArmaFuego: boolean
  ofiArmasFuego: OfiArmaFuego[]
  ofiHayDroga: boolean
  ofiDrogas: OfiDroga[]
  ofiTelefonoReportante: string | null
  ofiObservaciones: string | null
  ofiApoyoFiestasPatronales: boolean
  ofiOperativosMetropolitano: boolean
  ofiEco8: boolean
  ofiAlcoholimetria: boolean
  ofiMotocicletas: boolean
  ofiApoyoActuarios: boolean
  ofiApoyoCateosFgr: boolean
  ofiApoyoCateosFge: boolean
}

export interface OfiReporteResumen {
  id: string;
  folioReporteCampo: string | null;
  ofiFolioCad: string;
  ofiTipoIncidente: string | null;
  ofiCalle: string | null;
  ofiColonia: string | null;
  ofiLatitud: number | null;
  ofiLongitud: number | null;
  quiereDenuncia: boolean;
  createdAt: string;
  d1Id: string | null;
  d1Folio: string | null;
}

export interface OfiD1Vinculada {
  id: string;
  folioDenuncia: string;
  iph: string | null;
  folioCu: string | null;
  fechaReporte: string | null;
  horaReporte: string | null;
  tipoEvento: string | null;
  delito: string | null;
  violencia: boolean;
  lugarHecho: string | null;
  coloniaHecho: string | null;
  latitud: number | null;
  longitud: number | null;
  policiaCargo: string | null;
  seGeneroD1: boolean;
  observaciones: string | null;
  ofendidoHombre: number;
  ofendidoMujer: number;
}

export interface OfiReporteDetalle extends OfiReporteCampo {
  quiereDenuncia: boolean;
  d1: OfiD1Vinculada | null;
}

export interface CatalogoItem {
  id: number;
  nombre: string;
}

export interface OfiOrdenAprehension {
  fecha: string
  nombrePersona: string
  observaciones: string
  estatus: string
  nombreSeguimiento: string
}

export interface OfiHidrocarburo {
  fecha: string
  nombrePersona: string
  datosVehiculo: string
  litrosExtraccion: string
  nombreToma: string
  observaciones: string
  nombreSeguimiento: string
}

export interface OfiArmaFuego {
  fecha: string
  datos: string
  cartuchos: string
  observaciones: string
  nombreSeguimiento: string
}

export interface OfiDroga {
  fecha: string
  cantidad: string
  nombre: string
  observaciones: string
  nombreSeguimiento: string
}