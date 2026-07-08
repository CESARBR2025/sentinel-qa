import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { infraccionId } = body;

    if (!infraccionId) {
      return NextResponse.json({ error: "infraccionId es requerido" }, { status: 400 });
    }

    await query(
      `UPDATE via.v2_solicitudes_liberacion SET estatus = 'EN_PROCESO_LIBERACIONES', updated_at = CURRENT_TIMESTAMP WHERE infraccion_id = $1`,
      [infraccionId],
    );

    await query(
      `UPDATE via.v2_infracciones SET estatus_dependencia = 'MESA_DE_CONTROL_REVISION', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [infraccionId],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VIA][CIUDADANO][COMPLETAR-SOLICITUD]", error);
    return NextResponse.json({ error: "Error al completar solicitud" }, { status: 500 });
  }
}
