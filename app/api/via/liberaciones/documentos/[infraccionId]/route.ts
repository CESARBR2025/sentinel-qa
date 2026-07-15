import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  obtenerSolicitudLiberacion,
  obtenerDocumentosLiberacion,
} from "@/lib/agente_infracciones/repository";
import { verificarRolLiberaciones } from "@/lib/agente_liberaciones/service";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ infraccionId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!(await verificarRolLiberaciones(session.user.id))) {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  try {
    const { infraccionId } = await context.params;

    const solicitud = await obtenerSolicitudLiberacion(infraccionId);
    const documentos = await obtenerDocumentosLiberacion(infraccionId);

    return NextResponse.json({
      solicitud,
      documentos,
    });
  } catch (error) {
    console.error("[VIA][LIBERACIONES][DOCUMENTOS]", error);
    return NextResponse.json({ error: "Error al obtener documentos" }, { status: 500 });
  }
}
