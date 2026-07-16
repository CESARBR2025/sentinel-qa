import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { SA7Repository } from "@/features/via/saSiete/repository";
import { marcarOrdenPagoPagada } from "@/lib/agente_infracciones/repository";
import { enviarCorreoPagoConfirmado } from "@/lib/emails/server";

export async function POST(
  _req: Request,
  context: { params: Promise<{ infraccionId: string }> },
) {
  try {
    const { infraccionId } = await context.params;

    const orden = await SA7Repository.resolverOrdenVigente(infraccionId);
    if (!orden) {
      return NextResponse.json({ pagado: false, error: "Sin orden vigente para esta infracción" }, { status: 400 });
    }

    if (orden.ordenPagoId) {
      await marcarOrdenPagoPagada(orden.ordenPagoId);
    }

    await query(
      `UPDATE via.v2_infracciones
       SET estatus = 'PAGADA', estatus_dependencia = 'PAGADA_FORZADA_ADMIN', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [infraccionId],
    );

    notificarPagoForzado(infraccionId);

    return NextResponse.json({ pagado: true, forzado: true });
  } catch (error) {
    console.error("[VIA][PAGOS][FORZAR-PAGO]", error);
    return NextResponse.json({ pagado: false, error: "Error al forzar pago" }, { status: 500 });
  }
}

async function notificarPagoForzado(infraccionId: string) {
  try {
    const result = await query(
      `SELECT correo_infractor, nombre_infractor, apellido_paterno_infractor,
              apellido_materno_infractor, folio, placa, monto_final
       FROM via.v2_infracciones WHERE id = $1`,
      [infraccionId],
    );
    const row = result.rows[0] as Record<string, unknown> | undefined;
    if (!row?.correo_infractor) return;

    const nombre = [row.nombre_infractor, row.apellido_paterno_infractor, row.apellido_materno_infractor]
      .filter(Boolean).join(" ") || "Ciudadano";

    await enviarCorreoPagoConfirmado({
      correoInfractor: row.correo_infractor as string,
      nombreInfractor: nombre,
      idInfraccion: infraccionId,
      folio: row.folio as string,
      placa: (row.placa as string) || "N/A",
      monto: Number(row.monto_final),
    });
  } catch (err) {
    console.error("[EMAIL][PAGO-FORZADO]", err);
  }
}
