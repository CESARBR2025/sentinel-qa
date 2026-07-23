import { NextRequest, NextResponse } from "next/server";
import { insertarSolicitudLiberacion } from "@/lib/agente_infracciones/repository";
import { query } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      infraccionId, tipoLiberacion, esEmpresa,
      nombreEmpresa, rfcEmpresa, nombreRespFiscal, appaternoRespFiscal, apmaternoRespFiscal,
      nombreTitular, appaternoTitular, apmaternoTitular, curpTitular, correoTitular,
    } = body;

    if (!infraccionId) {
      return NextResponse.json({ error: "infraccionId es requerido" }, { status: 400 });
    }

    const id = crypto.randomUUID();

    const solicitudId = await insertarSolicitudLiberacion({
      id,
      infraccionId,
      tipoLiberacion: tipoLiberacion || null,
      esEmpresa: esEmpresa || false,
      nombreEmpresa: nombreEmpresa || null,
      rfcEmpresa: rfcEmpresa || null,
      nombreRespFiscal: nombreRespFiscal || null,
      appaternoRespFiscal: appaternoRespFiscal || null,
      apmaternoRespFiscal: apmaternoRespFiscal || null,
    });

    // Actualizar datos del titular en la infracción si se proporcionaron
    if (nombreTitular || appaternoTitular) {
      await query(
        `UPDATE via.v2_infracciones
         SET nombre_titular_liberacion = COALESCE($1, nombre_titular_liberacion),
             appaterno_titular_liberacion = COALESCE($2, appaterno_titular_liberacion),
             apmaterno_titular_liberacion = COALESCE($3, apmaterno_titular_liberacion),
             curp_titular_liberacion = COALESCE($4, curp_titular_liberacion),
             correo_titular_liberacion = COALESCE($5, correo_titular_liberacion),
             updated_at = NOW()
         WHERE id = $6`,
        [
          nombreTitular || null,
          appaternoTitular || null,
          apmaternoTitular || null,
          curpTitular || null,
          correoTitular || null,
          infraccionId,
        ],
      )
    }

    return NextResponse.json({ solicitudId });
  } catch (error) {
    console.error("[VIA][CIUDADANO][INICIAR-SOLICITUD]", error);
    return NextResponse.json({ error: "Error al iniciar solicitud" }, { status: 500 });
  }
}
