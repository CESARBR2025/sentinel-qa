/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { verificarAccesoAnalisisApi } from '@/lib/analisis/permisos';

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const chequeo = await verificarAccesoAnalisisApi(session.user.id, 'ver');
  if (chequeo) return chequeo;

  try {
    const query = sql`
SELECT
    rc.id,

    rc.folio_reporte_campo         AS folio,
    rc.ofi_oficial_nombre          AS oficial,
    rc.ofi_tipo_incidente          AS tipo_incidente,
    rc.created_at                  AS fecha,

    rc.ofi_calle                   AS calle,
    rc.ofi_colonia                 AS colonia,

    TRUE                           AS tiene_iph,

    rc.ofi_hay_vehiculo            AS tiene_veh,

    CASE
        WHEN rc.ofi_objetos_recuperados IS NOT NULL
         AND rc.ofi_objetos_recuperados <> ''
        THEN TRUE
        ELSE FALSE
    END                            AS tiene_obj

FROM ofi_reportes_campo rc

INNER JOIN ofi_reporte_denuncia rd
    ON rd.reporte_campo_id = rc.id

ORDER BY rc.created_at DESC;
`;

    const result = await db.execute(query);
    const rows = Array.isArray(result)
      ? result
      : (result as any).rows || [];

    return NextResponse.json(rows);

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}