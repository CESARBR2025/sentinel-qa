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
  origen_incidente_id: string | null
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
    origen_incidente_id: r.origen_incidente_id != null ? String(r.origen_incidente_id) : null,
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

export async function obtenerEventosPorFecha(fecha: string): Promise<FormatoNEvento[]> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_eventos WHERE fecha = $1 ORDER BY hora ASC`, [fecha])
  return r.rows.map(rowTo)
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

export interface FormatoNEventoOrigenInput extends FormatoNEventoInput {
  origen_incidente_id: string
}

async function upsertEventoDesdeIncidente(data: FormatoNEventoOrigenInput): Promise<void> {
  await query(
    `INSERT INTO formato_n_eventos (fecha, hora, region, evento, ubicacion, descripcion, atenciones, capturado_por, origen_incidente_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     ON CONFLICT (origen_incidente_id) WHERE origen_incidente_id IS NOT NULL
     DO UPDATE SET hora = EXCLUDED.hora, region = EXCLUDED.region, evento = EXCLUDED.evento,
       ubicacion = EXCLUDED.ubicacion, descripcion = EXCLUDED.descripcion`,
    [data.fecha, data.hora, data.region, data.evento, data.ubicacion ?? null, data.descripcion ?? null, data.atenciones ?? null, data.capturado_por, data.origen_incidente_id],
  )
}

export interface FuenteIncidente {
  id: string
  fecha: string
  hora: string
  evento: string
  ubicacion: string | null
  descripcion: string | null
}

export async function buscarIncidentesPorRango(fechaInicio: string, fechaFin: string): Promise<FuenteIncidente[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT i.id,
            i.fecha_hora_inicio::date AS fecha,
            TO_CHAR(i.fecha_hora_inicio, 'HH24:MI') AS hora,
            i.descripcion, i.calle, i.colonia, i.entre_calles,
            COALESCE(ti.nombre, 'Sin clasificar') as tipo_incidente
     FROM incidentes i
     LEFT JOIN cat_tipos_incidente ti ON i.tipo_incidente_id = ti.id
     WHERE i.fecha_hora_inicio::date BETWEEN $1 AND $2
     ORDER BY i.fecha_hora_inicio DESC`,
    [fechaInicio, fechaFin],
  )
  return r.rows.map(row => {
    const ubicacionPartes = [row.calle, row.colonia, row.entre_calles].filter(Boolean)
    return {
      id: String(row.id),
      fecha: String(row.fecha).slice(0, 10),
      hora: String(row.hora).slice(0, 5),
      evento: String(row.tipo_incidente),
      ubicacion: ubicacionPartes.length ? ubicacionPartes.join(', ') : null,
      descripcion: row.descripcion != null ? String(row.descripcion) : null,
    }
  })
}

export async function eliminarDuplicadosEventosDelDia(fecha: string): Promise<void> {
  // Huérfanos previos al upsert por origen_incidente_id (mismo hora+evento+ubicación, ya
  // reemplazados por una fila enlazada a la fuente real): se quedaron duplicados porque
  // nunca calzaron con el ON CONFLICT al no tener el enlace. Limpieza autocurativa en cada
  // sync — debe correr ANTES del match por campos exactos, o ese match (que no distingue
  // huérfano de enlazado, solo el más reciente) puede quedarse con el huérfano.
  await query(`
    DELETE FROM formato_n_eventos a
    USING formato_n_eventos b
    WHERE a.fecha = $1
      AND b.fecha = $1
      AND a.origen_incidente_id IS NULL
      AND b.origen_incidente_id IS NOT NULL
      AND a.hora = b.hora
      AND a.evento = b.evento
      AND COALESCE(a.ubicacion, '') = COALESCE(b.ubicacion, '')
  `, [fecha])
  await query(`
    DELETE FROM formato_n_eventos a
    USING formato_n_eventos b
    WHERE a.fecha = $1
      AND b.fecha = $1
      AND a.hora = b.hora
      AND a.evento = b.evento
      AND COALESCE(a.ubicacion, '') = COALESCE(b.ubicacion, '')
      AND COALESCE(a.descripcion, '') = COALESCE(b.descripcion, '')
      AND (b.creado_en < a.creado_en OR (b.creado_en = a.creado_en AND b.id::text < a.id::text))
  `, [fecha])
}

export async function sincronizarEventosDelDia(fecha: string, capturadoPor: string): Promise<FormatoNEvento[]> {
  const incidentes = await buscarIncidentesPorRango(fecha, fecha)
  // Limpia duplicados exactos heredados de sincronizaciones previas a origen_incidente_id (sin fuente enlazada).
  await eliminarDuplicadosEventosDelDia(fecha)
  for (const inc of incidentes) {
    await upsertEventoDesdeIncidente({
      fecha,
      hora: inc.hora,
      region: 'San Juan del Río',
      evento: inc.evento,
      ubicacion: inc.ubicacion,
      descripcion: inc.descripcion,
      capturado_por: capturadoPor,
      origen_incidente_id: inc.id,
    })
  }
  return obtenerEventosPorFecha(fecha)
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
