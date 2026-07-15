import { NextResponse } from "next/server";
import { confirmarPago } from "@/lib/via/pagos";

export async function GET(
  _req: Request,
  context: { params: Promise<{ ordenPagoId: string; infraccionId: string }> },
) {
  try {
    const { ordenPagoId, infraccionId } = await context.params;
    const result = await confirmarPago(ordenPagoId, infraccionId, "PAGADA", "PAGADA_PENDIENTE_VERIFICACION");
    return NextResponse.json(result);
  } catch (error) {
    console.error("[VIA][PAGOS][CONFIRMAR-INSTANTE]", error);
    return NextResponse.json({ pagado: false, error: "Error al confirmar pago" }, { status: 500 });
  }
}
