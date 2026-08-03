export interface Patrulla {
  id: string;
  placa: string | null;
  etiqueta: string;
  detalle: string;
  marca: string | null;
  modelo: string | null;
  numSerie: string;
  activo: boolean;
  sincronizadoEn: string;
}

export interface PatrullaAsignacion {
  id: string;
  placa: string | null;
  etiqueta: string;
  detalle: string;
  marca: string | null;
  modelo: string | null;
  numSerie: string;
}

export interface OficialTripulacion {
  id: string;
  nombre: string;
  noNomina: string | null;
}

export interface UnidadConTripulacion {
  id: string;
  placa: string | null;
  etiqueta: string;
  detalle: string;
  oficiales: OficialTripulacion[];
  ultimaLat: number | null;
  ultimaLng: number | null;
  ultimaUbicacionEn: string | null;
  ocupada: boolean;
}

export interface UnidadParaDespacho extends UnidadConTripulacion {
  distanciaKm: number | null;
}
