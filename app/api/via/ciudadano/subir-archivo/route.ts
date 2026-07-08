import { NextRequest, NextResponse } from "next/server";
import { getExpedienteToken, getExpedienteHost } from "@/lib/via/expediente";
import { query } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const solicitudId = formData.get("solicitudId") as string;
    const tipoDocumento = formData.get("tipoDocumento") as string;
    const archivo = formData.get("file") as File;

    if (!solicitudId || !tipoDocumento || !archivo) {
      return NextResponse.json(
        { error: "solicitudId, tipoDocumento y archivo son requeridos" },
        { status: 400 },
      );
    }

    const esValido =
      archivo.type.startsWith("image/") || archivo.type === "application/pdf";
    if (!esValido) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido" },
        { status: 400 },
      );
    }

    let token: string;
    try {
      token = await getExpedienteToken();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      return NextResponse.json(
        { error: `Error de autenticación con expediente: ${msg}` },
        { status: 500 },
      );
    }

    const now = new Date();
    const anio = now.getFullYear().toString();
    const mes = String(now.getMonth() + 1).padStart(2, "0");

    const host = getExpedienteHost();
    if (!host) {
      return NextResponse.json(
        { error: "EXPEDIENTE_HOST no configurado" },
        { status: 500 },
      );
    }

    const expedienteForm = new FormData();
    expedienteForm.append("file", archivo);
    expedienteForm.append(
      "ruta_personalizada",
      `${anio}/${mes}/${solicitudId}`,
    );
    expedienteForm.append("sistema", process.env.EXPEDIENTE_SISTEMA ?? "sspm");

    let expedienteRes: Response;
    try {
      expedienteRes = await fetch(`${host}/api/upload-custom`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: expedienteForm,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      return NextResponse.json(
        { error: `Error de conexión con expediente: ${msg}` },
        { status: 500 },
      );
    }

    if (!expedienteRes.ok) {
      const body = await expedienteRes.text().catch(() => "");
      return NextResponse.json(
        { error: `Expediente respondió con ${expedienteRes.status}: ${body}` },
        { status: 500 },
      );
    }

    const uploadData = await expedienteRes.json().catch(() => null);
    if (!uploadData?.data?.ruta_relativa) {
      return NextResponse.json(
        { error: "Expediente no devolvió ruta_relativa" },
        { status: 500 },
      );
    }

    const id = crypto.randomUUID();

    await query(
      `INSERT INTO via.v2_documentos_liberacion (id, solicitud_id, tipo_documento, url_documento, estatus_revision)
       VALUES ($1, $2, $3, $4, 'ENVIADO')`,
      [id, solicitudId, tipoDocumento, uploadData.data.ruta_relativa],
    );

    return NextResponse.json({
      success: true,
      data: { ruta: uploadData.data.ruta_relativa },
    });
  } catch (error) {
    console.error("[VIA][CIUDADANO][SUBIR-ARCHIVO]", error);
    return NextResponse.json(
      { error: "Error al subir archivo" },
      { status: 500 },
    );
  }
}
