import { Pool } from 'pg'

declare global {
  var _pgPool: Pool | undefined
}

function createPool(): Pool {
  const newPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: process.env.NODE_ENV === 'production' ? 20 : 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
    keepAlive: true,
  })

  newPool.on('error', (err) => {
    console.error('Error inesperado en el pool de conexiones de Postgres:', err.message)
  })

  return newPool
}

const pool: Pool = globalThis._pgPool ?? createPool()

if (process.env.NODE_ENV !== 'production') {
  globalThis._pgPool = pool
}

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


