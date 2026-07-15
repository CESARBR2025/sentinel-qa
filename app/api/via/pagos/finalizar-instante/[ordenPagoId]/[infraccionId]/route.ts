import { NextResponse } from "next/server";
import { consultarEstatusSA7 } from "@/lib/via/sa7";
import { marcarOrdenPagoPagada, liberarInfraccionInstante } from "@/lib/agente_infracciones/repository";

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

    await marcarOrdenPagoPagada(ordenPagoId);
    await liberarInfraccionInstante(infraccionId);

    return NextResponse.json({ pagado: true });
  } catch (error) {
    console.error("[VIA][PAGOS][FINALIZAR-INSTANTE]", error);
    return NextResponse.json({ pagado: false, error: "Error al finalizar pago" }, { status: 500 });
  }
}
