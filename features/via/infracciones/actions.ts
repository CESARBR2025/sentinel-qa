"use server";

import { InfraccionesRepository } from "./repository";
import { DatosParaNarrativa, InfraccionesService } from "./service";

export async function eliminarInfraccionAction(id: string) {
  await InfraccionesRepository.eliminarInfraccion(id);
  return { success: true };
}

export async function generarNarrativaAction(datos: DatosParaNarrativa) {
  const narrativa = await InfraccionesService.generarNarrativa(datos);
  return { success: true, narrativa };
}

export async function extraerCapturaDeNarrativaAction(transcripcion: string) {
  const datos = await InfraccionesService.extraerDeNarrativa(transcripcion);
  return { success: true, datos };
}
