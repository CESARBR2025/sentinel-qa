import { FlotaRepository } from "./repository";
import type { FlotaVehiculoRaw, PatrullaAsignacion } from "./types";

const FLOTA_API_URL =
  "http://proyecto-flota.vercel.app/api/publica?placa";
const CACHE_TTL = 120_000;

type FlotaApiResponse =
  | FlotaVehiculoRaw[]
  | { data: FlotaVehiculoRaw[] }
  | { vehicles?: FlotaVehiculoRaw[] }
  | { results?: FlotaVehiculoRaw[] }
  | { patrullas?: FlotaVehiculoRaw[] };

function extraerVehiculos(raw: FlotaApiResponse): FlotaVehiculoRaw[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    if (Array.isArray((raw as any).data)) return (raw as any).data;
    if (Array.isArray((raw as any).vehicles)) return (raw as any).vehicles;
    if (Array.isArray((raw as any).results)) return (raw as any).results;
    if (Array.isArray((raw as any).patrullas)) return (raw as any).patrullas;
  }
  return [];
}

let cacheFlota: {
  datos: FlotaVehiculoRaw[];
  timestamp: number;
} | null = null;

export class FlotaService {
  static async obtenerFlota(): Promise<{
    datos: FlotaVehiculoRaw[];
    desdeCache: boolean;
  }> {
    const ahora = Date.now();

    if (cacheFlota && ahora - cacheFlota.timestamp < CACHE_TTL) {
      return { datos: cacheFlota.datos, desdeCache: true };
    }

    const apiKey = process.env.NEXT_PUBLIC_FLOTA_API_KEY;

    if (!apiKey) {
      console.warn("[FLOTA] API key no configurada");
      return { datos: [], desdeCache: false };
    }

    const res = await fetch(FLOTA_API_URL, {
      headers: { "x-api-key": apiKey },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[FLOTA] Error HTTP ${res.status}`);
      if (cacheFlota)
        return { datos: cacheFlota.datos, desdeCache: true };
      return { datos: [], desdeCache: false };
    }

    const raw: FlotaApiResponse = await res.json();
    const datos = extraerVehiculos(raw);

    cacheFlota = { datos, timestamp: ahora };

    return { datos, desdeCache: false };
  }

  static invalidarCache() {
    cacheFlota = null;
  }

  static async listarPatrullasParaAsignacion(): Promise<
    PatrullaAsignacion[]
  > {
    const stale = await FlotaRepository.estaStale(6);

    if (stale) {
      const { datos } = await this.obtenerFlota();
      if (datos.length > 0) {
        await FlotaRepository.upsertPatrullas(datos);
      }
    }

    const rows = await FlotaRepository.listarActivas();
    return rows.map((r) => ({
      id: r.id,
      numero_unidad: r.numero_unidad,
      placas: r.placas,
      descripcion: r.descripcion,
    }));
  }

  static async obtenerPatrullaPorId(
    id: string | null,
  ): Promise<PatrullaAsignacion | null> {
    if (!id) return null;
    const row = await FlotaRepository.obtenerPorId(id);
    if (!row) return null;
    return {
      id: row.id,
      numero_unidad: row.numero_unidad,
      placas: row.placas,
      descripcion: row.descripcion,
    };
  }
}
