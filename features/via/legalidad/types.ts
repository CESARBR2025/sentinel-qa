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
