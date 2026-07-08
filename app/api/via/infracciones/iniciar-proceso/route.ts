import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { queryVia } from "@/lib/via/db";
import { SA7Repository } from "@/features/via/saSiete/repository";

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

    const updateResult = await queryVia(
      `UPDATE via.v2_infracciones
       SET es_titular = $2,
            nombre_titular_liberacion = COALESCE($3, nombre_titular_liberacion),
            appaterno_titular_liberacion = COALESCE($4, appaterno_titular_liberacion),
            apmaterno_titular_liberacion = COALESCE($5, apmaterno_titular_liberacion),
            curp_titular_liberacion = COALESCE($6, curp_titular_liberacion),
            correo_titular_liberacion = COALESCE($7, correo_titular_liberacion),
           nombre_infractor = COALESCE(NULLIF($8, ''), nombre_infractor),
           apellido_paterno_infractor = COALESCE(NULLIF($9, ''), apellido_paterno_infractor),
           apellido_materno_infractor = COALESCE(NULLIF($10, ''), apellido_materno_infractor),
           curp_infractor = COALESCE(NULLIF($11, ''), curp_infractor),
           correo_infractor = COALESCE(NULLIF($12, ''), correo_infractor),
           updated_at = NOW()
       WHERE id = $1
       RETURNING id, folio, descuento_aplicado, monto_total, nombre_infractor,
                 apellido_paterno_infractor, apellido_materno_infractor, correo_infractor,
                 fecha_limite_descuento`,
      [id, es_titular ?? null, nombre_titular || null, appaterno_titular || null, apmaterno_titular || null, curp_titular || null, correo_titular || null, nombre_infractor || null, appaterno_infractor || null, apmaterno_infractor || null, curp_infractor || null, correo_infractor || null],
    );

    if (updateResult.rows.length === 0) {
      return NextResponse.json({ error: "No se encontró la infracción con el ID proporcionado." }, { status: 404 });
    }

    const infraccion = updateResult.rows[0];

    const conceptoId = await SA7Repository.obtenerConceptoIdPorClasificacion(
      infraccion.clasificacion,
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

    const nombreUsuario = (infraccion.nombre_infractor || nombre_titular || "").trim();
    const apellidosUsuario = [infraccion.apellido_paterno_infractor || appaterno_titular || "", infraccion.apellido_materno_infractor || apmaterno_titular || ""].filter(Boolean).join(" ").trim() || "SIN APELLIDO";

    const descuentoAplicado = Number(infraccion.descuento_aplicado) || 0;
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
      folio: infraccion.folio,
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
      folioInfraccion: infraccion.folio,
      nombreUsuario,
      apellidosUsuario,
      conceptoId: String(conceptoId || CONCEPTO_PRUEBA),
      ...result,
      requestPayload: payloadSA7,
    });

    await queryVia(
      `UPDATE via.v2_infracciones SET estatus = 'PENDIENTE_PAGO', estatus_dependencia = 'PENDIENTE_PAGO_INFRACCION', updated_at = NOW() WHERE id = $1`,
      [id],
    );

    return NextResponse.json({
      message: "Orden generada y estatus actualizado a PENDIENTE_PAGO_INFRACCION.",
      data: result,
    });
  } catch (error) {
    console.error("Error al procesar infracción:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
