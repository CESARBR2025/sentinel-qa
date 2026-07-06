const SOAP_URL = "http://dcsazurehost.eastus.cloudapp.azure.com:8085/IngresoWebService.asmx";

export async function consultarEstatusSA7(ordenPagoId: string): Promise<{
  pagado: boolean;
  pendiente: boolean;
  estatus: string;
  mensaje: string;
  pdfCobro: string | null;
}> {
  console.log("[VIA][SA7] Consultando estatus para ordenPagoId:", ordenPagoId);

  const datosOrden = JSON.stringify({
    OrdenPagoID: ordenPagoId,
    ...(process.env.KEY_USER_VALIDATE_STATUS ? { UsuarioID: process.env.KEY_USER_VALIDATE_STATUS } : {}),
    ...(process.env.KEY_PD_VALIDATE_STATUS ? { PWD: process.env.KEY_PD_VALIDATE_STATUS } : {}),
  });

  console.log("[VIA][SA7] datosOrden:", datosOrden);

  const soapBody = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xmlns:xsd="http://www.w3.org/2001/XMLSchema"
                 xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <estatus_pago xmlns="http://dcsis.com.mx/">
      <usuarioID>SUPERVISOR</usuarioID>
      <password>SUPERVISOR</password>
      <datosOrden>${datosOrden}</datosOrden>
    </estatus_pago>
  </soap12:Body>
</soap12:Envelope>`;

  console.log("[VIA][SA7] Enviando SOAP a:", SOAP_URL);

  const response = await fetch(SOAP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
    body: soapBody,
    cache: "no-store",
  });

  const rawXml = await response.text();
  console.log("[VIA][SA7] Respuesta XML (primeros 500 chars):", rawXml.substring(0, 500));

  const match = rawXml.match(/<estatus_pagoResult>(.*?)<\/estatus_pagoResult>/);

  if (!match) {
    console.error("[VIA][SA7] No se encontró estatus_pagoResult en la respuesta XML");
    console.error("[VIA][SA7] XML completo:", rawXml);
    throw new Error("No se pudo obtener estatus_pagoResult del SA7");
  }

  console.log("[VIA][SA7] estatus_pagoResult raw:", match[1]);

  const resultado = JSON.parse(match[1]);
  const estatus = resultado.Estatus;

  console.log("[VIA][SA7] Resultado parseado:", JSON.stringify(resultado));
  console.log("[VIA][SA7] Estatus:", estatus, "pagado:", estatus === "P");

  return {
    estatus,
    pagado: estatus === "P",
    pendiente: estatus === "I",
    mensaje: resultado.MensajeError,
    pdfCobro: resultado.PDFCobro || null,
  };
}
