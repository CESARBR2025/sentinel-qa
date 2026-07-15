import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SA7Repository } from "@/features/via/saSiete/repository";
import { verificarRolOficial } from "@/lib/oficial/service";
import { verificarRolInfracciones } from "@/lib/agente_infracciones/service";
import { verificarRolLiberaciones } from "@/lib/agente_liberaciones/service";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const autorizado =
      (await verificarRolOficial(session.user.id)) ||
      (await verificarRolInfracciones(session.user.id)) ||
      (await verificarRolLiberaciones(session.user.id));
    if (!autorizado) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const infraccionId = searchParams.get("infraccion_id");

    if (!infraccionId) {
      return NextResponse.json({ ok: false, message: "infraccion_id es requerido" }, { status: 400 });
    }

    const orden = await SA7Repository.buscarOrdenPorInfraccionId(infraccionId);
    if (!orden) {
      return NextResponse.json({ ok: false, message: "No se encontró la orden" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, data: { orden_pago_id: orden.ordenPagoId } });
  } catch (error) {
    console.error("Error buscar-orden:", error);
    return NextResponse.json({ ok: false, message: "Error interno del servidor" }, { status: 500 });
  }
}
