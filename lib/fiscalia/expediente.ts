const EXP_FISCALIA_HOST =
  process.env.NEXT_PUBLIC_WS_EXPEDIENTE ??
  "https://sanjuandelrio.sytes.net:3044";
const EXP_FISCALIA_CODIGO =
  process.env.EXPEDIENTE_CODIGO_INVITACION ?? "INV-2026-001";
const EXP_FISCALIA_SISTEMA = process.env.EXPEDIENTE_SISTEMA ?? "sspm";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function obtenerTokenFiscalia(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.token;
  }

  const res = await fetch(`${EXP_FISCALIA_HOST}/api/auth/guest-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      codigo_invitacion: EXP_FISCALIA_CODIGO,
      nombre_invitado: "SISTEMA_FISCALIA",
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok)
    throw new Error(`Expediente Digital no disponible (${res.status})`);

  const json = (await res.json()) as {
    success: boolean;
    token: string;
    expires_in: string;
  };

  if (!json.success || !json.token)
    throw new Error("Token de invitado inválido");

  const expiresIn = parseInt(json.expires_in) || 28800;
  cachedToken = { token: json.token, expiresAt: Date.now() + expiresIn * 1000 };
  return json.token;
}

export async function subirArchivoFiscalia(
  archivo: File,
  idInfraccion: string,
): Promise<string> {
  const token = await obtenerTokenFiscalia();

  const now = new Date();
  const anio = now.getFullYear().toString();
  const mes = String(now.getMonth() + 1).padStart(2, "0");

  const form = new FormData();
  form.append("file", archivo);
  form.append("ruta_personalizada", `${anio}/${mes}/${idInfraccion}`);
  form.append("sistema", EXP_FISCALIA_SISTEMA);

  const response = await fetch(`${EXP_FISCALIA_HOST}/api/upload-custom`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error(
      "[EXPEDIENTE DIGITAL] Error subiendo documento fiscalia:",
      error,
    );
    throw new Error("Error al subir el archivo");
  }

  const { data } = await response.json();
  return data.ruta_relativa;
}
