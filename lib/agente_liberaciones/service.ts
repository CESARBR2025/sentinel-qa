import { obtenerRolUsuario, obtenerLiberaciones } from './repository'
import { rowToLiberacion } from './mapper'
import type { LiberacionRow } from './types'

export async function verificarRolLiberaciones(userId: string): Promise<boolean> {
  const rol = await obtenerRolUsuario(userId)
  return rol === 'agente_liberaciones'
}

export async function listarLiberaciones(): Promise<LiberacionRow[]> {
  const result = await obtenerLiberaciones()
  return result.rows.map(rowToLiberacion)
}
