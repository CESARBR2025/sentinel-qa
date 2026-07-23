import { OrdenPagoSA7 } from "./types";

interface OrdenPagoRow {
  id: string;
  infraccion_id: string;
  folio_infraccion: string;
  nombre_usuario: string;
  apellidos_usuario: string;
  concepto_id: string;
  orden_pago_id: string | null;
  estatus: string | null;
  url_pago: string | null;
  url_guardado: string | null;
  folio_orden: string | null;
  fecha_vencimiento: string | null;
  total_pesos: string;
  total_umas: string;
  request_payload: any;
  created_at: string;
  updated_at: string;
  vigente: boolean;
}

export function mapRowToOrdenPago(row: OrdenPagoRow): OrdenPagoSA7 {
  return {
    id: row.id,
    infraccionId: row.infraccion_id,
    folioInfraccion: row.folio_infraccion,
    nombreUsuario: row.nombre_usuario,
    apellidosUsuario: row.apellidos_usuario,
    conceptoId: row.concepto_id,
    ordenPagoId: row.orden_pago_id,
    estatus: row.estatus,
    urlPago: row.url_pago,
    urlGuardado: row.url_guardado,
    folioOrden: row.folio_orden,
    fechaVencimiento: row.fecha_vencimiento,
    totalPesos: Number(row.total_pesos),
    totalUmas: Number(row.total_umas),
    requestPayload: row.request_payload,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    vigente: row.vigente,
  };
}
