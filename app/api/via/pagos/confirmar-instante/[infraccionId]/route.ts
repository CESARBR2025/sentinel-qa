import { NextRequest, NextResponse } from "next/server";
import { confirmarPago } from "@/lib/via/pagos";
import { verificarAccesoCiudadano } from "@/lib/via/auth-ciudadano";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ infraccionId: string }> },
) {
  try {
    const { infraccionId } = await context.params;

    if (!(await verificarAccesoCiudadano(req, infraccionId))) {
      return NextResponse.json({ pagado: false, error: "No autorizado" }, { status: 401 });
    }

    const result = await confirmarPago(infraccionId, "PAGADA", "PAGADA_PENDIENTE_VERIFICACION");
    return NextResponse.json(result);
  } catch (error) {
    console.error("[VIA][PAGOS][CONFIRMAR-INSTANTE]", error);
    return NextResponse.json({ pagado: false, error: "Error al confirmar pago" }, { status: 500 });
  }
}
