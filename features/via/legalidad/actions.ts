"use server";

import { ArticulosService } from "./service";

export async function obtenerArticulosAction() {
  const articulos = await ArticulosService.obtenerArticulos();
  return { success: true, data: articulos };
}

export async function obtenerFraccionesAction(articuloId: string) {
  const fracciones = await ArticulosService.obtenerFraccionesPorArticulo(articuloId);
  return { success: true, data: fracciones };
}
