import { query } from '@/lib/db'
import { obtenerCateos, obtenerVehiculos, obtenerDetenidos } from '@/lib/reportes-operativos/repository'

const PERIODOS = ['diario', 'semanal', 'mensual'] as const
export type Periodo = typeof PERIODOS[number]
export { PERIODOS }

export interface FormatoNFge {
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

function rowTo(r: Record<string, unknown>): FormatoNFge {
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

export async function listarFge(periodo?: Periodo): Promise<FormatoNFge[]> {
  let sql = `SELECT * FROM formato_n_fge`
  const params: unknown[] = []
  if (periodo) {
    sql += ` WHERE periodo = $1`
    params.push(periodo)
  }
  sql += ` ORDER BY fecha DESC LIMIT 100`
  const r = await query<Record<string, unknown>>(sql, params)
  return r.rows.map(rowTo)
}

export async function obtenerFge(id: string): Promise<FormatoNFge | null> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_fge WHERE id = $1`, [id])
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export async function obtenerFgePorFechaPeriodo(fecha: string, periodo: Periodo): Promise<FormatoNFge | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT * FROM formato_n_fge WHERE fecha = $1 AND periodo = $2 LIMIT 1`,
    [fecha, periodo],
  )
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export interface ConteosCalculados {
  carpetas_iniciadas: number
  numero_cateos: number
  vehiculos_asegurados: number
  domicilios_cateados: number
  personas_aseguradas: number
  aprehensiones: number
}

// Calcula lo que SÍ se puede sacar de datos ya capturados (denuncias/reportes de campo).
// audiencias_iniciales, abreviados y audiencias_intermedias no existen en ningún lado del
// sistema (son etapas de juzgado que este sistema no registra) — se quedan siempre en 0/manual.
export async function calcularConteosPorFecha(fecha: string): Promise<ConteosCalculados> {
  const [carpetas, cateos, vehiculos, detenidos] = await Promise.all([
    query<{ c: number }>(`SELECT count(*)::int as c FROM ofi_reporte_denuncia WHERE fecha_reporte = $1`, [fecha]),
    obtenerCateos(fecha, fecha),
    obtenerVehiculos(fecha, fecha),
    obtenerDetenidos(fecha, fecha),
  ])
  const totalDetenidos = detenidos.ofi.length + detenidos.inc.length
  return {
    carpetas_iniciadas: carpetas.rows[0]?.c ?? 0,
    numero_cateos: cateos.length,
    domicilios_cateados: cateos.length,
    vehiculos_asegurados: vehiculos.length,
    personas_aseguradas: totalDetenidos,
    aprehensiones: totalDetenidos,
  }
}

export interface FormatoNFgeInput {
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

export async function crearFge(data: FormatoNFgeInput): Promise<string> {
  const r = await query<{ id: string }>(
    `INSERT INTO formato_n_fge (fecha, periodo, capturado_por, carpetas_iniciadas, numero_cateos, vehiculos_asegurados, domicilios_cateados, personas_aseguradas, aprehensiones, audiencias_iniciales, abreviados, audiencias_intermedias)
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

export async function actualizarFge(id: string, data: Partial<Omit<FormatoNFgeInput, 'capturado_por'>>): Promise<void> {
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
  await query(`UPDATE formato_n_fge SET ${cols.join(', ')} WHERE id = $${idx}`, params)
}
