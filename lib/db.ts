import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './db/schema'

declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined
  // eslint-disable-next-line no-var
  var _viaPool: Pool | undefined
}

function createPool(): Pool {
  const newPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: process.env.NODE_ENV === 'production' ? 20 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000, // Aumentado ligeramente para redes inestables
    // Evita que las conexiones se cierren silenciosamente por firewalls
    keepAlive: true,
  })

  // CRÍTICO: Capturar errores a nivel del pool. 
  // Si una conexión inactiva falla y no hay listener, Node.js crashea todo el proceso.
  newPool.on('error', (err) => {
    console.error('⚠️ Error inesperado en el pool de conexiones de Postgres:', err.message)
  })

  return newPool
}

// Reutiliza el pool entre hot-reloads en desarrollo
const pool: Pool = globalThis._pgPool ?? createPool()

if (process.env.NODE_ENV !== 'production') {
  globalThis._pgPool = pool
}

export const db = drizzle(pool, { schema })

export default pool

export async function query<T extends object = Record<string, unknown>>(
  text: string,
  params?: unknown[]
) {
  const start = Date.now()
  try {
    const result = await pool.query<T>(text, params)
    const duration = Date.now() - start
    
    // Loguear consultas peligrosamente lentas en producción
    if (process.env.NODE_ENV === 'production' && duration > 2000) {
      console.warn(`⏳ Query lenta detectada (${duration}ms):`, text.substring(0, 100))
    }
    
    return result
  } catch (error) {
    console.error('❌ Error ejecutando query en la BDD:', error instanceof Error ? error.message : error)
    throw error
  }
}

// ─── Pool para la base de datos VÍA (via_prueba) ───

function createViaPool(): Pool {
  const dbUrl = process.env.DATABASE_URL
  const viaDbName = process.env.DB_NAME_VIA || 'via_prueba'
  const viaConnectionString = dbUrl?.replace(/\/[^/]+$/, '/' + viaDbName)

  const newPool = new Pool({
    connectionString: viaConnectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
    keepAlive: true,
  })

  newPool.on('error', (err) => {
    console.error('⚠️ Error inesperado en el pool VÍA:', err.message)
  })

  return newPool
}

export const viaPool: Pool = globalThis._viaPool ?? createViaPool()

if (process.env.NODE_ENV !== 'production') {
  globalThis._viaPool = viaPool
}

export async function queryVia<T extends object = Record<string, unknown>>(
  text: string,
  params?: unknown[]
) {
  try {
    const result = await viaPool.query<T>(text, params)
    return result
  } catch (error) {
    console.error('❌ Error ejecutando query en BD VÍA:', error instanceof Error ? error.message : error)
    throw error
  }
}
