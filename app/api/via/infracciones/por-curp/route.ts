import { NextRequest, NextResponse } from "next/server";
import { InfraccionesRepository } from "@/features/via/infracciones/repository";
import { encryptPin } from "@/lib/via/crypto-ciudadano";

const CURP_REGEX = /^[A-Z0-9]{18}$/;

const API_KEY_HEADER = "x-infracciones-key";
const CURP_HEADER = "x-curp";
const API_KEY_ENV = "X-INFRACCIONES-KEY";

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

function validateApiKey(req: NextRequest): boolean {
  const key = req.headers.get(API_KEY_HEADER);
  if (!key) return false;
  return key === process.env[API_KEY_ENV];
}

export async function GET(req: NextRequest) {
  if (!validateApiKey(req)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      { status: 429 },
    );
  }

  const curp = req.headers.get(CURP_HEADER);
  if (!curp) {
    return NextResponse.json(
      { error: "Header x-curp es requerido." },
      { status: 400 },
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
    const secretKey = process.env[API_KEY_ENV] || "";

    const infraccionesConPinCifrado = infracciones.map((inf) => ({
      id: inf.id,
      folio: inf.folio,
      estatusInfraccion: inf.estatusInfraccion,
      estatusDependencia: inf.estatusDependencia,
      fechaInfraccion: inf.fechaInfraccion,
      montoFinal: inf.montoFinal,
      totalPesos: inf.totalPesos,
      pin_acceso: encryptPin(inf.pin_acceso, secretKey),
    }));

    return NextResponse.json({ infracciones: infraccionesConPinCifrado });
  } catch (error) {
    console.error("[API][VIA][POR-CURP] Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
