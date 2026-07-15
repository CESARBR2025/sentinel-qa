let cachedToken: { token: string; expiresAt: number } | null = null;

export function getExpedienteHost(): string {
  const host = (
    process.env.EXPEDIENTE_HOST ??
    process.env.EXPEDIENTE_DIGITAL_URL ??
    process.env.NEXT_PUBLIC_WS_EXPEDIENTE ??
    ""
  ).replace(/\/$/, "");

  if (!host) {
    const vars = [
      "EXPEDIENTE_HOST",
      "EXPEDIENTE_DIGITAL_URL",
      "NEXT_PUBLIC_WS_EXPEDIENTE",
    ];
    console.error(
      `[VIA][EXPEDIENTE] Falta variable de entorno. Se buscó en orden: ${vars.join(", ")}. Ninguna está definida en el entorno actual.`,
    );
  }

  return host;
}

export async function getExpedienteToken(): Promise<string> {
  const ahora = Date.now();

  if (cachedToken && cachedToken.expiresAt - ahora > 5 * 60 * 1000) {
    return cachedToken.token;
  }

  const host = getExpedienteHost();
  if (!host) {
    throw new Error(
      "No se puede obtener token del Expediente Digital: falta variable de entorno EXPEDIENTE_HOST (o EXPEDIENTE_DIGITAL_URL o NEXT_PUBLIC_WS_EXPEDIENTE). Verifica las env vars en Vercel.",
    );
  }

  const codigo = process.env.EXPEDIENTE_CODIGO_INVITACION;
  if (!codigo) {
    throw new Error(
      "No se puede obtener token del Expediente Digital: falta EXPEDIENTE_CODIGO_INVITACION en variables de entorno.",
    );
  }

  const guestUrl = `${host}/api/auth/guest-token`;
  console.log(`[VIA][EXPEDIENTE] Solicitando token guest a: ${guestUrl}`);

  const res = await fetch(guestUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      codigo_invitacion: codigo,
      nombre_invitado: "SSPM Sistema",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(
      `[VIA][EXPEDIENTE] Error al obtener token guest. Status: ${res.status}. Response: ${body}. URL: ${guestUrl}`,
    );
    throw new Error(
      `Error al generar token del Expediente Digital (HTTP ${res.status}). Verifica que EXPEDIENTE_HOST sea correcto y el servicio externo esté disponible.`,
    );
  }

  const data = await res.json();

  if (!data.token) {
    console.error(
      `[VIA][EXPEDIENTE] Respuesta sin token. Response completa: ${JSON.stringify(data)}`,
    );
    throw new Error(
      "El servicio externo respondió pero no devolvió un token. Verifica EXPEDIENTE_CODIGO_INVITACION.",
    );
  }

  cachedToken = {
    token: data.token,
    expiresAt: ahora + 60 * 60 * 1000,
  };

  console.log(`[VIA][EXPEDIENTE] Token obtenido correctamente. Cacheado por 1 hora.`);
  return cachedToken.token;
}

export function limpiarCacheToken(): void {
  cachedToken = null;
}
