// lib\auxiliar\service.ts
import { obtenerParesReporte, obtenerCuestionariosRobo, upsertChecklist } from './repository'
import type { UpsertChecklistInput } from './types'

export async function listarParesReporte() {
  return obtenerParesReporte()
}

export async function listarCuestionariosRobo() {
  return obtenerCuestionariosRobo()
}

export async function guardarChecklist(input: UpsertChecklistInput) {
  return upsertChecklist(input)
}