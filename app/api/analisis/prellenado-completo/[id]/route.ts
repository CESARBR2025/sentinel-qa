/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { verificarAccesoAnalisisApi } from "@/lib/analisis/permisos";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  const chequeo = await verificarAccesoAnalisisApi(
    session.user.id,
    "ver"
  );

  if (chequeo) return chequeo;

  try {
    const { id } = await params;

    console.log("PARAM ID =", JSON.stringify(id));
    console.log(typeof id);

    const query = sql`
      SELECT

        -- =====================================
        -- PASO 1
        -- =====================================

        CONCAT_WS(
          ' ',
          da.nombre_detenido,
          da.ap_paterno_detenido,
          da.ap_materno_detenido
        )                             AS "nombreDetenido",

        rc.ofi_folio_cad              AS "folio",

        iph.fecha_nacimiento          AS "fechaNacimiento",

        iph.ciudad_origen             AS "origen",

        iph.genero                    AS "genero",

        CONCAT_WS(
          ', ',
          da.calle,
          da.numero,
          da.colonia
        )                             AS "domicilio",

        rc.delito                     AS "eventosDelictivos",

        -- =====================================
        -- PASO 2
        -- =====================================

        (
          rd.fecha_reporte::text || ' ' ||
          rd.hora_reporte::text
        )                             AS "fechaHora",

        iph.rnd                       AS "rnd",

        ''                            AS "expediente",

        CONCAT_WS(
          ', ',
          rd.lugar_hecho,
          rd.colonia_hecho
        )                             AS "lugarEvento",

        CONCAT_WS(
          ', ',
          rd.lugar_apoyo,
          rd.colonia_apoyo
        )                             AS "lugarDetencion",

        rd.iph                        AS "iph",

        ''                            AS "nexosDelictivos",

        rd.sector                     AS "zonaOperacion",

        ''                            AS "puestaDisposicion",

        rc.modus_operandi             AS "modusOperandi",

        rc.ofi_contenido_reporte      AS "infoAdicional",

        ''                            AS "antecedentes",

        rc.falta_administrativa       AS "faltasAdmin"
FROM iph_detenidos iph
LEFT JOIN ofi_reporte_denuncia rd
    ON rd.folio_denuncia = iph.folio_911
LEFT JOIN ofi_reportes_campo rc
    ON rc.id = rd.reporte_campo_id
LEFT JOIN ofi_detalles_asegurados da
    ON da.reporte_campo_id = rc.id
WHERE iph.id = ${id}

      LIMIT 1;
    `;

    const result = await db.execute(query);

    const rows = Array.isArray(result)
      ? result
      : (result as any).rows || [];

    if (!rows.length) {
      return NextResponse.json(
        { error: "Registro no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error: any) {
  console.error(error);

  return NextResponse.json(
    {
      message: error.message,
      detail: error.detail,
      hint: error.hint,
      position: error.position,
      code: error.code,
    },
    { status: 500 }
  );
}
}