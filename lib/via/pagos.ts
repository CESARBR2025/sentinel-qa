import { consultarEstatusSA7 } from "./sa7";
import { query } from "@/lib/db";

type ResultadoPago = { pagado: boolean; estatusSA7?: string };

export async function confirmarPago(
  ordenPagoId: string,
  infraccionId: string,
  nuevoEstatus: string,
  nuevaDependencia: string,
): Promise<ResultadoPago> {
  console.log("[VIA][PAGOS] confirmarPago - ordenPagoId:", ordenPagoId, "infraccionId:", infraccionId);
  console.log("[VIA][PAGOS] confirmarPago - nuevoEstatus:", nuevoEstatus, "nuevaDependencia:", nuevaDependencia);

  const sa7 = await consultarEstatusSA7(ordenPagoId);
  console.log("[VIA][PAGOS] Resultado SA7:", JSON.stringify(sa7));

  if (!sa7.pagado) {
    console.log("[VIA][PAGOS] SA7 dice NO pagado. Estatus:", sa7.estatus);
    return { pagado: false, estatusSA7: sa7.estatus };
  }

  console.log("[VIA][PAGOS] SA7 dice PAGADO. Actualizando BD...");

  await query(
    `UPDATE via.v2_ordenes_pago_sa7 SET estatus = 'P', updated_at = CURRENT_TIMESTAMP WHERE orden_pago_id = $1`,
    [ordenPagoId],
  );

  await query(
    `UPDATE via.v2_infracciones
     SET estatus = $2, estatus_dependencia = $3, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [infraccionId, nuevoEstatus, nuevaDependencia],
  );

  console.log("[VIA][PAGOS] BD actualizada correctamente");
  return { pagado: true };
}
