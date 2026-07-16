import { consultarEstatusSA7 } from "./sa7";
import { query } from "@/lib/db";
import { SA7Repository } from "@/features/via/saSiete/repository";

type ResultadoPago = { pagado: boolean; estatusSA7?: string; error?: string };

export async function confirmarPago(
  infraccionId: string,
  nuevoEstatus: string,
  nuevaDependencia: string,
): Promise<ResultadoPago> {
  const orden = await SA7Repository.resolverOrdenVigente(infraccionId);
  if (!orden || !orden.ordenPagoId) {
    return { pagado: false, error: "Sin orden vigente para esta infracción" };
  }

  const ordenPagoId = orden.ordenPagoId;
  console.log("[VIA][PAGOS] confirmarPago - ordenPagoId:", ordenPagoId, "infraccionId:", infraccionId);
  console.log("[VIA][PAGOS] confirmarPago - nuevoEstatus:", nuevoEstatus, "nuevaDependencia:", nuevaDependencia);

  const sa7 = await consultarEstatusSA7(ordenPagoId);
  console.log("[VIA][PAGOS] Resultado SA7:", JSON.stringify(sa7));

  if (!sa7.pagado) {
    console.log("[VIA][PAGOS] SA7 dice NO pagado. Estatus:", sa7.estatus);
    return { pagado: false, estatusSA7: sa7.estatus };
  }

  console.log("[VIA][PAGOS] SA7 dice PAGADO. Validando monto...");

  const infraccionResult = await query<{ monto_final: number }>(
    `SELECT monto_final FROM via.v2_infracciones WHERE id = $1 LIMIT 1`,
    [infraccionId],
  );

  const montoEsperado = infraccionResult.rows[0]?.monto_final;

  if (montoEsperado == null) {
    return { pagado: false, error: "No se pudo validar el monto de la infracción" };
  }

  if (Math.round(Number(orden.totalPesos) * 100) !== Math.round(Number(montoEsperado) * 100)) {
    return { pagado: false, error: `Monto pagado (${orden.totalPesos}) no coincide con el esperado (${montoEsperado})` };
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
