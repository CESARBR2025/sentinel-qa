import { NextResponse } from "next/server";
import { confirmarPago } from "@/lib/via/pagos";

export async function GET(
  _req: Request,
  context: { params: Promise<{ infraccionId: string }> },
) {
  try {
    const { infraccionId } = await context.params;
    const result = await confirmarPago(infraccionId, "PAGADA", "PAGADA_PENDIENTE_VERIFICACION");
    return NextResponse.json(result);
  } catch (error) {
    console.error("[VIA][PAGOS][CONFIRMAR-INSTANTE]", error);
    return NextResponse.json({ pagado: false, error: "Error al confirmar pago" }, { status: 500 });
  }
}
