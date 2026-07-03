import { query } from '@/lib/db'

export interface FormatoNRnd {
  id: string
  fecha: string
  hora_detencion: string
  delito: string
  autoridad_que_realizo_detencion: string
  folio: string
  capturado_por: string
  creado_en: string
}

function formatFecha(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'string') return v.slice(0, 10)
  return String(v).slice(0, 10)
}

function rowTo(r: Record<string, unknown>): FormatoNRnd {
  return {
    id: String(r.id),
    fecha: formatFecha(r.fecha),
    hora_detencion: String(r.hora_detencion),
    delito: String(r.delito),
    autoridad_que_realizo_detencion: String(r.autoridad_que_realizo_detencion),
    folio: String(r.folio),
    capturado_por: String(r.capturado_por),
    creado_en: String(r.creado_en),
  }
}

export async function listarRnd(): Promise<FormatoNRnd[]> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_rnd ORDER BY fecha DESC, hora_detencion DESC LIMIT 100`)
  return r.rows.map(rowTo)
}

export async function obtenerRnd(id: string): Promise<FormatoNRnd | null> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_rnd WHERE id = $1`, [id])
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export interface FormatoNRndInput {
  fecha: string
  hora_detencion: string
  delito: string
  autoridad_que_realizo_detencion: string
  folio: string
  capturado_por: string
}

export async function crearRnd(data: FormatoNRndInput): Promise<string> {
  const r = await query<{ id: string }>(
    `INSERT INTO formato_n_rnd (fecha, hora_detencion, delito, autoridad_que_realizo_detencion, folio, capturado_por)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [data.fecha, data.hora_detencion, data.delito, data.autoridad_que_realizo_detencion, data.folio, data.capturado_por],
  )
  return r.rows[0].id
}

export interface FuenteDetencion {
  id: string
  hora_detencion: string
  delito: string
  autoridad_que_realizo_detencion: string
  folio: string
}

export async function buscarDetencionesPorFecha(fecha: string): Promise<FuenteDetencion[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT rc.id, i.fecha_hora_inicio, rc.delito_falta, rc.policia_a_cargo, i.folio
     FROM incidente_reporte_campo rc
     INNER JOIN incidentes i ON i.id = rc.incidente_id
     WHERE rc.hay_detencion = true AND i.fecha_hora_inicio::date = $1
     ORDER BY i.fecha_hora_inicio DESC`,
    [fecha],
  )
  return r.rows.map(row => {
    const fecha_hora = row.fecha_hora_inicio instanceof Date ? row.fecha_hora_inicio : new Date(String(row.fecha_hora_inicio))
    return {
      id: String(row.id),
      hora_detencion: isNaN(fecha_hora.getTime()) ? '' : fecha_hora.toISOString().slice(11, 16),
      delito: row.delito_falta != null ? String(row.delito_falta) : '',
      autoridad_que_realizo_detencion: row.policia_a_cargo != null ? String(row.policia_a_cargo) : '',
      folio: row.folio != null ? String(row.folio) : '',
    }
  })
}

export async function actualizarRnd(id: string, data: Partial<Omit<FormatoNRndInput, 'capturado_por'>>): Promise<void> {
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
  await query(`UPDATE formato_n_rnd SET ${cols.join(', ')} WHERE id = $${idx}`, params)
}
