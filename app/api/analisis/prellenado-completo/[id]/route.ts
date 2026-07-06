/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { verificarAccesoAnalisisApi } from '@/lib/analisis/permisos';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const chequeo = await verificarAccesoAnalisisApi(session.user.id, 'ver');
  if (chequeo) return chequeo;

  try {
    // 1. Esperar el ID (Obligatorio en Next.js 15)
    const { id } = await params;

    // 2. SQL NATIVO - Unión de incidentes, reporte_campo y denuncia
    const result = await db.$client.query(`
      SELECT 
        i.folio as "folio",
        i.calle || ', ' || i.colonia as "domicilio",
        i.descripcion as "eventosDelictivos",
        i.fecha_hora_inicio::text as "fechaHora",
        o.folio_denuncia as "rnd",
        r.expediente_ci as "expediente",
        i.calle || ', ' || i.colonia as "lugarEvento",
        r.lugar_calle || ', ' || r.lugar_colonia as "lugarDetencion",
        o.iph as "iph",
        o.sector as "zonaOperacion",
        r.autoridad_recibe as "puestaDisposicion",
        r.acciones_realizadas as "modusOperandi",
        r.objetos_recuperados as "infoAdicional",
        r.delito_falta as "antecedentes"
      FROM incidentes i
     LEFT JOIN incidente_reporte_campo r
  ON i.id = r.incidente_id

LEFT JOIN ofi_reporte_denuncia o
  ON o.incidente_id = i.id
      WHERE i.id = $1::uuid
      LIMIT 1
    `, [id]);

    const data = result.rows[0];

    if (!data) {
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("ERROR API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}