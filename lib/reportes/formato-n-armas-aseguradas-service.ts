import { query } from '@/lib/db'

export interface FormatoNArmaAsegurada {
  id: string
  fecha: string
  carpeta_investigacion: string | null
  tipo_arma: string
  matricula: string | null
  calibre: string | null
  observaciones: string | null
  capturado_por: string
  creado_en: string
}

function formatFecha(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'string') return v.slice(0, 10)
  return String(v).slice(0, 10)
}

function rowTo(r: Record<string, unknown>): FormatoNArmaAsegurada {
  return {
    id: String(r.id),
    fecha: formatFecha(r.fecha),
    carpeta_investigacion: r.carpeta_investigacion != null ? String(r.carpeta_investigacion) : null,
    tipo_arma: String(r.tipo_arma),
    matricula: r.matricula != null ? String(r.matricula) : null,
    calibre: r.calibre != null ? String(r.calibre) : null,
    observaciones: r.observaciones != null ? String(r.observaciones) : null,
    capturado_por: String(r.capturado_por),
    creado_en: String(r.creado_en),
  }
}

export async function listarArmasAseguradas(): Promise<FormatoNArmaAsegurada[]> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_armas_aseguradas ORDER BY fecha DESC LIMIT 100`)
  return r.rows.map(rowTo)
}

export async function obtenerArmaAsegurada(id: string): Promise<FormatoNArmaAsegurada | null> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_armas_aseguradas WHERE id = $1`, [id])
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export interface FormatoNArmaAseguradaInput {
  fecha: string
  carpeta_investigacion?: string | null
  tipo_arma: string
  matricula?: string | null
  calibre?: string | null
  observaciones?: string | null
  capturado_por: string
}

export async function crearArmaAsegurada(data: FormatoNArmaAseguradaInput): Promise<string> {
  const r = await query<{ id: string }>(
    `INSERT INTO formato_n_armas_aseguradas (fecha, carpeta_investigacion, tipo_arma, matricula, calibre, observaciones, capturado_por)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
    [data.fecha, data.carpeta_investigacion ?? null, data.tipo_arma, data.matricula ?? null, data.calibre ?? null, data.observaciones ?? null, data.capturado_por],
  )
  return r.rows[0].id
}

export async function actualizarArmaAsegurada(id: string, data: Partial<Omit<FormatoNArmaAseguradaInput, 'capturado_por'>>): Promise<void> {
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
  await query(`UPDATE formato_n_armas_aseguradas SET ${cols.join(', ')} WHERE id = $${idx}`, params)
}
