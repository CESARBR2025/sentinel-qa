import { NextRequest, NextResponse } from "next/server";
import { queryVia } from "@/lib/via/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { infraccionId, tipoLiberacion, esEmpresa, nombreTitular, appaternoTitular, apmaternoTitular, curpTitular, correoTitular, nombreEmpresa, rfcEmpresa } = body;

    if (!infraccionId) {
      return NextResponse.json({ error: "infraccionId es requerido" }, { status: 400 });
    }

    const result = await queryVia(
      `INSERT INTO via.v2_solicitudes_liberacion (infraccion_id, tipo_liberacion, es_empresa, nombre_titular_liberacion, appaterno_titular_liberacion, apmaterno_titular_liberacion, curp_titular_liberacion, correo_titular_liberacion, nombre_empresa, rfc_empresa, estatus)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'EN_PROCESO_LIBERACIONES')
       RETURNING id`,
      [infraccionId, tipoLiberacion || null, esEmpresa || false, nombreTitular || null, appaternoTitular || null, apmaternoTitular || null, curpTitular || null, correoTitular || null, nombreEmpresa || null, rfcEmpresa || null],
    );

    return NextResponse.json({ success: true, data: { id: result.rows[0].id } });
  } catch (error) {
    console.error("[VIA][CIUDADANO][INICIAR-SOLICITUD]", error);
    return NextResponse.json({ error: "Error al iniciar solicitud" }, { status: 500 });
  }
}
