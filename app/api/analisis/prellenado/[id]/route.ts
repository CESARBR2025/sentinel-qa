/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const query = sql`
      SELECT 
        -- PASO 1 & 2 & 5 (Ubicación base)
        i.calle as "calleDetenido",
        i.numero_exterior as "numeroDetenido",
        i.colonia as "coloniaDetenido",
        i.calle as "calleArresto",
        i.colonia as "coloniaArresto",
        i.latitud as "latitudArresto",
        i.longitud as "longitudArresto",
        i.calle as "calleHecho",
        i.numero_exterior as "numeroHecho",
        i.colonia as "coloniaHecho",
        i.latitud as "latitudHecho",
        i.longitud as "longitudHecho",

        -- PASO 4 (Folios y Tiempos)
        i.folio as "folio911",
        o.iph as "folioIPH",
        o.fecha_avistamiento as "fechaEvento",
        o.fecha_reporte as "fechaReporte",
        o.hora_reporte as "horaReporte",
        o.hora_avistamiento as "horaInicioEvento",
        o.sector as "sectorHecho",
        o.crp as "crpUnidad",

        -- PASO 5 (Hecho)
        r.delito_falta as "delito",
        r.objetos_recuperados as "articulosObjetos",

        -- PASO 6 (Cierre)
        i.nombre_reportante as "nombreAfectado",
        r.vehiculos_recuperados as "marcaVehiculo",
        r.tipo_vehiculo as "tipoVehiculo",
        r.policia_a_cargo as "agenteAprehensor"

      FROM incidentes i
      LEFT JOIN incidente_reporte_campo r ON i.id = r.incidente_id
      LEFT JOIN ofi_reporte_denuncia o ON i.id = o.id 
      WHERE i.id = ${id}
      LIMIT 1
    `;

    const result = await db.execute(query);
    const rows = Array.isArray(result) ? result : (result as any).rows || [];
    const data = rows[0] || null;

    if (!data) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}