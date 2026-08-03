import { listarActivas, obtenerPorId, listarUnidadesConTripulacionRaw, listarIdsUnidadesOcupadas } from "./repository";
import { agruparUnidadesConTripulacion } from "./mapper";
import type { PatrullaAsignacion, UnidadParaDespacho } from "./types";
import { distanciaHaversineKm } from "@/lib/shared/geo";

export async function listarPatrullasParaAsignacion(): Promise<
  PatrullaAsignacion[]
> {
  const rows = await listarActivas();
  return rows.map((r) => ({
    id: r.id,
    placa: r.placa,
    etiqueta: r.etiqueta,
    detalle: r.detalle,
    marca: r.marca,
    modelo: r.modelo,
    numSerie: r.numSerie,
  }));
}

export async function listarUnidadesParaDespacho(
  incidenteLat: number | null,
  incidenteLng: number | null,
  prioritarioPatrullaId?: string | null,
  incidenteIdActual?: string | null,
): Promise<UnidadParaDespacho[]> {
  const rows = await listarUnidadesConTripulacionRaw();
  const unidades = agruparUnidadesConTripulacion(rows);

  const idsOcupadas = await listarIdsUnidadesOcupadas(incidenteIdActual ?? null);

  const conDistancia = unidades.map((u) => ({
    ...u,
    ocupada: idsOcupadas.has(u.id),
    distanciaKm:
      incidenteLat != null && incidenteLng != null && u.ultimaLat != null && u.ultimaLng != null
        ? distanciaHaversineKm(incidenteLat, incidenteLng, u.ultimaLat, u.ultimaLng)
        : null,
  }));

  // La unidad prioritaria (la del oficial que ya está en el lugar, si el incidente viene
  // de un rondín escalado) siempre debe poder resolverse — no se le aplica el filtro de
  // ubicación, aunque no aparezca en "cercanas" para elegir de nuevo.
  const prioritaria = prioritarioPatrullaId
    ? conDistancia.find((u) => u.id === prioritarioPatrullaId) ?? null
    : null;

  const cercanas = conDistancia
    // Sin ubicación (ningún oficial de la tripulación reportó posición) no hay forma de
    // saber si está cerca — se descarta en vez de mostrarla como "más cercana" al final.
    .filter((u): u is typeof u & { distanciaKm: number } => u.distanciaKm != null)
    .sort((a, b) => a.distanciaKm - b.distanciaKm);

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
    placa: row.placa,
    etiqueta: row.etiqueta,
    detalle: row.detalle,
    marca: row.marca,
    modelo: row.modelo,
    numSerie: row.numSerie,
  };
}
