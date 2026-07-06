import { NextRequest, NextResponse } from "next/server";
import { queryVia } from "@/lib/via/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { solicitudId, infraccionId } = body;

    if (!solicitudId || !infraccionId) {
      return NextResponse.json({ error: "solicitudId e infraccionId son requeridos" }, { status: 400 });
    }

    await queryVia(
      `UPDATE via.v2_solicitudes_liberacion SET estatus = 'ESPERA_REVISION', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [solicitudId],
    );

    await queryVia(
      `UPDATE via.v2_infracciones SET estatus_dependencia = 'ESPERA_REVISION', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [infraccionId],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VIA][CIUDADANO][COMPLETAR-SOLICITUD]", error);
    return NextResponse.json({ error: "Error al completar solicitud" }, { status: 500 });
  }
}
