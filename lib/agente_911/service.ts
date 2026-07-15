import { tieneAlgunAcceso } from '@/lib/911/permisos'

export async function verificarRolAgente911(userId: string): Promise<boolean> {
  return tieneAlgunAcceso(userId, ['911_ciudadano', '911_whatsapp'])
}
