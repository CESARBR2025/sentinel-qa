import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const getSecret = () => new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);

export async function verificarCookieCiudadano(infraccionId: string): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("infraccion_access")?.value;
    if (!token) return false;

    const { payload } = await jwtVerify(token, getSecret());
    return payload.infraccionId === infraccionId;
  } catch {
    return false;
  }
}
