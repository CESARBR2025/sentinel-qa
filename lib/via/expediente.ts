import { getToken, limpiarCacheToken as limpiarV2 } from '@/lib/expediente/v2/client'

export function getExpedienteHost(): string {
  return process.env.EXPEDIENTE_DIGITAL_URL ?? 'https://sanjuandelrio.sytes.net:3044'
}

export async function getExpedienteToken(): Promise<string> {
  return getToken()
}

export function limpiarCacheToken(): void {
  limpiarV2()
}
