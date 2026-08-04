import { query } from '@/lib/db'

export async function obtenerOCrearToken(tipo: string, recursoId: string): Promise<string> {
  const existente = await query<{ token: string }>(
    `SELECT token FROM tokens_recurso WHERE tipo = $1 AND recurso_id = $2`,
    [tipo, recursoId],
  )
  if (existente.rows[0]) return existente.rows[0].token

  const creado = await query<{ token: string }>(
    `INSERT INTO tokens_recurso (tipo, recurso_id) VALUES ($1, $2)
     ON CONFLICT (tipo, recurso_id) DO UPDATE SET tipo = EXCLUDED.tipo
     RETURNING token`,
    [tipo, recursoId],
  )
  return creado.rows[0].token
}

export async function resolverToken(tipo: string, token: string): Promise<string | null> {
  const r = await query<{ recurso_id: string }>(
    `SELECT recurso_id FROM tokens_recurso WHERE tipo = $1 AND token = $2`,
    [tipo, token],
  )
  return r.rows[0]?.recurso_id ?? null
}
