import 'server-only'
import type { RefExpediente } from './ref'

const BASE_URL = process.env.EXPEDIENTE_URL
const API_KEY = process.env.EXPEDIENTE_API_KEY
const GUEST_CODE = process.env.EXPEDIENTE_GUEST_CODE

let guestToken: { token: string; expiresAt: number } | null = null
let refreshPromise: Promise<string> | null = null

function apiKey(): string {
  const raw = API_KEY ?? ''
  const colonIdx = raw.indexOf(':')
  return colonIdx !== -1 ? raw.slice(colonIdx + 1) : raw
}

function parseExpiry(s: string): number {
  const m = s.match(/^(\d+)(h|m|s)$/)
  if (!m) return 28800
  const n = parseInt(m[1]), u = m[2]
  return u === 'h' ? n * 3600 : u === 'm' ? n * 60 : n
}

export function estaConfigurado(): boolean {
  return !!(BASE_URL && API_KEY)
}

export async function getToken(): Promise<string> {
  if (!BASE_URL || !API_KEY) throw new Error('EXPEDIENTE_URL y EXPEDIENTE_API_KEY requeridos')

  if (guestToken && Date.now() < guestToken.expiresAt - 5 * 60 * 1000) {
    return guestToken.token
  }

  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    const res = await fetch(`${BASE_URL}/api/auth/guest-token`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo_invitacion: GUEST_CODE, nombre_invitado: 'Centinela' }),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      if (res.status === 429) throw new Error('Demasiados intentos de autenticación, espera un minuto')
      throw new Error(`Expediente auth error (${res.status}): ${body.slice(0, 200)}`)
    }

    const data = await res.json() as { token: string; expires_in: string }
    const expiresIn = parseExpiry(data.expires_in)
    guestToken = { token: data.token, expiresAt: Date.now() + expiresIn * 1000 }
    return data.token
  })()

  try { return await refreshPromise }
  finally { refreshPromise = null }
}

export function limpiarCacheToken(): void {
  guestToken = null
}

export async function subir(
  archivo: { buffer: Buffer; nombre: string; tipo: string },
  subcarpeta: string,
): Promise<RefExpediente> {
  const token = await getToken()
  const folderPath = subcarpeta

  const formData = new FormData()
  const blob = new Blob([archivo.buffer as BlobPart], { type: archivo.tipo || 'application/octet-stream' })
  formData.append('folderPath', folderPath)
  formData.append('file', blob, archivo.nombre)

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
    signal: AbortSignal.timeout(60000),
  })

  if (res.status === 401) {
    limpiarCacheToken()
    const token2 = await getToken()
    const res2 = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token2}` },
      body: formData,
      signal: AbortSignal.timeout(60000),
    })
    if (!res2.ok) throw new Error(`Upload error (${res2.status})`)
    const data2 = await res2.json() as { success: boolean; file: { uuid: string } }
    return { folderPath, uuid: data2.file.uuid }
  }

  if (!res.ok) {
    if (res.status === 413) throw new Error('Archivo excede el límite de tamaño del servidor')
    if (res.status === 415) throw new Error('Tipo de archivo no permitido')
    const body = await res.text().catch(() => '')
    throw new Error(`Upload error (${res.status}): ${body.slice(0, 200)}`)
  }

  const data = await res.json() as { success: boolean; file: { uuid: string } }
  return { folderPath, uuid: data.file.uuid }
}

const viewTokenCache = new Map<string, { token: string; expiresAt: number }>()

export async function obtenerViewToken(ref: RefExpediente): Promise<string> {
  const cacheKey = `${ref.folderPath}#${ref.uuid}`
  const cached = viewTokenCache.get(cacheKey)
  if (cached && Date.now() < cached.expiresAt - 60 * 1000) {
    return cached.token
  }

  const token = await getToken()
  const res = await fetch(`${BASE_URL}/api/browse?path=${encodeURIComponent(ref.folderPath)}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) throw new Error(`Browse error (${res.status})`)

  const data = await res.json() as {
    files: Array<{ uuid: string; viewUrl: string }>
  }

  const file = data.files.find(f => f.uuid === ref.uuid)
  if (!file) throw new Error('Documento no encontrado en expediente')

  const tParam = file.viewUrl.match(/[?&]t=([^&]+)/)?.[1]
  if (!tParam) throw new Error('View token no encontrado en respuesta')

  viewTokenCache.set(cacheKey, { token: tParam, expiresAt: Date.now() + 4 * 60 * 1000 })

  if (viewTokenCache.size > 500) {
    const first = viewTokenCache.keys().next().value
    if (first) viewTokenCache.delete(first)
  }

  return tParam
}

export async function descargar(ref: RefExpediente): Promise<Response> {
  const viewToken = await obtenerViewToken(ref)
  const bearer = await getToken()
  return fetch(`${BASE_URL}/v?t=${encodeURIComponent(viewToken)}`, {
    headers: { Authorization: `Bearer ${bearer}` },
    signal: AbortSignal.timeout(30000),
  })
}

export { apiKey as _testApiKey }
