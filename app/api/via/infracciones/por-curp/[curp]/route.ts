import { NextRequest, NextResponse } from "next/server";
import { InfraccionesRepository } from "@/features/via/infracciones/repository";

const CURP_REGEX = /^[A-Z0-9]{18}$/;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ curp: string }> },
) {
  const { curp } = await context.params;

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      { status: 429 },
    );
  }

  const curpNormalized = curp.trim().toUpperCase();
  if (!CURP_REGEX.test(curpNormalized)) {
    return NextResponse.json(
      { error: "CURP inválida. Debe tener 18 caracteres alfanuméricos." },
      { status: 400 },
    );
  }

  try {
    const infracciones = await InfraccionesRepository.listarPorCurp(curpNormalized);
    return NextResponse.json({ infracciones });
  } catch (error) {
    console.error("[API][VIA][POR-CURP] Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
