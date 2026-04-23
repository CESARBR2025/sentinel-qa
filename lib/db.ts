import { Pool } from 'pg'

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined
}

function createPool(): Pool {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  })
}

// Reutiliza el pool entre hot-reloads en desarrollo
const pool: Pool = globalThis._pgPool ?? createPool()

if (process.env.NODE_ENV !== 'production') {
  globalThis._pgPool = pool
}

export default pool

export async function query<T extends object = Record<string, unknown>>(
  text: string,
  params?: unknown[]
) {
  const result = await pool.query<T>(text, params)
  return result
}
