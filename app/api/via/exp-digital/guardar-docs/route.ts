import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getExpedienteToken } from "@/lib/via/expediente";
import { queryVia } from "@/lib/via/db";

async function subirArchivo(
  archivo: File,
  idInfraccion: string,
  token: string,
): Promise<string> {
  const now = new Date();
  const anio = now.getFullYear().toString();
  const mes = String(now.getMonth() + 1).padStart(2, "0");
  const form = new FormData();
  form.append("file", archivo);
  form.append("ruta_personalizada", `${anio}/${mes}/${idInfraccion}`);
  form.append("sistema", process.env.EXPEDIENTE_SISTEMA ?? "sspm");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_WS_EXPEDIENTE}/api/upload-custom`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    },
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("[EXPEDIENTE VIA] Error subiendo archivo:", error);
    throw new Error("Error al subir archivo al expediente digital");
  }

  const { data } = await response.json();
  return data.ruta_relativa;
}

function validarArchivo(file: File | null) {
  if (!file) return;
  const esValido =
    file.type.startsWith("image/") || file.type === "application/pdf";
  if (!esValido) {
    throw new Error(`Tipo de archivo no permitido: ${file.name}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const formData = await req.formData();
    const idInfraccion = formData.get("idInfraccion") as string;
    const archivoInapam = formData.get("archivoInapam") as File | null;
    const archivoIne = formData.get("archivoIne") as File | null;
    const archivoTarjetaCirculacion = formData.get(
      "archivoTarjetaCirculacion",
    ) as File | null;

    if (!idInfraccion) {
      return NextResponse.json(
        { message: "idInfraccion es requerido" },
        { status: 400 },
      );
    }

    const tieneDocumentos =
      archivoIne || archivoInapam || archivoTarjetaCirculacion;
    if (!tieneDocumentos) {
      return NextResponse.json(
        { message: "No se enviaron documentos" },
        { status: 400 },
      );
    }

    validarArchivo(archivoInapam);
    validarArchivo(archivoIne);
    validarArchivo(archivoTarjetaCirculacion);

    const token = await getExpedienteToken();

    let urlInapam: string | null = null;
    let urlIne: string | null = null;
    let urlTarjetaCirculacion: string | null = null;

    if (archivoIne) {
      urlIne = await subirArchivo(archivoIne, idInfraccion, token);
    }
    if (archivoInapam) {
      urlInapam = await subirArchivo(archivoInapam, idInfraccion, token);
    }
    if (archivoTarjetaCirculacion) {
      urlTarjetaCirculacion = await subirArchivo(
        archivoTarjetaCirculacion,
        idInfraccion,
        token,
      );
    }

    await queryVia(
      `UPDATE via.v2_infracciones
       SET url_ine = COALESCE($2, url_ine),
           url_inapam = COALESCE($3, url_inapam),
           url_tarjeta_circulacion = COALESCE($4, url_tarjeta_circulacion),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [idInfraccion, urlIne, urlInapam, urlTarjetaCirculacion],
    );

    return NextResponse.json({
      message: "Documentos guardados correctamente",
      data: { urlIne, urlInapam, urlTarjetaCirculacion },
    });
  } catch (error) {
    console.error("[VIA][EXP-DIGITAL][GUARDAR-DOCS]", error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Error interno",
      },
      { status: 500 },
    );
  }
}
