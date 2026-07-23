import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(
  _req: Request,
  context: { params: Promise<{ infraccionId: string }> },
) {
  try {
    const { infraccionId } = await context.params;

    const result = await query(
      `SELECT i.estatus
       FROM via.v2_infracciones i
       JOIN via.v2_ordenes_pago_sa7 o ON o.infraccion_id = i.id AND o.vigente = true
       WHERE i.id = $1`,
      [infraccionId],
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ pagado: false, error: "Sin infracción u orden vigente" }, { status: 400 });
    }

    const estatus = result.rows[0].estatus as string | undefined;
    const pagado = ["PAGADA", "CERRADA", "PAGADA_FORZADA_ADMIN"].includes(estatus ?? "");

    return NextResponse.json({ pagado, estatus });
  } catch (error) {
    console.error("[VIA][PAGOS][VERIFICAR-PAGO-PRUEBAS]", error);
    return NextResponse.json({ pagado: false, error: "Error al verificar pago de prueba" }, { status: 500 });
  }
}
