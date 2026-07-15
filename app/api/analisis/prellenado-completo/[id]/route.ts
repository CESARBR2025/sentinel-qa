import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { obtenerPrellenadoCompleto } from "@/lib/monitorista/repository";
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

    const row = await obtenerPrellenadoCompleto(id);

    if (!row) {
      return NextResponse.json(
        { error: "Registro no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(row);
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