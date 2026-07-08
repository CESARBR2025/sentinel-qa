import { NextResponse } from "next/server";
import { consultarEstatusSA7 } from "@/lib/via/sa7";
import { query } from "@/lib/db";

export async function GET(
  _req: Request,
  context: { params: Promise<{ ordenPagoId: string; infraccionId: string }> },
) {
  try {
    const { ordenPagoId, infraccionId } = await context.params;

    const sa7 = await consultarEstatusSA7(ordenPagoId);

    if (!sa7.pagado) {
      return NextResponse.json({ pagado: false, estatusSA7: sa7.estatus });
    }

    await query(
      `UPDATE via.v2_ordenes_pago_sa7 SET estatus = 'P', updated_at = CURRENT_TIMESTAMP WHERE orden_pago_id = $1`,
      [ordenPagoId],
    );

    await query(
      `UPDATE via.v2_infracciones
       SET estatus = 'CERRADA', estatus_dependencia = 'LIBERADO_INFRACCIONES_INSTANTE', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [infraccionId],
    );

    return NextResponse.json({ pagado: true });
  } catch (error) {
    console.error("[VIA][PAGOS][FINALIZAR-INSTANTE]", error);
    return NextResponse.json({ pagado: false, error: "Error al finalizar pago" }, { status: 500 });
  }
}
