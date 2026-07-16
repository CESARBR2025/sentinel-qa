import { consultarEstatusSA7 } from "./sa7";
import { query } from "@/lib/db";

type ResultadoPago = { pagado: boolean; estatusSA7?: string; error?: string };

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

  console.log("[VIA][PAGOS] SA7 dice PAGADO. Validando monto...");

  // P0.3: Validar que el monto pagado coincida con el monto final de la infracción
  const ordenResult = await query<{ total_pesos: number }>(
    `SELECT total_pesos FROM via.v2_ordenes_pago_sa7 WHERE orden_pago_id = $1 LIMIT 1`,
    [ordenPagoId],
  );

  const infraccionResult = await query<{ monto_final: number }>(
    `SELECT monto_final FROM via.v2_infracciones WHERE id = $1 LIMIT 1`,
    [infraccionId],
  );

  const montoPagado = ordenResult.rows[0]?.total_pesos;
  const montoEsperado = infraccionResult.rows[0]?.monto_final;

  if (montoPagado == null || montoEsperado == null) {
    return { pagado: false, error: "No se pudo validar el monto" };
  }

  if (Math.round(Number(montoPagado) * 100) !== Math.round(Number(montoEsperado) * 100)) {
    return { pagado: false, error: `Monto pagado (${montoPagado}) no coincide con el esperado (${montoEsperado})` };
  }

  console.log("[VIA][PAGOS] Monto validado correctamente. Actualizando BD...");

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
