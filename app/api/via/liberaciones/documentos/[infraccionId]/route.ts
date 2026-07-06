import { NextRequest, NextResponse } from "next/server";
import { queryVia } from "@/lib/via/db";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ infraccionId: string }> },
) {
  try {
    const { infraccionId } = await context.params;
    const result = await queryVia(
      `SELECT dl.id, dl.tipo_documento, dl.url_documento, dl.estatus_revision, dl.observaciones, dl.created_at
       FROM via.v2_documentos_liberacion dl
       JOIN via.v2_solicitudes_liberacion sl ON sl.id = dl.solicitud_id
       WHERE sl.infraccion_id = $1
       ORDER BY dl.created_at DESC`,
      [infraccionId],
    );
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error("[VIA][LIBERACIONES][DOCUMENTOS]", error);
    return NextResponse.json({ error: "Error al obtener documentos" }, { status: 500 });
  }
}
