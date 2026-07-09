import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { tienePermiso } from "@/lib/permisos/core";
import { getExpedienteToken, getExpedienteHost } from "@/lib/via/expediente";
import { obtenerEstatusInfraccion, finalizarInfraccionCorralon } from "@/lib/corralon/repository";

function mapearEstatusFinal(estatusDep: string): string {
  if (estatusDep === "LIBERADA_POR_ACCIDENTE") return "FINALIZADA_ACCIDENTE";
  if (estatusDep === "DELITO" || estatusDep === "LIBERADA_POR_DELITO")
    return "FINALIZADA_DELITO";
  return "FINALIZADA_INFRACCION";
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const puede = await tienePermiso(
      session.user.id,
      "corralon_solicitudes",
      "ver",
    );
    if (!puede) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const formData = await req.formData();
    const infraccionId = formData.get("infraccionId") as string;
    const archivo = formData.get("file") as File | null;

    if (!infraccionId || !archivo) {
      return NextResponse.json(
        { error: "infraccionId y file son requeridos" },
        { status: 400 },
      );
    }

    const esValido =
      archivo.type.startsWith("image/") || archivo.type === "application/pdf";
    if (!esValido) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo imágenes y PDF." },
        { status: 400 },
      );
    }

    // Obtener estatus_dependencia actual
    const estatusDepActual = await obtenerEstatusInfraccion(infraccionId);
    if (estatusDepActual === null) {
      return NextResponse.json(
        { error: "Infracción no encontrada" },
        { status: 404 },
      );
    }

    // Subir a expediente digital
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

    const host = getExpedienteHost();
    if (!host) {
      return NextResponse.json(
        { error: "EXPEDIENTE_HOST no configurado" },
        { status: 500 },
      );
    }

    const now = new Date();
    const anio = now.getFullYear().toString();
    const mes = String(now.getMonth() + 1).padStart(2, "0");

    const expedienteForm = new FormData();
    expedienteForm.append("file", archivo);
    expedienteForm.append(
      "ruta_personalizada",
      `${anio}/${mes}/${infraccionId}`,
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
        {
          error: `Expediente respondió con ${expedienteRes.status}: ${body}`,
        },
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

    const urlDocumento = uploadData.data.ruta_relativa;
    const nuevoEstatusDep = mapearEstatusFinal(estatusDepActual);

    await finalizarInfraccionCorralon(infraccionId, urlDocumento, nuevoEstatusDep)

    return NextResponse.json({
      success: true,
      data: {
        url: urlDocumento,
        estatus: "FINALIZADA",
        estatusDependencia: nuevoEstatusDep,
      },
    });
  } catch (error) {
    console.error("[CORRALON][SUBIR-ARCHIVO]", error);
    return NextResponse.json(
      { error: "Error interno al subir archivo" },
      { status: 500 },
    );
  }
}
