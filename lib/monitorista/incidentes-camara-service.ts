import { query } from '@/lib/db'

export interface IncidenteCamara {
  id: string
  fecha: string
  turno: string
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
}

const TURNOS = ['MATUTINO', 'VESPERTINO', 'NOCTURNO'] as const
export type Turno = typeof TURNOS[number]

function parseTurno(t: string): Turno {
  if (TURNOS.includes(t as Turno)) return t as Turno
  return 'MATUTINO'
}

export async function listarRegistros(turno?: Turno): Promise<IncidenteCamara[]> {
  let sql = `SELECT * FROM incidentes_camara`
  const params: unknown[] = []
  if (turno) {
    sql += ` WHERE turno = $1`
    params.push(turno)
  }
  sql += ` ORDER BY fecha DESC, turno ASC LIMIT 100`
  const r = await query<Record<string, unknown>>(sql, params)
  return r.rows.map(rowToIncidente)
}

export async function obtenerRegistro(id: string): Promise<IncidenteCamara | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM incidentes_camara WHERE id = $1`,
    [id],
  )
  if (!r.rows.length) return null
  return rowToIncidente(r.rows[0])
}

export async function crearRegistro(data: {
  fecha: string
  turno: Turno
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
}): Promise<string> {
  const r = await query<{ id: string }>(
    `INSERT INTO incidentes_camara (fecha, turno, registrado_por, personas_sin_novedad, personas_con_antecedentes, total_personas_revisadas, vehiculos_revisar, vehiculos_repuve, motos_revisadas, persecuciones, asegurados_camara, vehiculos_recuperados, incendios, hechos_transito)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
    [
      data.fecha, data.turno, data.registrado_por,
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

export { TURNOS }

function rowToIncidente(r: Record<string, unknown>): IncidenteCamara {
  return {
    id: String(r.id),
    fecha: String(r.fecha),
    turno: parseTurno(String(r.turno)),
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
  }
}
