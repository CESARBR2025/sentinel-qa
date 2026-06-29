import { query } from '@/lib/db'

export interface IncidenteCamara {
  id: number
  fecha: string
  registrado_por: string
  personas_sin_novedad: number
  personas_con_antecedentes: number
  total_personas_revisadas: number
  vehiculos_revisar: number
  vehiculos_repuve: number
  motos_revisadas: number
  persecuciones: number
  asegurados_camara: number
  vehiculos_recuperados: number
  incendios: number
  hechos_transito: number
  creado_en: string
}

export async function listarRegistros(): Promise<IncidenteCamara[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM incidentes_camara ORDER BY fecha DESC LIMIT 100`,
  )
  return r.rows.map(rowToIncidente)
}

export async function obtenerRegistro(id: number): Promise<IncidenteCamara | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM incidentes_camara WHERE id = $1`,
    [id],
  )
  if (!r.rows.length) return null
  return rowToIncidente(r.rows[0])
}

export async function crearRegistro(data: {
  fecha: string
  registrado_por: string
  personas_sin_novedad?: number
  personas_con_antecedentes?: number
  total_personas_revisadas?: number
  vehiculos_revisar?: number
  vehiculos_repuve?: number
  motos_revisadas?: number
  persecuciones?: number
  asegurados_camara?: number
  vehiculos_recuperados?: number
  incendios?: number
  hechos_transito?: number
}): Promise<number> {
  const r = await query<{ id: number }>(
    `INSERT INTO incidentes_camara (fecha, registrado_por, personas_sin_novedad, personas_con_antecedentes, total_personas_revisadas, vehiculos_revisar, vehiculos_repuve, motos_revisadas, persecuciones, asegurados_camara, vehiculos_recuperados, incendios, hechos_transito)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
    [
      data.fecha,
      data.registrado_por,
      data.personas_sin_novedad ?? 0,
      data.personas_con_antecedentes ?? 0,
      data.total_personas_revisadas ?? 0,
      data.vehiculos_revisar ?? 0,
      data.vehiculos_repuve ?? 0,
      data.motos_revisadas ?? 0,
      data.persecuciones ?? 0,
      data.asegurados_camara ?? 0,
      data.vehiculos_recuperados ?? 0,
      data.incendios ?? 0,
      data.hechos_transito ?? 0,
    ],
  )
  return r.rows[0].id
}

function rowToIncidente(r: Record<string, unknown>): IncidenteCamara {
  return {
    id: Number(r.id),
    fecha: String(r.fecha),
    registrado_por: String(r.registrado_por),
    personas_sin_novedad: Number(r.personas_sin_novedad),
    personas_con_antecedentes: Number(r.personas_con_antecedentes),
    total_personas_revisadas: Number(r.total_personas_revisadas),
    vehiculos_revisar: Number(r.vehiculos_revisar),
    vehiculos_repuve: Number(r.vehiculos_repuve),
    motos_revisadas: Number(r.motos_revisadas),
    persecuciones: Number(r.persecuciones),
    asegurados_camara: Number(r.asegurados_camara),
    vehiculos_recuperados: Number(r.vehiculos_recuperados),
    incendios: Number(r.incendios),
    hechos_transito: Number(r.hechos_transito),
    creado_en: String(r.creado_en),
  }
}
