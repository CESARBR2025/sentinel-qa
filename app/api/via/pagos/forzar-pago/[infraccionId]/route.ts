import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { SA7Repository } from "@/features/via/saSiete/repository";
import { marcarOrdenPagoPagada } from "@/lib/agente_infracciones/repository";

export async function POST(
  _req: Request,
  context: { params: Promise<{ infraccionId: string }> },
) {
  try {
    const { infraccionId } = await context.params;

    const orden = await SA7Repository.resolverOrdenVigente(infraccionId);
    if (!orden) {
      return NextResponse.json({ pagado: false, error: "Sin orden vigente para esta infracción" }, { status: 400 });
    }

    // Forzar pago: bypass SA7, actualizar BD directamente
    if (orden.ordenPagoId) {
      await marcarOrdenPagoPagada(orden.ordenPagoId);
    }

    await query(
      `UPDATE via.v2_infracciones
       SET estatus = 'PAGADA', estatus_dependencia = 'PAGADA_FORZADA_ADMIN', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [infraccionId],
    );

    return NextResponse.json({ pagado: true, forzado: true });
  } catch (error) {
    console.error("[VIA][PAGOS][FORZAR-PAGO]", error);
    return NextResponse.json({ pagado: false, error: "Error al forzar pago" }, { status: 500 });
  }
}
