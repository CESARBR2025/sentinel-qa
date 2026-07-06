import { NextRequest, NextResponse } from "next/server";
import { getExpedienteToken, getExpedienteHost } from "@/lib/via/expediente";
import { queryVia } from "@/lib/via/db";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const solicitudId = formData.get("solicitudId") as string;
    const tipoDocumento = formData.get("tipoDocumento") as string;
    const archivo = formData.get("archivo") as File;

    if (!solicitudId || !tipoDocumento || !archivo) {
      return NextResponse.json({ error: "solicitudId, tipoDocumento y archivo son requeridos" }, { status: 400 });
    }

    const esValido = archivo.type.startsWith("image/") || archivo.type === "application/pdf";
    if (!esValido) {
      return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
    }

    const token = await getExpedienteToken();
    const now = new Date();
    const anio = now.getFullYear().toString();
    const mes = String(now.getMonth() + 1).padStart(2, "0");

    const expedienteForm = new FormData();
    expedienteForm.append("file", archivo);
    expedienteForm.append("ruta_personalizada", `${anio}/${mes}/${solicitudId}`);
    expedienteForm.append("sistema", process.env.EXPEDIENTE_SISTEMA ?? "sspm");

    const expedienteRes = await fetch(`${getExpedienteHost()}/api/upload-custom`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: expedienteForm,
    });

    if (!expedienteRes.ok) {
      return NextResponse.json({ error: "Error al subir archivo a expediente" }, { status: 500 });
    }

    const { data } = await expedienteRes.json();

    await queryVia(
      `INSERT INTO via.v2_documentos_liberacion (solicitud_id, tipo_documento, url_documento)
       VALUES ($1, $2, $3)`,
      [solicitudId, tipoDocumento, data.ruta_relativa],
    );

    return NextResponse.json({ success: true, data: { ruta: data.ruta_relativa } });
  } catch (error) {
    console.error("[VIA][CIUDADANO][SUBIR-ARCHIVO]", error);
    return NextResponse.json({ error: "Error al subir archivo" }, { status: 500 });
  }
}
