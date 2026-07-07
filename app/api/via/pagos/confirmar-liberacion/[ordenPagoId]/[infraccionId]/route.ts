import { NextResponse } from "next/server";
import { consultarEstatusSA7 } from "@/lib/via/sa7";
import { queryVia } from "@/lib/via/db";
import { getExpedienteToken } from "@/lib/via/expediente";
import { generarOrdenSalidaVehiculo } from "@/lib/ordenSalida/generarOrdenSalida";
import { enviarCorreoOrdenLiberacion } from "@/lib/emails/server";

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

    await queryVia(
      `UPDATE via.v2_ordenes_pago_sa7 SET estatus = 'P', updated_at = CURRENT_TIMESTAMP WHERE orden_pago_id = $1`,
      [ordenPagoId],
    );

    const infraccion = await queryVia(
      `SELECT motivo_retencion FROM via.v2_infracciones WHERE id = $1 LIMIT 1`,
      [infraccionId],
    );

    const motivo = infraccion.rows[0]?.motivo_retencion as string | undefined;
    const estatusDep = motivo === 'ACCIDENTE' ? 'LIBERADA_POR_ACCIDENTE'
                     : motivo === 'DELITO' ? 'LIBERADA_POR_DELITO'
                     : 'LIBERADA_POR_INFRACCION';

    await queryVia(
      `UPDATE via.v2_infracciones
       SET estatus = 'CERRADA', estatus_dependencia = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [infraccionId, estatusDep],
    );

    // ── Generar orden de salida ──
    const datosOrden = await queryVia(
      `SELECT i.*, s.es_empresa, s.nombre_empresa, s.rfc_empresa,
              s.nombre_resp_fiscal, s.appaterno_resp_fiscal, s.apmaterno_resp_fiscal,
              g.nombre AS nombre_grua
       FROM via.v2_infracciones i
       LEFT JOIN via.v2_solicitudes_liberacion s ON s.infraccion_id = i.id
       LEFT JOIN via.v2_gruas g ON g.id = i.grua_id
       WHERE i.id = $1
       ORDER BY s.created_at DESC LIMIT 1`,
      [infraccionId],
    );

    if (datosOrden.rows.length > 0) {
      const dbData = datosOrden.rows[0];
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
            await queryVia(
              `UPDATE via.v2_infracciones SET url_orden_salida_liberaciones = $2, updated_at = NOW() WHERE id = $1`,
              [infraccionId, urlOrdenSalida],
            );
          }
        }
      } catch (err) {
        console.error("[CONFIRMAR-LIBERACION] Error al generar/subir orden de salida:", err);
      }

      // ── Enviar correo al ciudadano ──
      try {
        const correoTitular = dbData.correo_titular_liberacion || dbData.correo_infractor;
        const nombreTitular = dbData.nombre_titular_liberacion || dbData.nombre_infractor || '';
        if (correoTitular && nombreTitular) {
          await enviarCorreoOrdenLiberacion({
            correoTitular,
            nombreTitular,
            idInfraccion: infraccionId,
            folio: dbData.folio || '—',
            placa: dbData.placa || '—',
          });
        }
      } catch (err) {
        console.error("[CONFIRMAR-LIBERACION] Error al enviar correo:", err);
      }
    }

    return NextResponse.json({ pagado: true });
  } catch (error) {
    console.error("[VIA][PAGOS][CONFIRMAR-LIBERACION]", error);
    return NextResponse.json({ pagado: false, error: "Error al confirmar pago" }, { status: 500 });
  }
}
