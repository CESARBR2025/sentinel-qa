export interface CatalogoConceptoSA7 {
  id: string;
  conceptId: number;
  clasificacionType: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdenPagoSA7 {
  id: string;
  infraccionId: string;
  folioInfraccion: string;
  nombreUsuario: string;
  apellidosUsuario: string;
  conceptoId: string;
  ordenPagoId: string | null;
  estatus: string | null;
  urlPago: string | null;
  urlGuardado: string | null;
  folioOrden: string | null;
  fechaVencimiento: string | null;
  totalPesos: number;
  totalUmas: number;
  requestPayload: any;
  createdAt: string;
  updatedAt: string;
}

export interface GenerarOrdenPagoDTO {
  infraccionId: string;
  folio: string;
  nombreUsuario: string;
  apellidosUsuario: string;
  conceptoId: number;
  correoInfractor: string;
  descuentoAplicado: number;
  cantidad?: number;
}

export interface ResultadoSA7 {
  ordenPagoId: string | null;
  estatus: string | null;
  urlPago: string | null;
  urlGuardado: string | null;
  folioOrden: string | null;
  fechaVencimiento: string | null;
  totalPesos: number;
  totalUmas: number;
}
