import { query } from '@/lib/db'

const PERIODOS = ['diario', 'semanal', 'mensual'] as const
export type Periodo = typeof PERIODOS[number]
export { PERIODOS }

export interface FormatoNAtencionVictimas {
  id: string
  fecha: string
  periodo: Periodo
  capturado_por: string
  numero_atenciones: number
  atenciones_medicas: number
  atenciones_psicologicas: number
  asesorias_juridicas: number
  observaciones: string | null
  creado_en: string
}

function parsePeriodo(p: string): Periodo {
  if (PERIODOS.includes(p as Periodo)) return p as Periodo
  return 'diario'
}

function formatFecha(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'string') return v.slice(0, 10)
  return String(v).slice(0, 10)
}

function rowTo(r: Record<string, unknown>): FormatoNAtencionVictimas {
  return {
    id: String(r.id),
    fecha: formatFecha(r.fecha),
    periodo: parsePeriodo(String(r.periodo)),
    capturado_por: String(r.capturado_por),
    numero_atenciones: Number(r.numero_atenciones),
    atenciones_medicas: Number(r.atenciones_medicas),
    atenciones_psicologicas: Number(r.atenciones_psicologicas),
    asesorias_juridicas: Number(r.asesorias_juridicas),
    observaciones: r.observaciones != null ? String(r.observaciones) : null,
    creado_en: String(r.creado_en),
  }
}

export async function listarAtencionVictimas(periodo?: Periodo): Promise<FormatoNAtencionVictimas[]> {
  let sql = `SELECT * FROM formato_n_atencion_victimas`
  const params: unknown[] = []
  if (periodo) {
    sql += ` WHERE periodo = $1`
    params.push(periodo)
  }
  sql += ` ORDER BY fecha DESC LIMIT 100`
  const r = await query<Record<string, unknown>>(sql, params)
  return r.rows.map(rowTo)
}

export async function obtenerAtencionVictimas(id: string): Promise<FormatoNAtencionVictimas | null> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_atencion_victimas WHERE id = $1`, [id])
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export async function obtenerAtencionVictimasPorFechaPeriodo(fecha: string, periodo: Periodo): Promise<FormatoNAtencionVictimas | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM formato_n_atencion_victimas WHERE fecha = $1 AND periodo = $2 LIMIT 1`,
    [fecha, periodo],
  )
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export interface FormatoNAtencionVictimasInput {
  fecha: string
  periodo: Periodo
  capturado_por: string
  numero_atenciones?: number
  atenciones_medicas?: number
  atenciones_psicologicas?: number
  asesorias_juridicas?: number
  observaciones?: string | null
}

export async function crearAtencionVictimas(data: FormatoNAtencionVictimasInput): Promise<string> {
  const r = await query<{ id: string }>(
    `INSERT INTO formato_n_atencion_victimas (fecha, periodo, capturado_por, numero_atenciones, atenciones_medicas, atenciones_psicologicas, asesorias_juridicas, observaciones)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [data.fecha, data.periodo, data.capturado_por, data.numero_atenciones ?? 0, data.atenciones_medicas ?? 0, data.atenciones_psicologicas ?? 0, data.asesorias_juridicas ?? 0, data.observaciones ?? null],
  )
  return r.rows[0].id
}

export async function actualizarAtencionVictimas(id: string, data: Partial<Omit<FormatoNAtencionVictimasInput, 'capturado_por'>>): Promise<void> {
  const cols: string[] = []
  const params: unknown[] = []
  let idx = 1
  for (const [k, v] of Object.entries(data)) {
    if (v !== undefined) {
      cols.push(`${k} = $${idx++}`)
      params.push(v)
    }
  }
  if (cols.length === 0) return
  params.push(id)
  await query(`UPDATE formato_n_atencion_victimas SET ${cols.join(', ')} WHERE id = $${idx}`, params)
}
