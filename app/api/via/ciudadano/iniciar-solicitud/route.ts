import { NextRequest, NextResponse } from "next/server";
import { queryVia } from "@/lib/via/db";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { infraccionId, tipoLiberacion, esEmpresa, nombreEmpresa, rfcEmpresa, nombreRespFiscal, appaternoRespFiscal, apmaternoRespFiscal } = body;

    if (!infraccionId) {
      return NextResponse.json({ error: "infraccionId es requerido" }, { status: 400 });
    }

    const id = crypto.randomUUID();

    const result = await queryVia(
      `INSERT INTO via.v2_solicitudes_liberacion (id, infraccion_id, tipo_liberacion, es_empresa, nombre_empresa, rfc_empresa, nombre_resp_fiscal, appaterno_resp_fiscal, apmaterno_resp_fiscal, estatus)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'EN_PROCESO_LIBERACIONES')
       RETURNING id`,
      [id, infraccionId, tipoLiberacion || null, esEmpresa || false, nombreEmpresa || null, rfcEmpresa || null, nombreRespFiscal || null, appaternoRespFiscal || null, apmaternoRespFiscal || null],
    );

    return NextResponse.json({ solicitudId: result.rows[0].id });
  } catch (error) {
    console.error("[VIA][CIUDADANO][INICIAR-SOLICITUD]", error);
    return NextResponse.json({ error: "Error al iniciar solicitud" }, { status: 500 });
  }
}
