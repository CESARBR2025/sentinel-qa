import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { InfraccionesService } from "@/features/via/infracciones/service";
import { verificarRolInfracciones } from "@/lib/agente_infracciones/service";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!(await verificarRolInfracciones(session.user.id))) {
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const data = await InfraccionesService.obtenerPorId(id);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("[API][VIA][INFRACCIONES][REGISTRADAS] ERROR:", error);
    if (error && typeof error === "object") {
      const e = error as Record<string, unknown>;
      console.error("  message:", e.message);
      console.error("  detail:", e.detail);
      console.error("  code:", e.code);
      console.error("  schema:", e.schema);
      console.error("  table:", e.table);
      console.error("  column:", e.column);
      console.error("  constraint:", e.constraint);
      console.error("  stack:", (e as unknown as Error).stack);
    }
    const msg = error instanceof Error ? error.message : "Error al obtener infracción";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
