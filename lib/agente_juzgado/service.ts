import { obtenerRolUsuario } from './repository'

export async function verificarRolJuzgado(userId: string): Promise<boolean> {
  const rol = await obtenerRolUsuario(userId)
  return rol === 'agente_juzgado'
}
