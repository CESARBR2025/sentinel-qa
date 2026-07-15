import { tieneAlgunAcceso } from '@/lib/911/permisos'

export async function verificarRolAgenteDespacho(userId: string): Promise<boolean> {
  return tieneAlgunAcceso(userId, ['911_rondin', '911_despacho'])
}
