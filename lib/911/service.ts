import { obtenerCatalogos, obtenerStats, listarIncidentes, obtenerIncidente, obtenerIncidenteConExtras, obtenerTiposIncidente, contarPorCanalizacion, obtenerDespachadores } from './repository'
import type { CatalogoItem, IncidenteDetalle, IncidenteStats } from './types'

export async function getCatalogos() {
  return obtenerCatalogos()
}

export async function getStats(hoyISO: string): Promise<IncidenteStats> {
  return obtenerStats(hoyISO)
}

export async function getIncidentesPaginados(
  canal: string | null,
  page: number = 1,
  pageSize: number = 20,
  canalizacion?: 'canalizados' | 'sin_canalizacion' | null,
) {
  return listarIncidentes(canal, page, pageSize, canalizacion)
}

export async function getIncidente(id: string): Promise<IncidenteDetalle | null> {
  return obtenerIncidente(id)
}

export async function getIncidenteConExtras(id: string) {
  return obtenerIncidenteConExtras(id)
}

export async function getTiposIncidente(): Promise<CatalogoItem[]> {
  return obtenerTiposIncidente()
}

export async function getConteoCanalizacion(canal: string) {
  return contarPorCanalizacion(canal)
}

export async function getDespachadores() {
  return obtenerDespachadores()
}
