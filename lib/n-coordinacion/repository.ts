import { query } from '@/lib/db'

export async function obtenerDatosCapturados(fecha: string) {
  const [fge, fgr, masc, victimas, obs] = await Promise.all([
    query<Record<string, unknown>>(`SELECT * FROM formato_n_fge WHERE fecha = $1 LIMIT 1`, [fecha]),
    query<Record<string, unknown>>(`SELECT * FROM formato_n_fgr WHERE fecha = $1 LIMIT 1`, [fecha]),
    query<Record<string, unknown>>(`SELECT * FROM formato_n_medios_alternativos WHERE fecha = $1 LIMIT 1`, [fecha]),
    query<Record<string, unknown>>(`SELECT * FROM formato_n_atencion_victimas WHERE fecha = $1 LIMIT 1`, [fecha]),
    query<Record<string, unknown>>(`SELECT * FROM formato_n_observaciones WHERE fecha = $1 LIMIT 1`, [fecha]),
  ])
  return {
    fge:      fge.rows[0]      ?? null,
    fgr:      fgr.rows[0]      ?? null,
    masc:     masc.rows[0]     ?? null,
    victimas: victimas.rows[0] ?? null,
    obs:      obs.rows[0]      ?? null,
  }
}

export async function obtenerObservacionesPorFecha(fecha: string) {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_observaciones WHERE fecha = $1 LIMIT 1`, [fecha])
  return r.rows[0] ?? null
}

// usada por el stepper de captura, ver plan-formato-n-fge-fgr/ETAPA-5.md
export async function upsertObservaciones(fecha: string, userId: string, observaciones: string) {
  await query(`
    INSERT INTO formato_n_observaciones (fecha, observaciones, capturado_por)
    VALUES ($1, $2, $3)
    ON CONFLICT (fecha) DO UPDATE SET
      observaciones = EXCLUDED.observaciones
  `, [fecha, observaciones, userId])
}


