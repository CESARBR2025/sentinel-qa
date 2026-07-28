import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getToken, subir, descargar } from "@/lib/expediente/v2/client";
import { carpetaOrdenSalida } from "@/lib/expediente/v2/carpetas";
import { serializarRef, parsearRef } from "@/lib/expediente/v2/ref";
import { generarOrdenSalidaVehiculo } from "@/lib/ordenSalida/generarOrdenSalida";
import { verificarAccesoCiudadano } from "@/lib/via/auth-ciudadano";
import { enviarCorreoOrdenLiberacion } from "@/lib/emails/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ infraccionId: string }> },
) {
  try {
    const { infraccionId } = await context.params;

    if (!infraccionId) {
      return NextResponse.json({ error: "infraccionId es requerido" }, { status: 400 });
    }

    if (!(await verificarAccesoCiudadano(req, infraccionId))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const datosRes = await query<Record<string, unknown>>(
      `SELECT i.*, s.es_empresa, s.nombre_empresa, s.rfc_empresa,
              s.nombre_resp_fiscal, s.appaterno_resp_fiscal, s.apmaterno_resp_fiscal,
              g.nombre AS nombre_grua
       FROM via.v2_infracciones i
       LEFT JOIN via.v2_solicitudes_liberacion s ON s.infraccion_id = i.id
       LEFT JOIN via.v2_gruas g ON g.id = i.grua_id
       WHERE i.id = $1
       ORDER BY s.created_at DESC LIMIT 1`,
      [infraccionId],
    );

    if (datosRes.rows.length === 0) {
      return NextResponse.json({ error: "Infracción no encontrada" }, { status: 404 });
    }

    const dbData = datosRes.rows[0] as Record<string, unknown>;

    // ── Si ya existe orden guardada en Expediente, servirla desde ahí ──
    const urlGuardada = dbData.url_orden_salida_liberaciones as string | null;
    if (urlGuardada && urlGuardada !== "NO_DATA") {
      const ref = parsearRef(urlGuardada);
      if (ref) {
        try {
          const token = await getToken();
          const expRes = await descargar(ref);
          if (expRes.ok) {
            const pdfBuffer = Buffer.from(await expRes.arrayBuffer());
            const folio = String(dbData.folio ?? infraccionId).replace(/[^a-zA-Z0-9_-]/g, "_");
            return new NextResponse(pdfBuffer, {
              status: 200,
              headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="orden_salida_${folio}.pdf"`,
              },
            });
          }
        } catch (err) {
          console.error("[DESCARGAR-ORDEN] Error al obtener desde Expediente, regenerando:", err);
        }
      }
    }

    // ── Generar PDF on-demand ──
    const esEmpresa = dbData.es_persona_moral || dbData.es_empresa;

    const tNombre = !esEmpresa
      ? dbData.nombre_titular_liberacion
      : dbData.nombre_resp_fiscal;
    const tPaterno = !esEmpresa
      ? dbData.appaterno_titular_liberacion
      : dbData.appaterno_resp_fiscal;
    const tMaterno = !esEmpresa
      ? dbData.apmaterno_titular_liberacion
      : dbData.apmaterno_resp_fiscal;

    const nombreRecibe = `${tNombre || ""} ${tPaterno || ""} ${tMaterno || ""}`
      .trim()
      .replace(/\s+/g, " ");

    const dataParaPDF = {
      id: dbData.id,
      motivoRetencion: dbData.motivo_retencion || "SIN MOTIVO ESPECIFICADO",
      estadoOrigen: dbData.estado || "QUERÉTARO",
      noSerie: dbData.no_serie_vehiculo || "—",
      garantiaRetenida: dbData.tipo_garantia || "VEHICULO",
      grua: dbData.nombre_grua,
      noOficio: dbData.folio || "0000",
      rfc: esEmpresa,
      responsableFiscal: nombreRecibe,
      nombreTitularCompleto: nombreRecibe,
      empresaFiscal: esEmpresa ? dbData.nombre_empresa : "TITULAR",
      marca: dbData.marca,
      tipoVehiculo: dbData.tipo_vehiculo,
      modelo: dbData.modelo,
      color: dbData.color,
      placa: dbData.placa,
      noExterno: dbData.folio,
      nombreTitular: dbData.nombre_titular_liberacion || dbData.nombre_infractor || "",
      estado: dbData.estado,
      anio_vehiculo: dbData.anio_vehiculo,
      curp_titular: dbData.curp_titular_liberacion,
    };

    const pdfBuffer = await generarOrdenSalidaVehiculo({ data: dataParaPDF });

    // ── Guardar en Expediente ──
    try {
      const ref = await subir(
        { buffer: pdfBuffer, nombre: `orden_salida_${infraccionId}.pdf`, tipo: "application/pdf" },
        carpetaOrdenSalida(infraccionId),
      );
      await query(
        `UPDATE via.v2_infracciones SET url_orden_salida_liberaciones = $2, updated_at = NOW() WHERE id = $1`,
        [infraccionId, serializarRef(ref)],
      );
    } catch (err) {
      console.error("[DESCARGAR-ORDEN] Error al guardar en Expediente:", err);
    }

    // ── Enviar correo a titular e infractor ──
    const correoTitular = (dbData.correo_titular_liberacion || dbData.correo_infractor) as string | undefined;
    const nombreTitular = (dbData.nombre_titular_liberacion || dbData.nombre_infractor || "") as string;
    if (correoTitular && nombreTitular) {
      try {
        await enviarCorreoOrdenLiberacion({
          correoTitular,
          correoInfractor: dbData.correo_infractor as string | undefined,
          nombreTitular,
          idInfraccion: infraccionId,
          folio: (dbData.folio || "—") as string,
          placa: (dbData.placa || "—") as string,
          pinAcceso: dbData.pin_acceso as string | undefined,
          pdfBuffer,
        });
      } catch (err) {
        console.error("[DESCARGAR-ORDEN] Error al enviar correo:", err);
      }
    }

    const folio = String(dbData.folio ?? infraccionId).replace(/[^a-zA-Z0-9_-]/g, "_");
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="orden_salida_${folio}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[DESCARGAR-ORDEN] Error interno:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
