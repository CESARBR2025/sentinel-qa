import { NextResponse } from "next/server";
import { marcarGarantiaEntregada } from "@/lib/agente_infracciones/repository";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "id es requerido" }, { status: 400 });
    }

    await marcarGarantiaEntregada(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VIA][INFRACCIONES][LIBERAR-GARANTIA]", error);
    return NextResponse.json({ error: "Error al liberar garantía" }, { status: 500 });
  }
}
