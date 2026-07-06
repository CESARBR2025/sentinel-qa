export async function generarOrdenPago(payload: {
  infraccion_id: string;
  nombre_usuario: string;
  apellidos_usuario: string;
  concepto_id: number;
  folio: string;
  correoInfractor: string;
  descuentoAplicado: string;
}) {
  const res = await fetch("/api/via/sa7/generar-orden-pago", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Error generando orden de pago");
  }

  return res.json();
}
