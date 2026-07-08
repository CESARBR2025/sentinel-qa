import { NextRequest, NextResponse } from "next/server";
import { queryVia } from "@/lib/via/db";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ infraccionId: string }> },
) {
  try {
    const { infraccionId } = await context.params;

    const solicitudRes = await queryVia(
      `SELECT id, tipo_liberacion, es_empresa, nombre_empresa, rfc_empresa, estatus
       FROM via.v2_solicitudes_liberacion
       WHERE infraccion_id = $1
       LIMIT 1`,
      [infraccionId],
    );

    const docsRes = await queryVia(
      `SELECT DISTINCT ON (dl.tipo_documento)
              dl.id, dl.tipo_documento, dl.url_documento, dl.estatus_revision, dl.observaciones, dl.created_at
       FROM via.v2_documentos_liberacion dl
       JOIN via.v2_solicitudes_liberacion sl ON sl.id = dl.solicitud_id
       WHERE sl.infraccion_id = $1
       ORDER BY dl.tipo_documento, dl.created_at DESC`,
      [infraccionId],
    );

    return NextResponse.json({
      solicitud: solicitudRes.rows[0] ?? null,
      documentos: docsRes.rows,
    });
  } catch (error) {
    console.error("[VIA][LIBERACIONES][DOCUMENTOS]", error);
    return NextResponse.json({ error: "Error al obtener documentos" }, { status: 500 });
  }
}
