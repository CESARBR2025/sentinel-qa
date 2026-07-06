import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const formData = await request.formData();
  const idInfraccion = formData.get("idInfraccion");

  return NextResponse.json({
    success: true,
    message: "Documentos recibidos",
    data: { idInfraccion },
  });
}
