import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { SignJWT } from "jose";
import { decryptPin } from "@/lib/via/crypto-ciudadano";

const getSecret = () => new TextEncoder().encode(process.env.BETTER_AUTH_SECRET);
const API_KEY_ENV = "X-INFRACCIONES-KEY";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const infraccionId = searchParams.get("infraccionId");
    const encrypted = searchParams.get("p");

    if (!infraccionId || !encrypted) {
      return NextResponse.redirect(
        new URL(`/infracciones/${infraccionId || ""}?pin_error=1`, req.url),
      );
    }

    const secretKey = process.env[API_KEY_ENV] || "";
    const pin = decryptPin(encrypted, secretKey);
    if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      return NextResponse.redirect(
        new URL(`/infracciones/${infraccionId}?pin_error=1`, req.url),
      );
    }

    const result = await query(
      `SELECT pin_acceso, intentos_pin, bloqueado_pin_hasta FROM via.v2_infracciones WHERE id = $1`,
      [infraccionId],
    );

    if (result.rows.length === 0) {
      return NextResponse.redirect(
        new URL(`/infracciones/${infraccionId}?pin_error=1`, req.url),
      );
    }

    const row = result.rows[0] as { pin_acceso: string | null; intentos_pin: number; bloqueado_pin_hasta: string | null };

    if (row.bloqueado_pin_hasta && new Date(row.bloqueado_pin_hasta) > new Date()) {
      return NextResponse.redirect(
        new URL(`/infracciones/${infraccionId}?pin_error=1`, req.url),
      );
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
      return NextResponse.redirect(
        new URL(`/infracciones/${infraccionId}?pin_error=1`, req.url),
      );
    }

    await query(
      `UPDATE via.v2_infracciones SET intentos_pin = 0, bloqueado_pin_hasta = NULL WHERE id = $1`,
      [infraccionId],
    );

    const secret = getSecret();
    const token = await new SignJWT({ infraccionId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const redirectUrl = new URL(`/infracciones/${infraccionId}`, req.url);
    const res = NextResponse.redirect(redirectUrl);
    res.cookies.set("infraccion_access", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 3600,
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("[API][VIA][AUTO-ACCESO] Error:", error);
    const { searchParams } = new URL(req.url);
    return NextResponse.redirect(
      new URL(`/infracciones/${searchParams.get("infraccionId") || ""}?pin_error=1`, req.url),
    );
  }
}
