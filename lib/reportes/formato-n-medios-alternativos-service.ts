import { query } from '@/lib/db'

const PERIODOS = ['diario', 'semanal', 'mensual'] as const
export type Periodo = typeof PERIODOS[number]
export { PERIODOS }

export interface FormatoNMediosAlternativos {
  id: string
  fecha: string
  periodo: Periodo
  capturado_por: string
  asuntos_canalizados_por_fiscalia: number
  acuerdos: number
  monto_reparacion_danos: number
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

function rowTo(r: Record<string, unknown>): FormatoNMediosAlternativos {
  return {
    id: String(r.id),
    fecha: formatFecha(r.fecha),
    periodo: parsePeriodo(String(r.periodo)),
    capturado_por: String(r.capturado_por),
    asuntos_canalizados_por_fiscalia: Number(r.asuntos_canalizados_por_fiscalia),
    acuerdos: Number(r.acuerdos),
    monto_reparacion_danos: Number(r.monto_reparacion_danos),
    creado_en: String(r.creado_en),
  }
}

export async function listarMediosAlternativos(periodo?: Periodo): Promise<FormatoNMediosAlternativos[]> {
  let sql = `SELECT * FROM formato_n_medios_alternativos`
  const params: unknown[] = []
  if (periodo) {
    sql += ` WHERE periodo = $1`
    params.push(periodo)
  }
  sql += ` ORDER BY fecha DESC LIMIT 100`
  const r = await query<Record<string, unknown>>(sql, params)
  return r.rows.map(rowTo)
}

export async function obtenerMediosAlternativos(id: string): Promise<FormatoNMediosAlternativos | null> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_medios_alternativos WHERE id = $1`, [id])
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export async function obtenerMediosAlternativosPorFechaPeriodo(fecha: string, periodo: Periodo): Promise<FormatoNMediosAlternativos | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM formato_n_medios_alternativos WHERE fecha = $1 AND periodo = $2 LIMIT 1`,
    [fecha, periodo],
  )
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export interface FormatoNMediosAlternativosInput {
  fecha: string
  periodo: Periodo
  capturado_por: string
  asuntos_canalizados_por_fiscalia?: number
  acuerdos?: number
  monto_reparacion_danos?: number
}

export async function crearMediosAlternativos(data: FormatoNMediosAlternativosInput): Promise<string> {
  const r = await query<{ id: string }>(
    `INSERT INTO formato_n_medios_alternativos (fecha, periodo, capturado_por, asuntos_canalizados_por_fiscalia, acuerdos, monto_reparacion_danos)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [data.fecha, data.periodo, data.capturado_por, data.asuntos_canalizados_por_fiscalia ?? 0, data.acuerdos ?? 0, data.monto_reparacion_danos ?? 0],
  )
  return r.rows[0].id
}

export async function actualizarMediosAlternativos(id: string, data: Partial<Omit<FormatoNMediosAlternativosInput, 'capturado_por'>>): Promise<void> {
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
  await query(`UPDATE formato_n_medios_alternativos SET ${cols.join(', ')} WHERE id = $${idx}`, params)
}
