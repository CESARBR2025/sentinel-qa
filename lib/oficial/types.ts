export interface OfiOficial {
  id: string
  ofiNombre: string
  ofiApPaterno: string
  ofiApMaterno: string | null
  ofiPlacaUnidadAsignada: string | null
  userId: string | null
  ofiEstatus: string
  createdAt: string
  updatedAt: string
}

export interface OfiDetenido {
  nombre: string
}

export interface OfiVehiculo {
  tipo: string
  placas: string
  serie: string
  color: string
  destino: string
}

export interface OfiCateo {
  calle: string | null
  colonia: string | null
  numero: string | null
  lat: number | null
  lng: number | null
}

export interface OfiReporteCampo {
  id: string
  ofiFolioCad: string
  ofiNombreReportante: string | null
  ofiAnonimo: boolean
  ofiTipoIncidente: string | null
  ofiTipoEmergencia: string | null
  ofiPrioridad: string | null
  ofiDescripcion: string | null
  ofiContenidoReporte: string | null
  ofiCalle: string | null
  ofiColonia: string | null
  ofiLatitud: number | null
  ofiLongitud: number | null
  ofiDatosPn: string | null
  ofiAcciones: string | null
  ofiHayDetencion: boolean
  ofiDetenidos: OfiDetenido[]
  ofiAutoridadRecibe: string | null
  ofiMontoRobo: number | null
  ofiObjetosRecuperados: string | null
  ofiHayVehiculo: boolean
  ofiVehiculos: OfiVehiculo[]
  ofiHayCateo: boolean
  ofiCateo: OfiCateo | null
  ofiResultadoCateo: string | null
  ofiOficialId: string
  ofiOficialNombre: string
  ofiEstatus: string
  createdAt: string
  updatedAt: string
}

export interface CrearReporteCampoInput {
  ofiFolioCad: string
  ofiNombreReportante: string | null
  ofiAnonimo: boolean
  ofiTipoIncidente: string | null
  ofiTipoEmergencia: string | null
  ofiPrioridad: string | null
  ofiDescripcion: string | null
  ofiContenidoReporte: string | null
  ofiCalle: string | null
  ofiColonia: string | null
  ofiLatitud: number | null
  ofiLongitud: number | null
  ofiDatosPn: string | null
  ofiAcciones: string | null
  ofiHayDetencion: boolean
  ofiDetenidos: OfiDetenido[]
  ofiAutoridadRecibe: string | null
  ofiMontoRobo: number | null
  ofiObjetosRecuperados: string | null
  ofiHayVehiculo: boolean
  ofiVehiculos: OfiVehiculo[]
  ofiHayCateo: boolean
  ofiCateo: OfiCateo | null
  ofiResultadoCateo: string | null
  ofiOficialId: string
  ofiOficialNombre: string
}
