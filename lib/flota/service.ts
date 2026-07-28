import { estaStale, upsertPatrullas, listarActivas, obtenerPorId, listarUnidadesConTripulacionRaw } from "./repository";
import { agruparUnidadesConTripulacion } from "./mapper";
import type { FlotaVehiculoRaw, PatrullaAsignacion, UnidadParaDespacho } from "./types";
import { distanciaHaversineKm } from "@/lib/shared/geo";

const FLOTA_API_URL =
  "http://proyecto-flota.vercel.app/api/publica?placa";
const CACHE_TTL = 120_000;

type FlotaApiResponse =
  | FlotaVehiculoRaw[]
  | { data: FlotaVehiculoRaw[] }
  | { vehicles?: FlotaVehiculoRaw[] }
  | { results?: FlotaVehiculoRaw[] }
  | { patrullas?: FlotaVehiculoRaw[] };

function extraerVehiculos(raw: FlotaApiResponse): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw as unknown as Record<string, unknown>[];
  if (raw && typeof raw === "object") {
    if (Array.isArray((raw as any).data)) return (raw as any).data;
    if (Array.isArray((raw as any).vehicles)) return (raw as any).vehicles;
    if (Array.isArray((raw as any).results)) return (raw as any).results;
    if (Array.isArray((raw as any).patrullas)) return (raw as any).patrullas;
  }
  return [];
}

function apiRowToFlotaVehiculo(raw: Record<string, unknown>): FlotaVehiculoRaw | null {
  const placaVehiculo = String(raw.placa_vehiculo ?? raw.placaVehiculo ?? '').trim()
  if (!placaVehiculo) return null

  return {
    placaVehiculo,
    numSerie: String(raw.num_serie ?? raw.numSerie ?? ''),
    marca: String(raw.marca ?? ''),
    modelo: String(raw.modelo ?? ''),
    color: String(raw.color ?? ''),
    tipoVehiculo: String(raw.tipo_vehiculo ?? raw.tipoVehiculo ?? ''),
    secretaria: String(raw.secretaria ?? ''),
    idVehiculo: Number(raw.id_vehiculo ?? raw.idVehiculo ?? 0),
  }
}

let cacheFlota: {
  datos: FlotaVehiculoRaw[];
  timestamp: number;
} | null = null;

export async function obtenerFlota(): Promise<{
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
  const datos = extraerVehiculos(raw)
    .map(apiRowToFlotaVehiculo)
    .filter((v): v is FlotaVehiculoRaw => v !== null)

  cacheFlota = { datos, timestamp: ahora };

  return { datos, desdeCache: false };
}

export function invalidarCache() {
  cacheFlota = null;
}

export async function listarPatrullasParaAsignacion(): Promise<
  PatrullaAsignacion[]
> {
  const stale = await estaStale(6);

  if (stale) {
    const { datos } = await obtenerFlota();
    if (datos.length > 0) {
      await upsertPatrullas(datos);
    }
  }

  const rows = await listarActivas();
  return rows.map((r) => ({
    id: r.id,
    numeroUnidad: r.numeroUnidad,
    placas: r.placas,
    descripcion: r.descripcion,
  }));
}

const TOP_UNIDADES_CERCANAS = 10;

export async function listarUnidadesParaDespacho(
  incidenteLat: number | null,
  incidenteLng: number | null,
  prioritarioPatrullaId?: string | null,
): Promise<UnidadParaDespacho[]> {
  const rows = await listarUnidadesConTripulacionRaw();
  const unidades = agruparUnidadesConTripulacion(rows);

  const conDistancia = unidades.map((u) => ({
    ...u,
    distanciaKm:
      incidenteLat != null && incidenteLng != null && u.ultimaLat != null && u.ultimaLng != null
        ? distanciaHaversineKm(incidenteLat, incidenteLng, u.ultimaLat, u.ultimaLng)
        : null,
  }));

  // La unidad prioritaria (la del oficial que ya está en el lugar, si el incidente viene
  // de un rondín escalado) siempre debe poder resolverse — no se le aplican el filtro de
  // ubicación ni el tope de 10, aunque no aparezca en "cercanas" para elegir de nuevo.
  const prioritaria = prioritarioPatrullaId
    ? conDistancia.find((u) => u.id === prioritarioPatrullaId) ?? null
    : null;

  const cercanas = conDistancia
    // Sin ubicación (ningún oficial de la tripulación reportó posición) no hay forma de
    // saber si está cerca — se descarta en vez de mostrarla como "más cercana" al final.
    .filter((u): u is typeof u & { distanciaKm: number } => u.distanciaKm != null)
    .sort((a, b) => a.distanciaKm - b.distanciaKm)
    .slice(0, TOP_UNIDADES_CERCANAS);

  if (prioritaria && !cercanas.find((u) => u.id === prioritaria.id)) {
    return [prioritaria, ...cercanas];
  }
  return cercanas;
}

export async function obtenerPatrullaPorId(
  id: string | null,
): Promise<PatrullaAsignacion | null> {
  if (!id) return null;
  const row = await obtenerPorId(id);
  if (!row) return null;
  return {
    id: row.id,
    numeroUnidad: row.numeroUnidad,
    placas: row.placas,
    descripcion: row.descripcion,
  };
}
