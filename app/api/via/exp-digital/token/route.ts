import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getExpedienteToken } from "@/lib/via/expediente";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const token = await getExpedienteToken();
    return NextResponse.json({ token });
  } catch (error) {
    console.error("[VIA][EXP-DIGITAL][TOKEN]", error);
    return NextResponse.json({ error: "Error al obtener token" }, { status: 500 });
  }
}
