/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { sql } from "drizzle-orm";

export async function POST(request: Request) {
  // 1. Validar la sesión
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 2. Helper para limpiar datos: convierte "" en null para que el SP use sus COALESCE
    const clean = (val: any) => (val === "" || val === undefined ? null : val);

    // Helper para asegurar booleanos (el form manda "true"/"false" como strings)
    const toBool = (val: any) => {
      if (val === "true" || val === true || val === "on") return true;
      if (val === "false" || val === false) return false;
      return null;
    };
console.log(body);
    // 3. Ejecutar el procedimiento almacenado
    // Nota: Usamos una consulta directa para llamar al SP y capturar el OUT parameter
    await db.execute(sql`
        CALL insertar_reporte_d1(
          ${clean(body.folioDenuncia)}, 
          ${clean(body.iph)}, 
          ${clean(body.folioCu)}, 
          ${clean(body.corporacion)}, 
          ${clean(body.sector)}, 
          ${clean(body.grupoAdscripcion)},
          ${clean(body.fechaReporte)}, 
          ${clean(body.horaReporte)}, 
          ${clean(body.fechaAvistamiento)}, 
          ${clean(body.horaAvistamiento)},
          ${clean(body.fechaDespacho)}, 
          ${clean(body.horaDespacho)}, 
          ${clean(body.fechaConfirmacion)}, 
          ${clean(body.horaConfirmacion)},
          ${clean(body.fechaLlegada)}, 
          ${clean(body.horaLlegada)}, 
          ${clean(body.horaInicioDenuncia)}, 
          ${clean(body.horaFinDenuncia)},
          ${clean(body.horaTerminoAtencion)}, 
          ${clean(body.horaCuestionario)},
          ${clean(body.lugarHecho)}, 
          ${clean(body.lugarApoyo)}, 
          ${clean(body.coloniaHecho)},
          ${clean(body.coloniaApoyo)} ,
          ${clean(body.municipio)}, 
          ${clean(body.latitudHecho)}, 
          ${clean(body.longitudHecho)},
          ${clean(body.nominaMando)}, 
          ${clean(body.policiaCargo)},
          ${clean(body.tipoEvento)}, 
          ${clean(body.delito)}, 
          ${toBool(body.violencia)},    
          ${clean(body.crp)}, 
          ${clean(body.policiaDenuncia)}, 
          ${clean(body.policiaFirmaD1)}, 
          ${clean(body.policiaIngresaCu)}, 
          ${toBool(body.requirioTablet)}, 
          ${toBool(body.funcionabaTablet)},
          ${Number(body.ofendidoHombre) || 0}, 
          ${Number(body.ofendidoMujer) || 0}, 
          ${Number(body.numCuestionarios) || 0}, 
          ${toBool(body.intervinoGs)},
          ${toBool(body.seGeneroD1)}, 
          ${toBool(body.seVaAGenerarD1)}, 
          ${clean(body.observaciones)},
          ${session.user.id},
          NULL -- Este es el placeholder para el parámetro OUT p_id_generado
        )
    `);

    return NextResponse.json(
      {
        success: true,
        message: "Reporte D1 registrado exitosamente en la base de datos.",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error en API D1 (Stored Procedure):", error);

    // Manejo de errores específicos de Postgres (ej. Folio duplicado)
    if (error.message?.includes("unique constraint")) {
      return NextResponse.json(
        { error: "El Folio de Denuncia ya existe." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Error interno al procesar el reporte." },
      { status: 500 },
    );
  }
}
