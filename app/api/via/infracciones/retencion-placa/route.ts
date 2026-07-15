import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { marcarPlacaRetenidaEnTransito } from "@/lib/agente_infracciones/repository";
import { verificarRolOficial } from "@/lib/oficial/service";

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (!(await verificarRolOficial(session.user.id))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'El campo "id" es requerido.' }, { status: 400 });
    }

    const infraccion = await marcarPlacaRetenidaEnTransito(id);

    if (!infraccion) {
      return NextResponse.json({ error: "No se encontró la infracción con el ID proporcionado." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Infracción marcada con placa retenida en tránsito.",
      infraccion,
    });
  } catch (error) {
    console.error("Error al actualizar retención de placa:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
