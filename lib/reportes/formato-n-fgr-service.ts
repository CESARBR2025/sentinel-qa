import { query } from '@/lib/db'

const PERIODOS = ['diario', 'semanal', 'mensual'] as const
export type Periodo = typeof PERIODOS[number]
export { PERIODOS }

export interface FormatoNFgr {
  id: string
  fecha: string
  periodo: Periodo
  capturado_por: string
  carpetas_iniciadas: number
  numero_cateos: number
  vehiculos_asegurados: number
  domicilios_cateados: number
  personas_aseguradas: number
  aprehensiones: number
  audiencias_iniciales: number
  abreviados: number
  audiencias_intermedias: number
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

function rowTo(r: Record<string, unknown>): FormatoNFgr {
  return {
    id: String(r.id),
    fecha: formatFecha(r.fecha),
    periodo: parsePeriodo(String(r.periodo)),
    capturado_por: String(r.capturado_por),
    carpetas_iniciadas: Number(r.carpetas_iniciadas),
    numero_cateos: Number(r.numero_cateos),
    vehiculos_asegurados: Number(r.vehiculos_asegurados),
    domicilios_cateados: Number(r.domicilios_cateados),
    personas_aseguradas: Number(r.personas_aseguradas),
    aprehensiones: Number(r.aprehensiones),
    audiencias_iniciales: Number(r.audiencias_iniciales),
    abreviados: Number(r.abreviados),
    audiencias_intermedias: Number(r.audiencias_intermedias),
    creado_en: String(r.creado_en),
  }
}

export async function listarFgr(periodo?: Periodo): Promise<FormatoNFgr[]> {
  let sql = `SELECT * FROM formato_n_fgr`
  const params: unknown[] = []
  if (periodo) {
    sql += ` WHERE periodo = $1`
    params.push(periodo)
  }
  sql += ` ORDER BY fecha DESC LIMIT 100`
  const r = await query<Record<string, unknown>>(sql, params)
  return r.rows.map(rowTo)
}

export async function obtenerFgr(id: string): Promise<FormatoNFgr | null> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_fgr WHERE id = $1`, [id])
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export async function obtenerFgrPorFechaPeriodo(fecha: string, periodo: Periodo): Promise<FormatoNFgr | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM formato_n_fgr WHERE fecha = $1 AND periodo = $2 LIMIT 1`,
    [fecha, periodo],
  )
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export interface FormatoNFgrInput {
  fecha: string
  periodo: Periodo
  capturado_por: string
  carpetas_iniciadas?: number
  numero_cateos?: number
  vehiculos_asegurados?: number
  domicilios_cateados?: number
  personas_aseguradas?: number
  aprehensiones?: number
  audiencias_iniciales?: number
  abreviados?: number
  audiencias_intermedias?: number
}

export async function crearFgr(data: FormatoNFgrInput): Promise<string> {
  const r = await query<{ id: string }>(
    `INSERT INTO formato_n_fgr (fecha, periodo, capturado_por, carpetas_iniciadas, numero_cateos, vehiculos_asegurados, domicilios_cateados, personas_aseguradas, aprehensiones, audiencias_iniciales, abreviados, audiencias_intermedias)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
    [
      data.fecha, data.periodo, data.capturado_por,
      data.carpetas_iniciadas ?? 0, data.numero_cateos ?? 0, data.vehiculos_asegurados ?? 0,
      data.domicilios_cateados ?? 0, data.personas_aseguradas ?? 0, data.aprehensiones ?? 0,
      data.audiencias_iniciales ?? 0, data.abreviados ?? 0, data.audiencias_intermedias ?? 0,
    ],
  )
  return r.rows[0].id
}

export async function actualizarFgr(id: string, data: Partial<Omit<FormatoNFgrInput, 'capturado_por'>>): Promise<void> {
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
  await query(`UPDATE formato_n_fgr SET ${cols.join(', ')} WHERE id = $${idx}`, params)
}
