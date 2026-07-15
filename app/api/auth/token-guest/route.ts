import { NextRequest, NextResponse } from "next/server";

const GUEST_TOKEN_URL = "https://sanjuandelrio.sytes.net:3044/api/auth/guest-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { codigo_invitacion, nombre_invitado } = body;

    if (!codigo_invitacion || !nombre_invitado) {
      return NextResponse.json(
        { ok: false, message: "codigo_invitacion y nombre_invitado son requeridos" },
        { status: 400 },
      );
    }

    const year = new Date().getFullYear();
    const fecha = new Date();
    const yy = String(fecha.getFullYear()).slice(-2);
    const mm = String(fecha.getMonth() + 1).padStart(2, "0");
    const dd = String(fecha.getDate()).padStart(2, "0");
    const fechaCompacta = `${yy}${mm}${dd}`;
    const codigoFinal = `INV-${year}-${fechaCompacta}`;

    const response = await fetch(GUEST_TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo_invitacion: codigoFinal,
        nombre_invitado: String(codigo_invitacion).trim(),
      }),
    });

    const rawResponse = await response.text();
    let data;

    try {
      data = JSON.parse(rawResponse);
    } catch {
      data = rawResponse;
    }

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, message: "Error servicio externo", error: data },
        { status: response.status },
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("ERROR TOKEN GUEST:", error);
    return NextResponse.json({ ok: false, message: "Error interno del servidor" }, { status: 500 });
  }
}
