import { query } from '@/lib/db'

export async function ping(): Promise<string> {
  const result = await query<{ now: string }>('SELECT NOW() as now')
  return result.rows[0].now
}
