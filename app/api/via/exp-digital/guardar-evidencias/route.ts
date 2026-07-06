import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getExpedienteToken, getExpedienteHost } from "@/lib/via/expediente";
import { queryVia } from "@/lib/via/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const formData = await req.formData();
    const idInfraccion = formData.get("idInfraccion") as string;
    const evidencias = formData.getAll("evidencias") as File[];

    if (!idInfraccion) {
      return NextResponse.json({ message: "idInfraccion es requerido" }, { status: 400 });
    }
    if (!evidencias.length) {
      return NextResponse.json({ message: "Debe enviarse al menos una evidencia" }, { status: 400 });
    }

    const token = await getExpedienteToken();
    const now = new Date();
    const anio = now.getFullYear().toString();
    const mes = String(now.getMonth() + 1).padStart(2, "0");
    const sistema = process.env.EXPEDIENTE_SISTEMA ?? "sspm";
    const host = getExpedienteHost();
    const uploadUrl = `${host}/api/upload-custom`;

    console.log(`[VIA][EXP-DIGITAL][EVIDENCIAS] Iniciando subida de ${evidencias.length} evidencia(s). host=${host} sistema=${sistema}`);

    const rutas: string[] = [];

    for (const [index, evidencia] of evidencias.entries()) {
      const esValido =
        evidencia.type.startsWith("image/") || evidencia.type === "application/pdf";
      if (!esValido) {
        return NextResponse.json({
          message: "Tipo de archivo no permitido",
          archivo: evidencia.name,
          mimeType: evidencia.type,
        }, { status: 400 });
      }

      const extension = evidencia.name.split(".").pop() ?? "jpg";
      const archivoRenombrado = new File(
        [evidencia],
        `EVIDENCIA_${Date.now()}_${index}.${extension}`,
        { type: evidencia.type },
      );

      console.log(`[VIA][EXP-DIGITAL][EVIDENCIAS] Subiendo evidencia ${index + 1}/${evidencias.length}: ${archivoRenombrado.name}`);

      const expedienteForm = new FormData();
      expedienteForm.append("file", archivoRenombrado);
      expedienteForm.append("ruta_personalizada", `${anio}/${mes}/${idInfraccion}`);
      expedienteForm.append("sistema", sistema);

      const expedienteRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: expedienteForm,
      });

      if (!expedienteRes.ok) {
        const errorBody = await expedienteRes.text();
        console.error(
          `[VIA][EXP-DIGITAL][EVIDENCIAS] Error subiendo evidencia ${index + 1}. Status: ${expedienteRes.status}. Response: ${errorBody}. URL: ${uploadUrl}`,
        );
        return NextResponse.json({
          message: "Error al subir evidencia",
          debug: { archivoOriginal: evidencia.name, archivoRenombrado: archivoRenombrado.name, errorBody },
        }, { status: 500 });
      }

      const responseJson = await expedienteRes.json();
      rutas.push(responseJson.data.ruta_relativa);
      console.log(`[VIA][EXP-DIGITAL][EVIDENCIAS] Evidencia ${index + 1} subida. Ruta: ${responseJson.data.ruta_relativa}`);
    }

    console.log(`[VIA][EXP-DIGITAL][EVIDENCIAS] Guardando ${rutas.length} ruta(s) en BD para infracción ${idInfraccion}`);
    await queryVia(
      `UPDATE via.v2_infracciones
       SET evidencias = $1::jsonb,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [JSON.stringify(rutas), idInfraccion],
    );

    return NextResponse.json({ message: "Evidencias guardadas correctamente", data: rutas });
  } catch (error) {
    console.error("[VIA][EXP-DIGITAL][GUARDAR-EVIDENCIAS]", error);
    return NextResponse.json({
      message: error instanceof Error ? error.message : "Error interno",
    }, { status: 500 });
  }
}
