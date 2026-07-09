import { query } from '@/lib/db'

export interface FormatoNStats {
  eventos: number
  fge: number
  fgr: number
  rnd: number
  medios: number
  victimas: number
  armas: number
}

export async function getFormatoNStats(): Promise<FormatoNStats> {
  const [eventos, fge, fgr, rnd, medios, victimas, armas] = await Promise.all([
    query<{ c: number }>('SELECT count(*)::int as c FROM formato_n_eventos'),
    query<{ c: number }>('SELECT count(*)::int as c FROM formato_n_fge'),
    query<{ c: number }>('SELECT count(*)::int as c FROM formato_n_fgr'),
    query<{ c: number }>('SELECT count(*)::int as c FROM formato_n_rnd'),
    query<{ c: number }>('SELECT count(*)::int as c FROM formato_n_medios_alternativos'),
    query<{ c: number }>('SELECT count(*)::int as c FROM formato_n_atencion_victimas'),
    query<{ c: number }>('SELECT count(*)::int as c FROM formato_n_armas_aseguradas'),
  ])
  return {
    eventos: eventos.rows[0]?.c ?? 0,
    fge: fge.rows[0]?.c ?? 0,
    fgr: fgr.rows[0]?.c ?? 0,
    rnd: rnd.rows[0]?.c ?? 0,
    medios: medios.rows[0]?.c ?? 0,
    victimas: victimas.rows[0]?.c ?? 0,
    armas: armas.rows[0]?.c ?? 0,
  }
}

export async function getIncidentesCount(): Promise<number> {
  const result = await query<{ count: number }>('SELECT count(*)::int AS count FROM incidentes')
  return result.rows[0]?.count ?? 0
}

export async function getEnvioFormatosCount(): Promise<number> {
  const tablas = ['formato_n_eventos', 'formato_n_fge', 'formato_n_fgr', 'formato_n_rnd', 'formato_n_medios_alternativos', 'formato_n_atencion_victimas', 'formato_n_armas_aseguradas']
  const counts = await Promise.all(tablas.map(t => query<{ c: number }>(`SELECT count(*)::int as c FROM ${t}`)))
  return counts.reduce((sum, r) => sum + (r.rows[0]?.c ?? 0), 0)
}
