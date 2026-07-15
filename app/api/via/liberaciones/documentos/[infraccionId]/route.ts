import { NextRequest, NextResponse } from "next/server";
import {
  obtenerSolicitudLiberacion,
  obtenerDocumentosLiberacion,
} from "@/lib/agente_infracciones/repository";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ infraccionId: string }> },
) {
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
