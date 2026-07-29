export interface FlotaVehiculoRaw {
  placaVehiculo: string;
  numSerie: string;
  marca: string;
  modelo: string;
  color: string;
  tipoVehiculo: string;
  secretaria: string;
  idVehiculo: number;
}

export interface Patrulla {
  id: string;
  numeroUnidad: string;
  placas: string;
  descripcion: string;
  activo: boolean;
  sincronizadoEn: string;
}

export interface PatrullaAsignacion {
  id: string;
  numeroUnidad: string;
  placas: string;
  descripcion: string;
}

export interface OficialTripulacion {
  id: string;
  nombre: string;
  noNomina: string | null;
}

export interface UnidadConTripulacion {
  id: string;
  numeroUnidad: string;
  placas: string;
  oficiales: OficialTripulacion[];
  ultimaLat: number | null;
  ultimaLng: number | null;
  ultimaUbicacionEn: string | null;
  ocupada: boolean;
}

export interface UnidadParaDespacho extends UnidadConTripulacion {
  distanciaKm: number | null;
}
