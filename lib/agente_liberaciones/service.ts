import { obtenerLiberaciones } from './repository'
import { rowToLiberacion } from './mapper'
import { tienePermiso } from './permisos'
import type { LiberacionRow } from './types'

export async function verificarRolLiberaciones(userId: string): Promise<boolean> {
  return tienePermiso(userId, 'liberaciones', 'ver')
}

export async function listarLiberaciones(): Promise<LiberacionRow[]> {
  const result = await obtenerLiberaciones()
  return result.rows.map(rowToLiberacion)
}
