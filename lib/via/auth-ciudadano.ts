import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";

const getSecret = () => new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);

async function tokenCorrespondeAInfraccion(token: string | undefined, infraccionId: string): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.infraccionId === infraccionId;
  } catch {
    return false;
  }
}

/**
 * Válido solo para Server Components / Server Actions (Next.js): lee el JWT
 * desde la cookie httpOnly `infraccion_access` que emite verificar-pin.
 */
export async function verificarCookieCiudadano(infraccionId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("infraccion_access")?.value;
  return tokenCorrespondeAInfraccion(token, infraccionId);
}

/**
 * Para Route Handlers: acepta el mismo JWT vía header `Authorization: Bearer`
 * (usado por clientes que no manejan cookies httpOnly, como la app Flutter)
 * o, si no viene header, cae de vuelta a la cookie (usado por el propio front
 * web al hacer fetch same-origin).
 */
export async function verificarAccesoCiudadano(req: NextRequest, infraccionId: string): Promise<boolean> {
  const authHeader = req.headers.get("authorization");
  const bearer = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (bearer) {
    return tokenCorrespondeAInfraccion(bearer, infraccionId);
  }
  return verificarCookieCiudadano(infraccionId);
}
