import 'server-only'
import crypto from 'crypto'

const KEY = deriveKey()

function deriveKey(): Buffer {
  const secret = process.env.BETTER_AUTH_SECRET || 'fallback-dev-only-change-in-production'
  return crypto.createHash('sha256').update(secret).digest()
}

const EXPIRY_MS = 5 * 60 * 1000

export interface EncryptedTokenPayload {
  ref: string
  exp: number
}

export function encryptRef(ref: string): string {
  const payload: EncryptedTokenPayload = { ref, exp: Date.now() + EXPIRY_MS }
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv)
  let encrypted = cipher.update(JSON.stringify(payload), 'utf8', 'base64url')
  encrypted += cipher.final('base64url')
  const tag = cipher.getAuthTag().toString('base64url')
  return `${iv.toString('base64url')}.${encrypted}.${tag}`
}

export function decryptRef(encoded: string): { ref: string } | null {
  try {
    const parts = encoded.split('.')
    if (parts.length !== 3) return null
    const [ivB64, encryptedB64, tagB64] = parts
    const iv = Buffer.from(ivB64, 'base64url')
    const tag = Buffer.from(tagB64, 'base64url')
    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv)
    decipher.setAuthTag(tag)
    let decrypted = decipher.update(encryptedB64, 'base64url', 'utf8')
    decrypted += decipher.final('utf8')
    const payload: EncryptedTokenPayload = JSON.parse(decrypted)
    if (Date.now() > payload.exp) return null
    return { ref: payload.ref }
  } catch {
    return null
  }
}
