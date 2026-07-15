import { NextRequest, NextResponse } from "next/server";
import { insertarSolicitudLiberacion } from "@/lib/agente_infracciones/repository";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { infraccionId, tipoLiberacion, esEmpresa, nombreEmpresa, rfcEmpresa, nombreRespFiscal, appaternoRespFiscal, apmaternoRespFiscal } = body;

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

    return NextResponse.json({ solicitudId });
  } catch (error) {
    console.error("[VIA][CIUDADANO][INICIAR-SOLICITUD]", error);
    return NextResponse.json({ error: "Error al iniciar solicitud" }, { status: 500 });
  }
}
