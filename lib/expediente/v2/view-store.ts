import 'server-only'
import crypto from 'crypto'

const EXPIRY_MS = 5 * 60 * 1000

interface Entry {
  ref: string
  expiresAt: number
}

const store = new Map<string, Entry>()

export function createViewToken(ref: string): string {
  purge()
  const token = crypto.randomUUID()
  store.set(token, { ref, expiresAt: Date.now() + EXPIRY_MS })
  if (store.size > 5000) {
    const first = store.keys().next().value
    if (first) store.delete(first)
  }
  return token
}

export function consumeViewToken(token: string): string | null {
  const entry = store.get(token)
  if (!entry) return null
  store.delete(token)
  if (Date.now() > entry.expiresAt) return null
  return entry.ref
}

function purge() {
  const now = Date.now()
  for (const [key, entry] of store) {
    if (now > entry.expiresAt) store.delete(key)
  }
}
