import { query } from '@/lib/db'
import { obtenerArmas } from '@/lib/reportes-operativos/repository'

export interface ArmaFuente {
  fecha: string
  folio: string
  tipo_arma: string
  observaciones: string | null
}

// Jala armas de fuego ya capturadas en reportes de campo (ofi_reportes_campo / incidente_reporte_campo)
// El jsonb armas_fuego trae { datos, cartuchos, observaciones, ... } por cada arma.
export async function obtenerArmasParaFormatoN(fecha: string): Promise<ArmaFuente[]> {
  const rows = await obtenerArmas(fecha, fecha)
  const resultado: ArmaFuente[] = []
  for (const r of rows) {
    const folio = String(r.folio ?? '')
    const armasRaw = (r.armas as unknown) ?? []
    const arr = Array.isArray(armasRaw) ? (armasRaw as unknown[]) : []
    for (const a of arr) {
      const obj = a as Record<string, unknown>
      const datos = obj.datos != null ? String(obj.datos) : ''
      const cartuchos = obj.cartuchos != null ? String(obj.cartuchos) : ''
      const observaciones = obj.observaciones != null ? String(obj.observaciones) : ''
      const descripcion = [datos, cartuchos].filter(Boolean).join(' — ') || 'Arma de fuego'
      resultado.push({
        fecha,
        folio,
        tipo_arma: descripcion,
        observaciones: observaciones || (folio ? `Folio: ${folio}` : null),
      })
    }
  }
  return resultado
}

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

export async function obtenerArmasAseguradasPorFecha(fecha: string): Promise<FormatoNArmaAsegurada[]> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_armas_aseguradas WHERE fecha = $1 ORDER BY creado_en ASC`, [fecha])
  return r.rows.map(rowTo)
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
