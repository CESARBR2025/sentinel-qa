export interface FlotaVehiculoRaw {
  placa_vehiculo: string;
  num_serie: string;
  marca: string;
  modelo: string;
  color: string;
  tipo_vehiculo: string;
  secretaria: string;
  id_vehiculo: number;
}

export interface PatrullaRow {
  id: string;
  numero_unidad: string;
  placas: string;
  descripcion: string;
  activo: boolean;
  sincronizado_en: string;
}

export interface PatrullaAsignacion {
  id: string;
  numero_unidad: string;
  placas: string;
  descripcion: string;
}
