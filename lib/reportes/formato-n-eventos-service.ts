import { query } from '@/lib/db'

export interface FormatoNEvento {
  id: string
  fecha: string
  hora: string
  region: string
  evento: string
  ubicacion: string | null
  descripcion: string | null
  atenciones: string | null
  capturado_por: string
  creado_en: string
}

function formatFecha(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (typeof v === 'string') return v.slice(0, 10)
  return String(v).slice(0, 10)
}

function rowTo(r: Record<string, unknown>): FormatoNEvento {
  return {
    id: String(r.id),
    fecha: formatFecha(r.fecha),
    hora: String(r.hora),
    region: String(r.region),
    evento: String(r.evento),
    ubicacion: r.ubicacion != null ? String(r.ubicacion) : null,
    descripcion: r.descripcion != null ? String(r.descripcion) : null,
    atenciones: r.atenciones != null ? String(r.atenciones) : null,
    capturado_por: String(r.capturado_por),
    creado_en: String(r.creado_en),
  }
}

export async function listarEventos(): Promise<FormatoNEvento[]> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_eventos ORDER BY fecha DESC, hora DESC LIMIT 100`)
  return r.rows.map(rowTo)
}

export async function obtenerEvento(id: string): Promise<FormatoNEvento | null> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_eventos WHERE id = $1`, [id])
  if (!r.rows.length) return null
  return rowTo(r.rows[0])
}

export interface FormatoNEventoInput {
  fecha: string
  hora: string
  region: string
  evento: string
  ubicacion?: string | null
  descripcion?: string | null
  atenciones?: string | null
  capturado_por: string
}

export async function crearEvento(data: FormatoNEventoInput): Promise<string> {
  const r = await query<{ id: string }>(
    `INSERT INTO formato_n_eventos (fecha, hora, region, evento, ubicacion, descripcion, atenciones, capturado_por)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
    [data.fecha, data.hora, data.region, data.evento, data.ubicacion ?? null, data.descripcion ?? null, data.atenciones ?? null, data.capturado_por],
  )
  return r.rows[0].id
}

export interface FuenteIncidente {
  id: string
  hora: string
  evento: string
  ubicacion: string | null
  descripcion: string | null
}

export async function buscarIncidentesPorFecha(fecha: string): Promise<FuenteIncidente[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT i.id, i.fecha_hora_inicio, i.descripcion, i.calle, i.colonia, i.entre_calles,
            COALESCE(ti.nombre, 'Sin clasificar') as tipo_incidente
     FROM incidentes i
     LEFT JOIN cat_tipos_incidente ti ON i.tipo_incidente_id = ti.id
     WHERE i.fecha_hora_inicio::date = $1
     ORDER BY i.fecha_hora_inicio DESC`,
    [fecha],
  )
  return r.rows.map(row => {
    const fecha_hora = row.fecha_hora_inicio instanceof Date ? row.fecha_hora_inicio : new Date(String(row.fecha_hora_inicio))
    const ubicacionPartes = [row.calle, row.colonia, row.entre_calles].filter(Boolean)
    return {
      id: String(row.id),
      hora: isNaN(fecha_hora.getTime()) ? '' : fecha_hora.toISOString().slice(11, 16),
      evento: String(row.tipo_incidente),
      ubicacion: ubicacionPartes.length ? ubicacionPartes.join(', ') : null,
      descripcion: row.descripcion != null ? String(row.descripcion) : null,
    }
  })
}

export async function actualizarEvento(id: string, data: Partial<Omit<FormatoNEventoInput, 'capturado_por'>>): Promise<void> {
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
  await query(`UPDATE formato_n_eventos SET ${cols.join(', ')} WHERE id = $${idx}`, params)
}
