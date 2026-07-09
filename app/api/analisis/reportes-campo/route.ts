/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    const result = await query(
      `SELECT 
        rc.id, 
        rc.ofi_folio_cad AS "folio", 
        'N/D' AS "oficial",
        rc.created_at AS "fecha", 
        rc.delito AS "tipo_incidente",
        rd.folio_denuncia AS "folio_denuncia", 
        rc.ofi_calle AS "calle", 
        rc.ofi_colonia AS "colonia", 
        COALESCE(rc.ofi_hay_detencion, false) AS "tiene_iph",
        (rc.ofi_vehiculos IS NOT NULL AND rc.ofi_vehiculos::text <> '[]') AS "tiene_veh",
        (rc.ofi_objetos_recuperados IS NOT NULL AND rc.ofi_objetos_recuperados <> '') AS "tiene_obj"
      FROM ofi_reportes_campo rc
      LEFT JOIN ofi_reporte_denuncia rd ON rd.reporte_campo_id = rc.id
      ORDER BY rc.created_at DESC`,
    );

    return NextResponse.json(result.rows);

  } catch (error: any) {
    // IMPORTANTE: Mira este log en tu terminal de VS Code si sale error 500
    console.error("========== ERROR ==========");
  console.error(error);
  console.error("MESSAGE:", error?.message);
  console.error("DETAIL:", error?.detail);

    return NextResponse.json(
      { message: "Error en la base de datos", details: error.message }, 
      { status: 500 }
    );
  }
}