/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { verificarAccesoAnalisisApi } from '@/lib/analisis/permisos';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  const chequeo = await verificarAccesoAnalisisApi(session.user.id, 'ver');
  if (chequeo) return chequeo;

  try {
    const { id } = await params;

    const query = sql`
      SELECT

        -- ===========================
        -- PASO 1 - DETENIDO
        -- ===========================
        dd.calle                       AS "calleDetenido",
        dd.numero                      AS "numeroDetenido",
        dd.colonia                     AS "coloniaDetenido",
        dd.latitud                     AS "latitudDetenido",
        dd.longitud                    AS "longitudDetenido",

        -- ===========================
        -- PASO 2 - ARRESTO
        -- ===========================
        rd.lugar_apoyo                 AS "calleArresto",
        rd.colonia_apoyo               AS "coloniaArresto",
        rd.sector                      AS "sectorArresto",

        -- ===========================
        -- PASO 4 - FOLIOS
        -- ===========================
        rd.iph                         AS "folioIPH",
        rd.folio_denuncia              AS "folio911",

        rd.fecha_avistamiento          AS "fechaEvento",
        rd.fecha_reporte               AS "fechaReporte",

        rd.hora_reporte                AS "horaReporte",
        rd.hora_avistamiento           AS "horaInicioEvento",
        rd.hora_fin_denuncia           AS "horaFinalEvento",

        -- ===========================
        -- PASO 5 - HECHO
        -- ===========================
        rc.delito                      AS "delito",
        rc.modus_operandi              AS "modusOperandi",
        rc.ofi_objetos_recuperados     AS "articulosObjetos",

        rd.lugar_hecho                 AS "calleHecho",
        rd.colonia_hecho               AS "coloniaHecho",

        rd.latitud                     AS "latitudHecho",
        rd.longitud                    AS "longitudHecho",

        rd.sector                      AS "sectorHecho",
        rd.crp                         AS "crpUnidad",

        -- ===========================
        -- PASO 6 - AFECTADO
        -- ===========================
        rd.domicilio_calle             AS "calleAfectado",
        rd.domicilio_numero            AS "numeroAfectado",
        rd.domicilio_colonia           AS "coloniaAfectado",
        rd.domicilio_municipio         AS "municipioAfectado",
        rd.id as "reporteDenunciaId"

      FROM ofi_reportes_campo rc

      INNER JOIN ofi_reporte_denuncia rd
        ON rd.reporte_campo_id = rc.id

      LEFT JOIN ofi_detalles_asegurados dd
        ON dd.reporte_campo_id = rc.id

      WHERE rc.id = ${id}

      LIMIT 1;
    `;

    const result = await db.execute(query);

    const rows = Array.isArray(result)
      ? result
      : (result as any).rows || [];

    return NextResponse.json(rows[0] ?? {});
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}