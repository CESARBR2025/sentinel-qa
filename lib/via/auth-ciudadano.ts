import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const getSecret = () => new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);

export async function verificarCookieCiudadano(infraccionId: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("infraccion_access")?.value;
    if (!token) {
      console.log("[AUTH-CIUDADANO] Cookie infraccion_access no encontrada");
      return false;
    }

    const { payload } = await jwtVerify(token, getSecret());
    const match = payload.infraccionId === infraccionId;
    console.log("[AUTH-CIUDADANO] Cookie válida — infraccionId cookie:", payload.infraccionId, "esperado:", infraccionId, "match:", match);
    return match;
  } catch (e) {
    console.log("[AUTH-CIUDADANO] Error verificando token:", e instanceof Error ? e.message : e);
    return false;
  }
}
