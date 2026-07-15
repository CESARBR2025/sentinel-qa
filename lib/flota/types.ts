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
