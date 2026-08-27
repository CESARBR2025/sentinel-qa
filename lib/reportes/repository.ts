import { query } from '@/lib/db'

export async function getIncidentesCount(): Promise<number> {
  const result = await query<{ count: number }>('SELECT count(*)::int AS count FROM incidentes')
  return result.rows[0]?.count ?? 0
}

export async function getEnvioFormatosCount(): Promise<number> {
  const tablas = ['formato_n_eventos', 'formato_n_fge', 'formato_n_fgr', 'formato_n_rnd', 'formato_n_medios_alternativos', 'formato_n_atencion_victimas', 'formato_n_armas_aseguradas']
  const counts = await Promise.all(tablas.map(t => query<{ c: number }>(`SELECT count(*)::int as c FROM ${t}`)))
  return counts.reduce((sum, r) => sum + (r.rows[0]?.c ?? 0), 0)
}
