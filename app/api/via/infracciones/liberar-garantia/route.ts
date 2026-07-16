import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { marcarGarantiaEntregada } from "@/lib/agente_infracciones/repository";
import { verificarRolInfracciones } from "@/lib/agente_infracciones/service";

export async function PATCH(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!(await verificarRolInfracciones(session.user.id))) {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

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
