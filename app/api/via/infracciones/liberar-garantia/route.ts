import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id es requerido" }, { status: 400 });
    }

    await query(
      `UPDATE via.v2_infracciones
       SET estatus = 'FINALIZADA', estatus_dependencia = 'GARANTIA_ENTREGADA', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id],
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VIA][INFRACCIONES][LIBERAR-GARANTIA]", error);
    return NextResponse.json({ error: "Error al liberar garantía" }, { status: 500 });
  }
}
