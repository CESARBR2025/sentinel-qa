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
        i.id, 
        i.folio, 
        i.nombre_oficial as oficial, 
        i.fecha_hora_inicio as fecha, 
        cat.nombre as tipo_incidente,
        -- CORRECCIÓN: Tomamos la ubicación de la tabla 'incidentes' (i)
        i.calle, 
        i.colonia, 
        i.entre_calles,
        -- Los resultados sí los tomamos de 'incidente_reporte_campo' (r)
        r.hay_detencion as tiene_iph,
        (r.vehiculos_recuperados IS NOT NULL AND r.vehiculos_recuperados <> '') as tiene_veh,
        (r.objetos_recuperados IS NOT NULL AND r.objetos_recuperados <> '') as tiene_obj
      FROM incidentes i
      INNER JOIN incidente_reporte_campo r ON i.id = r.incidente_id
      LEFT JOIN cat_tipos_incidente cat ON i.tipo_incidente_id = cat.id
      WHERE i.canal = 'radio'
      ORDER BY i.creado_en DESC
    `;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : (result as any).rows || [];
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}