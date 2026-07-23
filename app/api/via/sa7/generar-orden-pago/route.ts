import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SA7Repository } from "@/features/via/saSiete/repository";
import { verificarRolOficial } from "@/lib/oficial/service";
import { verificarRolInfracciones } from "@/lib/agente_infracciones/service";
import { verificarRolLiberaciones } from "@/lib/agente_liberaciones/service";

const SA7_URL =
  "https://sanjuandelrio.sytes.net:3044/api/sasiete/generar-orden-completa";

export async function POST(req: NextRequest) {
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

    console.log(
      `[SA7][${folio}] Solicitud de orden de pago recibida — infraccion_id=${infraccion_id} usuario=${session.user.id}`,
    );

    if (
      !infraccion_id ||
      !nombre_usuario ||
      !folio ||
      !apellidos_usuario ||
      !correoInfractor
    ) {
      console.error(
        `[SA7][${folio}] Faltan campos obligatorios en el body:`,
        body,
      );
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
    console.log(`[SA7][${folio}] token-guest status=${tokenRes.status}`);

    if (!tokenRes.ok) {
      const detalleToken = await tokenRes.text().catch(() => "");
      console.error(
        `[SA7][${folio}] Fallo al obtener token guest — status=${tokenRes.status}`,
        detalleToken,
      );
      return NextResponse.json(
        { ok: false, message: "No se pudo obtener token guest" },
        { status: 500 },
      );
    }

    const tokenData = await tokenRes.json();
    const tokenGuest = tokenData.data?.token;
    if (!tokenGuest) {
      console.error(
        `[SA7][${folio}] Respuesta de token-guest sin token:`,
        tokenData,
      );
      return NextResponse.json(
        { ok: false, message: "Token inválido" },
        { status: 500 },
      );
    }

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
      cantidades: { "31378": 1 },
      referencias: { "31378": [`${nombre_usuario} ${apellidos_usuario}`] },
      id_usuario_general: "17336",
      tipo_tramite: "via_v2_cobro_infracciones_online",
      folio,
    };

    console.log(
      `[SA7][${folio}] Payload enviado a SA7:`,
      JSON.stringify(payloadSA7),
    );

    const sa7StartedAt = Date.now();
    const sa7Res = await fetch(SA7_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenGuest}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadSA7),
    });
    console.log(
      `[SA7][${folio}] Respuesta de SA7 en ${Date.now() - sa7StartedAt}ms — status=${sa7Res.status} ${sa7Res.statusText}`,
    );

    if (!sa7Res.ok) {
      const detalle = await sa7Res.text().catch(() => "");
      console.error(
        `[SA7][${folio}] SA7 respondió con error — status=${sa7Res.status}`,
        `\nheaders: ${JSON.stringify(Object.fromEntries(sa7Res.headers.entries()))}`,
        `\nbody: ${detalle}`,
      );
      return NextResponse.json(
        { ok: false, message: "El servicio de pagos no pudo generar la orden" },
        { status: 502 },
      );
    }

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

    if (!result.ordenPagoId || !result.estatus) {
      const detalle = await sa7Res.text().catch(() => "");
      console.error(
        `[SA7][${folio}] SA7 respondió 2xx pero sin orden_pago_id/estatus en headers:`,
        `\nheaders: ${JSON.stringify(Object.fromEntries(sa7Res.headers.entries()))}`,
        `\nbody: ${detalle}`,
      );
      return NextResponse.json(
        {
          ok: false,
          message: "El servicio de pagos no devolvió los datos de la orden",
        },
        { status: 502 },
      );
    }

    console.log(
      `[SA7][${folio}] Orden generada correctamente — ordenPagoId=${result.ordenPagoId} estatus=${result.estatus}`,
    );

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
    console.error("[SA7] Error generando orden de pago:", error);
    return NextResponse.json(
      { ok: false, message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
