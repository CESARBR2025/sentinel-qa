import { NextResponse } from "next/server";
import { consultarEstatusSA7 } from "@/lib/via/sa7";
import { SA7Repository } from "@/features/via/saSiete/repository";
import { marcarOrdenPagoPagada, liberarInfraccionInstante } from "@/lib/agente_infracciones/repository";

export async function GET(
  _req: Request,
  context: { params: Promise<{ infraccionId: string }> },
) {
  try {
    const { infraccionId } = await context.params;

    const orden = await SA7Repository.resolverOrdenVigente(infraccionId);
    if (!orden || !orden.ordenPagoId) {
      return NextResponse.json({ pagado: false, error: "Sin orden vigente" }, { status: 400 });
    }

    const sa7 = await consultarEstatusSA7(orden.ordenPagoId);

    if (!sa7.pagado) {
      return NextResponse.json({ pagado: false, estatusSA7: sa7.estatus });
    }

    await marcarOrdenPagoPagada(orden.ordenPagoId);
    await liberarInfraccionInstante(infraccionId);

    return NextResponse.json({ pagado: true });
  } catch (error) {
    console.error("[VIA][PAGOS][FINALIZAR-INSTANTE]", error);
    return NextResponse.json({ pagado: false, error: "Error al finalizar pago" }, { status: 500 });
  }
}
