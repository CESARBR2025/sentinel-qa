import { SA7Repository } from "./repository";
import { GenerarOrdenPagoDTO, ResultadoSA7 } from "./types";
import { mapRowToOrdenPago } from "./mapper";

const SA7_URL = "https://sanjuandelrio.sytes.net:3044/api/sasiete/qas/generar-orden-completa";
const CONCEPTO_FIJO = "31378";

export class SA7Service {
  static async obtenerConceptoId(clasificacion: string): Promise<number | null> {
    return SA7Repository.obtenerConceptoIdPorClasificacion(clasificacion);
  }

  static async generarOrdenPago(payload: GenerarOrdenPagoDTO): Promise<ResultadoSA7> {
    const baseUrl = process.env.NODE_ENV === "production"
      ? "https://via-v2.vercel.app"
      : "http://localhost:3000";

    const tokenRes = await fetch(`${baseUrl}/api/auth/token-guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo_invitacion: `INV-${Date.now()}`,
        nombre_invitado: "SA7_SYSTEM",
      }),
    });

    if (!tokenRes.ok) {
      throw new Error("No se pudo obtener token guest para generar orden");
    }

    const tokenData = await tokenRes.json();
    const tokenGuest = tokenData.data?.token;
    if (!tokenGuest) {
      throw new Error("Token guest inválido");
    }

    let descuento = 1;
    if (payload.descuentoAplicado === 70) descuento = 0.3;
    else if (payload.descuentoAplicado === 50) descuento = 0.5;
    if (payload.cantidad) descuento = payload.cantidad;

    const sa7Payload = {
      nombreUsuario: payload.nombreUsuario,
      apellidosUsuario: payload.apellidosUsuario,
      rfc: "",
      conceptosIds: [payload.conceptoId || CONCEPTO_FIJO],
      cantidades: { [payload.conceptoId || CONCEPTO_FIJO]: descuento },
      referencias: { [payload.conceptoId || CONCEPTO_FIJO]: [`${payload.nombreUsuario} ${payload.apellidosUsuario}`, ""] },
      id_usuario_general: "17336",
      tipo_tramite: "via_v2_cobro_infracciones_online",
      folio: payload.folio,
    };

    const sa7Res = await fetch(SA7_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenGuest}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sa7Payload),
    });

    if (!sa7Res.ok) {
      const detalle = await sa7Res.text().catch(() => "");
      console.error("SA7 respondió con error:", sa7Res.status, detalle);
      throw new Error("El servicio de pagos no pudo generar la orden");
    }

    const result: ResultadoSA7 = {
      ordenPagoId: sa7Res.headers.get("x-orden-pago-id") || null,
      estatus: sa7Res.headers.get("x-estatus") || null,
      urlPago: sa7Res.headers.get("x-url-pago") || null,
      urlGuardado: sa7Res.headers.get("x-url-guardado") || null,
      folioOrden: sa7Res.headers.get("x-folio-orden") || null,
      fechaVencimiento: sa7Res.headers.get("x-fecha-vencimiento") || null,
      totalPesos: Number(sa7Res.headers.get("x-total-pesos") || 0),
      totalUmas: Number(sa7Res.headers.get("x-total-umas") || 0),
    };

    if (!result.ordenPagoId || !result.estatus) {
      console.error("SA7 no devolvió orden_pago_id/estatus en headers:", result);
      throw new Error("El servicio de pagos no devolvió los datos de la orden");
    }

    await SA7Repository.insertarOrdenPago({
      infraccionId: payload.infraccionId,
      folioInfraccion: payload.folio,
      nombreUsuario: payload.nombreUsuario,
      apellidosUsuario: payload.apellidosUsuario,
      conceptoId: String(payload.conceptoId || CONCEPTO_FIJO),
      ...result,
      requestPayload: sa7Payload,
    });

    return result;
  }

  static async buscarOrdenPorInfraccion(infraccionId: string) {
    const orden = await SA7Repository.buscarOrdenPorInfraccionId(infraccionId);
    if (!orden) return null;
    return { ordenPagoId: orden.ordenPagoId };
  }

  static async resolverOrdenVigente(infraccionId: string) {
    return SA7Repository.resolverOrdenVigente(infraccionId);
  }
}

export async function crearOrdenSA7(
  infraccionId: string,
  folioInfraccion: string,
  nombreUsuario: string,
  apellidosUsuario: string,
  conceptoId: string,
  montoTotal: number,
  descuentoAplicado: number,
): Promise<ResultadoSA7> {
  return SA7Service.generarOrdenPago({
    infraccionId,
    folio: folioInfraccion,
    nombreUsuario,
    apellidosUsuario,
    conceptoId: Number(conceptoId),
    correoInfractor: "",
    descuentoAplicado,
  });
}
