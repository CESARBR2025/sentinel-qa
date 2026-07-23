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

export async function buscarFraccionesPorDescripcionAction(texto: string) {
  const resultados = await ArticulosService.buscarPorDescripcion(texto);
  return { success: true, data: resultados };
}
