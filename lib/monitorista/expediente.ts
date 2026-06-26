const EXP_URL = process.env.EXPEDIENTE_DIGITAL_URL ?? 'https://sanjuandelrio.sytes.net:3044'
const GUEST_CODE = `INV-${new Date().getFullYear()}-001`
const ID_USUARIO_GENERAL = 'SSPM_SISTEMA'

let cachedToken: { token: string; expiresAt: number } | null = null

export async function obtenerGuestToken(nombre: string): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedToken.token
  }

  const res = await fetch(`${EXP_URL}/api/auth/guest-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      codigo_invitacion: GUEST_CODE,
      nombre_invitado: nombre,
    }),
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Expediente Digital no disponible (${res.status}): ${text}`)
  }

  const json = await res.json() as { success: boolean; token: string; expires_in: string }
  if (!json.success || !json.token) throw new Error('Token de invitado inválido')

  const expiresIn = parseInt(json.expires_in) || parseInt((json as any).expiresIn) || 28800
  cachedToken = { token: json.token, expiresAt: Date.now() + expiresIn * 1000 }

  return json.token
}

export async function subirArchivoExpediente(
  token: string,
  archivo: { buffer: Buffer; nombre: string; tipo: string },
  folio: string,
  tipoDocumento: string,
): Promise<string> {
  const formData = new FormData()
  // Sanitizar nombre: eliminar caracteres especiales que Windows no maneja
  const nombreLimpio = archivo.nombre.replace(/[^\w.\-() ]/g, '_').replace(/\s+/g, ' ')
  formData.append('file', new File([archivo.buffer], nombreLimpio, { type: archivo.tipo || 'application/octet-stream' }))

  const params = new URLSearchParams({
    id_usuario_general: ID_USUARIO_GENERAL,
    tipo_documento: tipoDocumento,
    folio: folio,
    tipo_tramite: 'EVIDENCIA_MONITORISTA',
  })

  const res = await fetch(`${EXP_URL}/api/documents/upload-and-create?${params}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
    signal: AbortSignal.timeout(60000),
  })

  if (!res.ok) {
    const err = await res.text()
    const msg = err.includes('No se puede mostrar') || res.status === 500
      ? `El Expediente Digital rechazó el archivo (posiblemente excede el límite de tamaño del servidor)`
      : `Error del Expediente (${res.status}): ${err.substring(0, 200)}`
    console.error('[expediente] error:', res.status, err.substring(0, 500))
    throw new Error(msg)
  }

  const json = await res.json() as { success: boolean; message?: string; documento?: { url_archivo: string } }
  if (!json.success) throw new Error(json.message || 'Fallo la subida al Expediente Digital')

  return `${EXP_URL}${json.documento?.url_archivo ?? ''}`
}

export function limpiarCacheToken(): void {
  cachedToken = null
}
