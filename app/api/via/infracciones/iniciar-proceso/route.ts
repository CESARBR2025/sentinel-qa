import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SA7Repository } from "@/features/via/saSiete/repository";
import {
  actualizarDatosInfractorIniciarProceso,
  actualizarEstatusPendientePagoInfraccion,
} from "@/lib/agente_infracciones/repository";

const SA7_URL = "https://sanjuandelrio.sytes.net:3044/api/sasiete/qas/generar-orden-completa";
const CONCEPTO_PRUEBA = "31378";

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { id, es_titular, nombre_titular, appaterno_titular, apmaterno_titular, curp_titular, correo_titular, nombre_infractor, appaterno_infractor, apmaterno_infractor, curp_infractor, correo_infractor } = body;

    if (!id) {
      return NextResponse.json({ error: 'El campo "id" es requerido.' }, { status: 400 });
    }

    const infraccion = await actualizarDatosInfractorIniciarProceso({
      id,
      es_titular: !!es_titular,
      nombre_titular: nombre_titular || null,
      appaterno_titular: appaterno_titular || null,
      apmaterno_titular: apmaterno_titular || null,
      curp_titular: curp_titular || null,
      correo_titular: correo_titular || null,
      nombre_infractor: nombre_infractor || null,
      appaterno_infractor: appaterno_infractor || null,
      apmaterno_infractor: apmaterno_infractor || null,
      curp_infractor: curp_infractor || null,
      correo_infractor: correo_infractor || null,
    });

    if (!infraccion) {
      return NextResponse.json({ error: "No se encontró la infracción con el ID proporcionado." }, { status: 404 });
    }

    const infraRow = infraccion as any;

    const conceptoId = await SA7Repository.obtenerConceptoIdPorClasificacion(
      infraRow.clasificacion,
    );

    const baseUrl = process.env.NODE_ENV === "production"
      ? "https://via-v2.vercel.app"
      : "http://localhost:3000";

    const tokenRes = await fetch(`${baseUrl}/api/auth/token-guest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo_invitacion: `INV-${Date.now()}`, nombre_invitado: "SA7_SYSTEM" }),
    });

    if (!tokenRes.ok) {
      return NextResponse.json({ error: "No se pudo obtener token guest para generar orden" }, { status: 500 });
    }

    const tokenData = await tokenRes.json();
    const tokenGuest = tokenData.data?.token;
    if (!tokenGuest) {
      return NextResponse.json({ error: "Token guest inválido" }, { status: 500 });
    }

    const nombreUsuario = (infraRow.nombre_infractor || nombre_titular || "").trim();
    const apellidosUsuario = [infraRow.apellido_paterno_infractor || appaterno_titular || "", infraRow.apellido_materno_infractor || apmaterno_titular || ""].filter(Boolean).join(" ").trim() || "SIN APELLIDO";

    const descuentoAplicado = Number(infraRow.descuento_aplicado) || 0;
    let descuento = 1;
    if (descuentoAplicado === 70) descuento = 0.3;
    else if (descuentoAplicado === 50) descuento = 0.5;

    const payloadSA7 = {
      nombreUsuario,
      apellidosUsuario,
      rfc: "",
      conceptosIds: [CONCEPTO_PRUEBA],
      cantidades: { [CONCEPTO_PRUEBA]: descuento },
      referencias: { [CONCEPTO_PRUEBA]: [`${nombreUsuario} ${apellidosUsuario}`, ""] },
      id_usuario_general: "17336",
      tipo_tramite: "via_v2_cobro_infracciones_online",
      folio: infraRow.folio,
    };

    const sa7Res = await fetch(SA7_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenGuest}`, "Content-Type": "application/json" },
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
      infraccionId: id,
      folioInfraccion: infraRow.folio,
      nombreUsuario,
      apellidosUsuario,
      conceptoId: String(conceptoId || CONCEPTO_PRUEBA),
      ...result,
      requestPayload: payloadSA7,
    });

    await actualizarEstatusPendientePagoInfraccion(id);

    return NextResponse.json({
      message: "Orden generada y estatus actualizado a PENDIENTE_PAGO_INFRACCION.",
      data: result,
    });
  } catch (error) {
    console.error("Error al procesar infracción:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
