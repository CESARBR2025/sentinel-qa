import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { consultarEstatusSA7 } from "@/lib/via/sa7";
import { getExpedienteToken } from "@/lib/via/expediente";
import { generarOrdenSalidaVehiculo } from "@/lib/ordenSalida/generarOrdenSalida";
import { enviarCorreoOrdenLiberacion } from "@/lib/emails/server";
import {
  marcarOrdenPagoPagada,
  obtenerMotivoRetencion,
  cerrarInfraccion,
  obtenerDatosOrdenSalida,
  actualizarUrlOrdenSalida,
} from "@/lib/agente_infracciones/repository";

export async function GET(
  _req: Request,
  context: { params: Promise<{ ordenPagoId: string; infraccionId: string }> },
) {
  try {
    const { ordenPagoId, infraccionId } = await context.params;
    const sa7 = await consultarEstatusSA7(ordenPagoId);

    if (!sa7.pagado) {
      return NextResponse.json({ pagado: false, estatusSA7: sa7.estatus });
    }

    // P0.1: Lock guard — idempotency via estatus_dependencia
    const locked = await query<{ id: string }>(
      `UPDATE via.v2_infracciones
       SET estatus_dependencia = 'LIBERACION_EN_PROCESO', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND estatus != 'CERRADA' AND estatus_dependencia != 'LIBERACION_EN_PROCESO'
       RETURNING id`,
      [infraccionId],
    );

    if (locked.rows.length === 0) {
      return NextResponse.json({ pagado: true, ya_procesado: true });
    }

    try {
      await marcarOrdenPagoPagada(ordenPagoId);

      const motivo = await obtenerMotivoRetencion(infraccionId);
      const estatusDep = motivo === 'ACCIDENTE' ? 'LIBERADA_POR_ACCIDENTE'
                       : motivo === 'DELITO' ? 'LIBERADA_POR_DELITO'
                       : 'LIBERADA_POR_INFRACCION';

      // ── Generar orden de salida ──
      const rawData = await obtenerDatosOrdenSalida(infraccionId);

      if (rawData) {
        const dbData = rawData as any;
        const esEmpresa = dbData.rfc_empresa || dbData.es_empresa;
        const tNombre = !esEmpresa ? dbData.nombre_titular_liberacion : dbData.nombre_resp_fiscal;
        const tPaterno = !esEmpresa ? dbData.appaterno_titular_liberacion : dbData.appaterno_resp_fiscal;
        const tMaterno = !esEmpresa ? dbData.apmaterno_titular_liberacion : dbData.apmaterno_resp_fiscal;
        const nombreRecibe = `${tNombre || ''} ${tPaterno || ''} ${tMaterno || ''}`.trim().replace(/\s+/g, ' ');

        const dataParaPDF = {
          id: dbData.id,
          motivoRetencion: dbData.motivo_retencion || "SIN MOTIVO ESPECIFICADO",
          estadoOrigen: dbData.estado || "QUERÉTARO",
          noSerie: dbData.no_serie_vehiculo || "—",
          garantiaRetenida: dbData.tipo_garantia || "VEHICULO",
          grua: dbData.nombre_grua,
          noOficio: dbData.folio || "0000",
          rfc: esEmpresa,
          responsableFiscal: nombreRecibe,
          nombreTitularCompleto: nombreRecibe,
          empresaFiscal: esEmpresa ? dbData.nombre_empresa : "TITULAR",
          marca: dbData.marca,
          tipoVehiculo: dbData.tipo_vehiculo,
          modelo: dbData.modelo,
          color: dbData.color,
          placa: dbData.placa,
          noExterno: dbData.folio,
          nombreTitular: dbData.nombre_titular_liberacion || dbData.nombre_infractor || '',
          estado: dbData.estado,
          anio_vehiculo: dbData.anio_vehiculo,
          curp_titular: dbData.curp_titular_liberacion,
        };

        try {
          const pdfBuffer = await generarOrdenSalidaVehiculo({ data: dataParaPDF });

          // Subir a expediente digital
          const token = await getExpedienteToken();
          const ahora = new Date();
          const anio = ahora.getFullYear().toString();
          const mes = String(ahora.getMonth() + 1).padStart(2, "0");
          const folio = (dbData.folio || infraccionId).replace(/[^a-zA-Z0-9_-]/g, "_");
          const pdfFile = new File(
            [new Uint8Array(pdfBuffer)],
            `orden_salida_${folio}.pdf`,
            { type: "application/pdf" },
          );
          const formData = new FormData();
          formData.append("file", pdfFile);
          formData.append("ruta_personalizada", `${anio}/${mes}/${infraccionId}`);
          formData.append("sistema", process.env.EXPEDIENTE_SISTEMA ?? "sspm");

          const uploadRes = await fetch(
            `${process.env.NEXT_PUBLIC_WS_EXPEDIENTE ?? process.env.EXPEDIENTE_DIGITAL_URL ?? 'https://sanjuandelrio.sytes.net:3044'}/api/upload-custom`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              body: formData,
            },
          );

          if (uploadRes.ok) {
            const uploadJson = await uploadRes.json();
            const urlOrdenSalida = uploadJson.data?.ruta_relativa;
            if (urlOrdenSalida) {
              await actualizarUrlOrdenSalida(infraccionId, urlOrdenSalida);
            }
          }
        } catch (err) {
          console.error("[CONFIRMAR-LIBERACION] Error al generar/subir orden de salida:", err);
          throw err;
        }

        // ── Enviar correo al ciudadano ──
        const correoTitular = dbData.correo_titular_liberacion || dbData.correo_infractor;
        const nombreTitular = dbData.nombre_titular_liberacion || dbData.nombre_infractor || '';
        if (correoTitular && nombreTitular) {
          try {
            await enviarCorreoOrdenLiberacion({
              correoTitular,
              nombreTitular,
              idInfraccion: infraccionId,
              folio: dbData.folio || '—',
              placa: dbData.placa || '—',
            });
          } catch (err) {
            console.error("[CONFIRMAR-LIBERACION] Error al enviar correo:", err);
            throw err;
          }
        }
      }

      await cerrarInfraccion(infraccionId, estatusDep);

      return NextResponse.json({ pagado: true });
    } catch (err) {
      console.error("[CONFIRMAR-LIBERACION] Error en proceso interno:", err);
      await query(
        `UPDATE via.v2_infracciones SET estatus_dependencia = 'LIBERACION_PENDIENTE_DOCUMENTOS', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [infraccionId],
      );
      return NextResponse.json({ pagado: false, error: "Error al procesar liberación" }, { status: 500 });
    }
  } catch (error) {
    console.error("[VIA][PAGOS][CONFIRMAR-LIBERACION]", error);
    return NextResponse.json({ pagado: false, error: "Error al confirmar pago" }, { status: 500 });
  }
}
