import { tienePermiso } from '@/lib/incidentes/permisos'

export async function verificarRolAgenteBitacorista(userId: string): Promise<boolean> {
  return tienePermiso(userId, 'incidentes', 'ver')
}
