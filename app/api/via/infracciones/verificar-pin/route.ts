import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { SignJWT } from "jose";

const getSecret = () => new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);

export async function POST(req: Request) {
  try {
    const { infraccionId, pin } = await req.json();
    console.log("[API][VERIFICAR-PIN] INICIO — infraccionId:", infraccionId, "pin:", pin);

    if (!infraccionId || !pin) {
      console.log("[API][VERIFICAR-PIN] Faltan parámetros");
      return NextResponse.json({ ok: false, error: "infraccionId y pin son requeridos" }, { status: 400 });
    }

    const result = await query(
      `SELECT pin_acceso, intentos_pin, bloqueado_pin_hasta FROM via.v2_infracciones WHERE id = $1`,
      [infraccionId],
    );
    console.log("[API][VERIFICAR-PIN] DB consulta OK — rows:", result.rows.length);

    if (result.rows.length === 0) {
      console.log("[API][VERIFICAR-PIN] Infracción no encontrada");
      return NextResponse.json({ ok: false, error: "Infracción no encontrada" }, { status: 404 });
    }

    const row = result.rows[0] as { pin_acceso: string | null; intentos_pin: number; bloqueado_pin_hasta: string | null };
    console.log("[API][VERIFICAR-PIN] pin_acceso DB:", row.pin_acceso, "intentos:", row.intentos_pin, "bloqueado:", row.bloqueado_pin_hasta);

    if (row.bloqueado_pin_hasta && new Date(row.bloqueado_pin_hasta) > new Date()) {
      const hasta = new Date(row.bloqueado_pin_hasta).toISOString();
      console.log("[API][VERIFICAR-PIN] Bloqueado hasta:", hasta);
      return NextResponse.json({ ok: false, bloqueado: true, hasta });
    }

    if (row.pin_acceso !== pin) {
      const intentos = (row.intentos_pin || 0) + 1;
      const bloqueado = intentos >= 3;
      await query(
        `UPDATE via.v2_infracciones SET intentos_pin = $1, bloqueado_pin_hasta = $2 WHERE id = $3`,
        [
          intentos,
          bloqueado ? new Date(Date.now() + 15 * 60 * 1000).toISOString() : null,
          infraccionId,
        ],
      );
      return NextResponse.json({ ok: false, intentos_restantes: 3 - intentos });
    }

    // PIN correcto — resetear intentos y emitir cookie
    console.log("[API][VERIFICAR-PIN] PIN correcto — emitiendo cookie...");
    await query(
      `UPDATE via.v2_infracciones SET intentos_pin = 0, bloqueado_pin_hasta = NULL WHERE id = $1`,
      [infraccionId],
    );

    const secret = getSecret();
    const token = await new SignJWT({ infraccionId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const res = NextResponse.json({ ok: true });
    res.cookies.set("infraccion_access", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 3600,
      path: "/",
    });
    console.log("[API][VERIFICAR-PIN] Cookie emitida OK");

    return res;
  } catch (error) {
    console.error("[API][VERIFICAR-PIN] ERROR:", error);
    return NextResponse.json({ ok: false, error: "Error interno" }, { status: 500 });
  }
}
