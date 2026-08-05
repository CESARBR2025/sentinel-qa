import { createHmac, randomBytes } from 'crypto'
import { query } from '@/lib/db'

// ─── Componente TEMPORAL de desarrollo: cambiar de usuario sin login ─────────
// Bypass intencional de autenticación. Crea una sesión de better-auth real
// (fila en `sessions` + cookie firmada con BETTER_AUTH_SECRET) apuntando al
// usuario elegido, y devuelve la cookie lista para responder.
// Consumido por app/api/dev/cambiar-sesion/route.ts. Eliminar junto con
// components/dev/CambiarSesionDev.tsx y su integración en
// components/partials/Header.tsx cuando deje de ser necesario.

export const COOKIE_SESION = 'better-auth.session_token'
export const DURACION_SESION_SEG = 60 * 60 * 8 // igual que lib/auth.ts (8 horas)

// Mismo charset que better-auth usa en generateId() (a-z A-Z 0-9).
export function generarAlfanumerico(longitud: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = randomBytes(longitud)
  let out = ''
  for (let i = 0; i < longitud; i++) out += chars[bytes[i] % chars.length]
  return out
}

// Firmado HMAC-SHA256 base64, idéntico a signCookieValue de better-call:
// el cookie vale `${token}.${firma}` URI-encoded.
export function valorCookieSesion(token: string): string {
  const secret = process.env.BETTER_AUTH_SECRET
  if (!secret) throw new Error('BETTER_AUTH_SECRET no está configurada')
  const firma = createHmac('sha256', secret).update(token).digest('base64')
  return encodeURIComponent(`${token}.${firma}`)
}

function extraerTokenDeCookie(cookieHeader: string): string | null {
  const match = cookieHeader.match(/(?:^|;\s*)better-auth\.session_token=([^;]+)/)
  if (!match) return null
  // El token es alfanumérico: la parte antes del primer `.` (la firma va después).
  return decodeURIComponent(match[1]).split('.')[0] || null
}

export interface SesionNuevaResult {
  cookies: string[]
}

/**
 * Crea una sesión real de better-auth para el usuario destino y devuelve los
 * Set-Cookie listos para la respuesta. Orden seguro: primero se inserta la
 * sesión nueva y SOLO después se revoca la actual (si viene en `cookieHeader`),
 * para que un fallo nunca deje al usuario sin sesión. También expira la cookie
 * cache de sesión (`better-auth.session_data` + chunks) — sin eso, getSession
 * seguiría sirviendo la sesión vieja desde la cookie cache y el switch no se
 * notaría en el navegador.
 */
export async function crearSesionNueva(userId: string, cookieHeader?: string): Promise<SesionNuevaResult> {
  const destino = await query<{ id: string }>(
    `SELECT id FROM users WHERE id = $1 AND activo = true LIMIT 1`,
    [userId],
  )
  if (!destino.rows.length) throw new Error('Usuario destino no encontrado o inactivo')

  const tokenNuevo = generarAlfanumerico(32)

  // 1) Sesión nueva primero (expiración relativa calculada por la BD).
  await query(
    `INSERT INTO sessions (id, token, user_id, expires_at, created_at, updated_at)
     VALUES ($1, $2, $3, now() + make_interval(secs => $4), now(), now())`,
    [generarAlfanumerico(32), tokenNuevo, userId, DURACION_SESION_SEG],
  )

  // 2) Recién creada la nueva, revocar la anterior (best-effort).
  if (cookieHeader) {
    const tokenActual = extraerTokenDeCookie(cookieHeader)
    if (tokenActual) {
      await query(`DELETE FROM sessions WHERE token = $1`, [tokenActual]).catch(() => undefined)
    }
  }

  const secure = process.env.NODE_ENV === 'production'
  const prefix = secure ? '__Secure-' : ''
  const base = `Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`
  const expirada = `=; ${base}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`

  const cookies: string[] = [
    `${prefix}${COOKIE_SESION}=${valorCookieSesion(tokenNuevo)}; ${base}; Max-Age=${DURACION_SESION_SEG}`,
    `${prefix}better-auth.session_data${expirada}`,
    // Chunks de la cookie cache (better-auth.session_data.0, .1, …).
    ...Array.from({ length: 30 }, (_, i) => `${prefix}better-auth.session_data.${i}${expirada}`),
  ]

  return { cookies }
}
