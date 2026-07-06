import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getExpedienteToken } from "@/lib/via/expediente";
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
    const rutas: string[] = [];

    for (const [index, evidencia] of evidencias.entries()) {
      const esValido =
        evidencia.type.startsWith("image/") || evidencia.type === "application/pdf";
      if (!esValido) {
        return NextResponse.json({
          message: "Tipo de archivo no permitido",
          archivo: evidencia.name,
        }, { status: 400 });
      }

      const extension = evidencia.name.split(".").pop() ?? "jpg";
      const archivoRenombrado = new File(
        [evidencia],
        `EVIDENCIA_${Date.now()}_${index}.${extension}`,
        { type: evidencia.type },
      );

      const expedienteForm = new FormData();
      expedienteForm.append("file", archivoRenombrado);
      expedienteForm.append("ruta_personalizada", `${anio}/${mes}/${idInfraccion}`);
      expedienteForm.append("sistema", process.env.EXPEDIENTE_SISTEMA ?? "sspm");

      const expedienteRes = await fetch(
        `${process.env.EXPEDIENTE_HOST}/api/upload-custom`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: expedienteForm,
        },
      );

      if (!expedienteRes.ok) {
        const errorBody = await expedienteRes.text();
        return NextResponse.json({
          message: "Error al subir evidencia",
          debug: { archivoOriginal: evidencia.name, archivoRenombrado: archivoRenombrado.name, errorBody },
        }, { status: 500 });
      }

      const responseJson = await expedienteRes.json();
      rutas.push(responseJson.data.ruta_relativa);
    }

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
