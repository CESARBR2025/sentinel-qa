/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; 
import { sql } from 'drizzle-orm'; 
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "No autorizado" }, { status: 401 });

    // SQL PURO basado exactamente en tu DDL
    const query = sql`
      SELECT 
        rc.id, 
        rc.ofi_folio_cad as "folio", 
        'N/D' as "oficial",
        rc.created_at as "fecha", 
        rc.delito as "tipo_incidente",
                rd.folio_denuncia as "folio_denuncia", 

        rc.ofi_calle as "calle", 
        rc.ofi_colonia as "colonia", 
        -- Usamos COALESCE para que si no hay denuncia, el valor sea false y no null
        COALESCE(rc.ofi_hay_detencion, false) as "tiene_iph",
        -- Verificación de vehículos: si no es nulo y no es un array vacío
        (rc.ofi_vehiculos IS NOT NULL AND rc.ofi_vehiculos::text <> '[]') as "tiene_veh",
        -- Verificación de objetos
        (rc.ofi_objetos_recuperados IS NOT NULL AND rc.ofi_objetos_recuperados <> '') as "tiene_obj"
      FROM ofi_reportes_campo rc
      LEFT JOIN ofi_reporte_denuncia rd ON rd.reporte_campo_id = rc.id
      ORDER BY rc.created_at DESC
    `;

    const result = await db.execute(query);

    // Extracción segura de filas
    const rows = Array.isArray(result) ? result : (result as any).rows || [];

    return NextResponse.json(rows);

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