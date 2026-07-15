import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { OficialesViaService } from "@/features/via/oficiales/service";
import { InfraccionesService } from "@/features/via/infracciones/service";
import { sanitizeCrearInfraccionPayload } from "@/features/via/infracciones/service";
import { verificarRolOficial } from "@/lib/oficial/service";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    if (!(await verificarRolOficial(session.user.id))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const oficialId = await OficialesViaService.obtenerOficialId(
      session.user.id,
    );
    const body = await request.json();
    const payload = sanitizeCrearInfraccionPayload(body, oficialId);

    console.log(payload);
    const result =
      await InfraccionesService.registrarNuevaInfraccionSV(payload);

    return NextResponse.json(
      { message: "Infracción registrada exitosamente", data: result },
      { status: 201 },
    );
  } catch (error) {
    console.error("[API][VIA][INFRACCIONES][REGISTRAR]", error);
    const msg =
      error instanceof Error ? error.message : "Error interno del servidor";
    const detail =
      error && typeof error === "object" ? (error as any).detail : null;
    return NextResponse.json({ error: msg, detail }, { status: 500 });
  }
}
