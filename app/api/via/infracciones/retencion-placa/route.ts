import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { queryVia } from "@/lib/via/db";

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'El campo "id" es requerido.' }, { status: 400 });
    }

    const resultado = await queryVia(
      `UPDATE via.v2_infracciones
       SET estatus = 'PENDIENTE_PAGO',
           estatus_dependencia = 'PLACA_RETENIDA_EN_TRANSITO',
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, folio, estatus, estatus_dependencia`,
      [id],
    );

    if (resultado.rows.length === 0) {
      return NextResponse.json({ error: "No se encontró la infracción con el ID proporcionado." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Infracción marcada con placa retenida en tránsito.",
      infraccion: resultado.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar retención de placa:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
