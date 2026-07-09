import { query } from '@/lib/db'
import type { IncidenteCamara, TotalesCamara } from './types'
import { rowToIncidenteCamara, rowToTotalesCamara } from './mapper'

export async function obtenerIncidentesCamara(desde?: string, hasta?: string): Promise<IncidenteCamara[]> {
  const d = desde ?? '2000-01-01'
  const h = hasta  ?? new Date().toISOString().split('T')[0]

  const result = await query<Record<string, unknown>>(`
    SELECT
      ic.fecha,
      ic.turno,
      ic.personas_sin_novedad,
      ic.personas_con_antecedentes,
      ic.vehiculos_revisar,
      ic.vehiculos_repuve,
      ic.persecuciones,
      ic.asegurados_camara,
      ic.vehiculos_recuperados,
      ic.incendios,
      ic.hechos_transito,
      ic.motos_revisadas,
      ic.total_personas_revisadas,
      u.name AS registrado_por
    FROM incidentes_camara ic
    LEFT JOIN users u ON u.id = ic.registrado_por
    WHERE ic.fecha BETWEEN $1 AND $2
    ORDER BY ic.fecha DESC, ic.turno ASC
  `, [d, h])

  return result.rows.map(rowToIncidenteCamara)
}

export async function obtenerTotalesCamara(desde?: string, hasta?: string): Promise<TotalesCamara | null> {
  const d = desde ?? '2000-01-01'
  const h = hasta  ?? new Date().toISOString().split('T')[0]

  const result = await query<Record<string, unknown>>(`
    SELECT
      SUM(personas_sin_novedad)      AS total_sin_novedad,
      SUM(personas_con_antecedentes) AS total_con_antecedentes,
      SUM(vehiculos_revisar)         AS total_vehiculos,
      SUM(persecuciones)             AS total_persecuciones,
      SUM(asegurados_camara)         AS total_asegurados,
      SUM(vehiculos_recuperados)     AS total_recuperados,
      SUM(total_personas_revisadas)  AS total_personas
    FROM incidentes_camara
    WHERE fecha BETWEEN $1 AND $2
  `, [d, h])

  return result.rows[0] ? rowToTotalesCamara(result.rows[0]) : null
}

export async function obtenerPorTurno(turno: string, desde: string, hasta: string): Promise<IncidenteCamara[]> {
  const result = await query<Record<string, unknown>>(`
    SELECT
      fecha, personas_sin_novedad, personas_con_antecedentes,
      vehiculos_revisar, vehiculos_repuve, persecuciones,
      asegurados_camara, vehiculos_recuperados, incendios,
      hechos_transito, motos_revisadas, total_personas_revisadas
    FROM incidentes_camara
    WHERE turno = $1 AND fecha BETWEEN $2 AND $3
    ORDER BY fecha ASC
  `, [turno, desde, hasta])
  return result.rows.map(rowToIncidenteCamara)
}

export async function obtenerConcentradoDiario(desde: string, hasta: string): Promise<IncidenteCamara[]> {
  const result = await query<Record<string, unknown>>(`
    SELECT
      fecha, turno,
      personas_sin_novedad, personas_con_antecedentes,
      vehiculos_revisar, vehiculos_repuve, persecuciones,
      asegurados_camara, vehiculos_recuperados, incendios,
      hechos_transito, motos_revisadas, total_personas_revisadas
    FROM incidentes_camara
    WHERE fecha BETWEEN $1 AND $2
    ORDER BY fecha ASC, turno ASC
  `, [desde, hasta])
  return result.rows.map(rowToIncidenteCamara)
}
