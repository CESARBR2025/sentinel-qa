import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SA7Repository } from "@/features/via/saSiete/repository";

const SA7_URL =
  "https://sanjuandelrio.sytes.net:3044/api/sasiete/qas/generar-orden-completa";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    console.log(session);

    const body = await req.json();
    const {
      infraccion_id,
      nombre_usuario,
      apellidos_usuario,
      folio,
      correoInfractor,
      descuentoAplicado,
      cantidad,
    } = body;

    if (
      !infraccion_id ||
      !nombre_usuario ||
      !folio ||
      !apellidos_usuario ||
      !correoInfractor
    ) {
      return NextResponse.json(
        { ok: false, message: "Faltan campos obligatorios" },
        { status: 400 },
      );
    }

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://via-v2.vercel.app"
        : "http://localhost:3000";

    const tokenRes = await fetch(`${baseUrl}/api/auth/token-guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        codigo_invitacion: `INV-${Date.now()}`,
        nombre_invitado: "SA7_SYSTEM",
      }),
    });
    console.log(tokenRes);

    if (!tokenRes.ok) {
      return NextResponse.json(
        { ok: false, message: "No se pudo obtener token guest" },
        { status: 500 },
      );
    }

    const tokenData = await tokenRes.json();
    const tokenGuest = tokenData.data?.token;
    if (!tokenGuest) {
      return NextResponse.json(
        { ok: false, message: "Token inválido" },
        { status: 500 },
      );
    }

    console.log(tokenGuest);
    let descuento = 1;
    const descuentoNum = Number(descuentoAplicado);
    if (descuentoNum === 70) descuento = 0.3;
    else if (descuentoNum === 50) descuento = 0.5;
    if (cantidad) descuento = cantidad;

    const payloadSA7 = {
      nombreUsuario: nombre_usuario,
      apellidosUsuario: apellidos_usuario,
      rfc: "",
      conceptosIds: ["31378"],
      cantidades: { "31378": descuento },
      referencias: { "31378": [`${nombre_usuario} ${apellidos_usuario}`] },
      id_usuario_general: "17336",
      tipo_tramite: "via_v2_cobro_infracciones_online",
      folio,
    };

    console.log(payloadSA7);
    const sa7Res = await fetch(SA7_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenGuest}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadSA7),
    });

    const result = {
      ordenPagoId: sa7Res.headers.get("x-orden-pago-id") || null,
      estatus: sa7Res.headers.get("x-estatus") || null,
      urlPago: sa7Res.headers.get("x-url-pago") || null,
      urlGuardado: sa7Res.headers.get("x-url-guardado") || null,
      folioOrden: sa7Res.headers.get("x-folio-orden") || null,
      fechaVencimiento: sa7Res.headers.get("x-fecha-vencimiento") || null,
      totalPesos: Number(sa7Res.headers.get("x-total-pesos") || 0),
      totalUmas: Number(sa7Res.headers.get("x-total-umas") || 0),
    };

    await SA7Repository.insertarOrdenPago({
      infraccionId: infraccion_id,
      folioInfraccion: folio,
      nombreUsuario: nombre_usuario,
      apellidosUsuario: apellidos_usuario,
      conceptoId: "31378",
      ...result,
      requestPayload: payloadSA7,
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error("Error generando orden de pago:", error);
    return NextResponse.json(
      { ok: false, message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
