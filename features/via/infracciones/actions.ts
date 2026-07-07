"use server";

import { InfraccionesRepository } from "./repository";

export async function eliminarInfraccionAction(id: string) {
  await InfraccionesRepository.eliminarInfraccion(id);
  return { success: true };
}
