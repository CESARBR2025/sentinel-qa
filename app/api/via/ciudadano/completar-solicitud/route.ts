import { NextRequest, NextResponse } from "next/server";
import {
  actualizarEstatusSolicitudLiberacion,
  actualizarEstatusDependenciaMesaControl,
} from "@/lib/agente_infracciones/repository";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { infraccionId } = body;

    if (!infraccionId) {
      return NextResponse.json({ error: "infraccionId es requerido" }, { status: 400 });
    }

    await actualizarEstatusSolicitudLiberacion(infraccionId);
    await actualizarEstatusDependenciaMesaControl(infraccionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[VIA][CIUDADANO][COMPLETAR-SOLICITUD]", error);
    return NextResponse.json({ error: "Error al completar solicitud" }, { status: 500 });
  }
}
