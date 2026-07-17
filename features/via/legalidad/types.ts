export interface FraccionLey {
  id: string;
  articulo_id: string;
  numero: string;
  descripcion: string;
  monto_umas: number;
  clasificacion: "Leve" | "Media" | "Grave";
  activo: boolean;
}

export interface ArticuloLey {
  id: string;
  numero: string;
  descripcion: string;
  activo: boolean;
  fracciones: FraccionLey[];
}

export interface ResultadoBusquedaMotivo {
  articuloId: string;
  articuloNumero: string;
  articuloDescripcion: string;
  fraccionId: string;
  fraccionNumero: string;
  fraccionDescripcion: string;
  fraccionMonto: number;
  fraccionClasificacion: FraccionLey["clasificacion"];
  motivoDetectado: string;
}
