import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { SA7Repository } from "@/features/via/saSiete/repository";
import { marcarOrdenPagoPagada } from "@/lib/agente_infracciones/repository";
import { enviarCorreoPagoConfirmado } from "@/lib/emails/server";

const STATUS_MAP: Record<string, { estatus: string; estatusDependencia: string | null }> = {
  PENDIENTE_PAGO_INFRACCION: { estatus: 'PAGADA', estatusDependencia: 'PENDIENTE_DEVOLUCION_GARANTIA' },
  PENDIENTE_PAGO_INSTANTE: { estatus: 'CERRADA', estatusDependencia: 'LIBERADO_INFRACCIONES_INSTANTE' },
  PLACA_RETENIDA_EN_TRANSITO: { estatus: 'PAGADA', estatusDependencia: 'PENDIENTE_DEVOLUCION_GARANTIA' },
  PENDIENTE_PAGO_LIBERACION: { estatus: 'CERRADA', estatusDependencia: null },
}

const LIBERACION_SUBTYPE: Record<string, string> = {
  ACCIDENTE: 'LIBERADA_POR_ACCIDENTE',
  DELITO: 'LIBERADA_POR_DELITO',
}

export async function POST(
  _req: Request,
  context: { params: Promise<{ infraccionId: string }> },
) {
  try {
    const { infraccionId } = await context.params;

    const current = await query<{ estatus: string; estatus_dependencia: string; motivo_retencion: string | null }>(
      `SELECT estatus, estatus_dependencia, motivo_retencion FROM via.v2_infracciones WHERE id = $1`,
      [infraccionId],
    )
    const row = current.rows[0]
    if (!row) {
      return NextResponse.json({ pagado: false, error: "Infracción no encontrada" }, { status: 404 })
    }

    const { estatus, estatus_dependencia, motivo_retencion } = row

    if (['PAGADA', 'CERRADA', 'FINALIZADA'].includes(estatus)) {
      return NextResponse.json({ pagado: true, error: "La infracción ya está pagada o finalizada" })
    }

    const mapping = STATUS_MAP[estatus_dependencia]
    if (!mapping) {
      return NextResponse.json({
        pagado: false,
        error: `No se puede forzar pago desde el estado actual: ${estatus} / ${estatus_dependencia}`,
      }, { status: 400 })
    }

    let targetEstatus = mapping.estatus
    let targetDependencia = mapping.estatusDependencia

    if (estatus_dependencia === 'PENDIENTE_PAGO_LIBERACION') {
      targetDependencia = LIBERACION_SUBTYPE[motivo_retencion ?? ''] ?? 'LIBERADA_POR_INFRACCION'
    }

    const orden = await SA7Repository.resolverOrdenVigente(infraccionId)
    if (orden?.ordenPagoId) {
      await marcarOrdenPagoPagada(orden.ordenPagoId)
    }

    await query(
      `UPDATE via.v2_infracciones
       SET estatus = $2, estatus_dependencia = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [infraccionId, targetEstatus, targetDependencia!],
    )

    notificarPagoForzado(infraccionId);

    return NextResponse.json({ pagado: true, forzado: true, estatus: targetEstatus, estatusDependencia: targetDependencia });
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
