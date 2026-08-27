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
  origen_fiscalia_arma_id: string | null
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
    origen_fiscalia_arma_id: r.origen_fiscalia_arma_id != null ? String(r.origen_fiscalia_arma_id) : null,
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

export interface FuenteArma {
  id: string
  fecha: string
  tipo_arma: string
  marca: string | null
  matricula: string | null
  calibre: string | null
  observaciones: string | null
  carpeta_investigacion: string | null
}

export async function buscarArmasFiscaliaPorRango(fechaInicio: string, fechaFin: string): Promise<FuenteArma[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT a.id, i.fecha_hora_inicio::date AS fecha,
            a.tipo_arma, a.marca, a.matricula, a.calibre, a.observaciones,
            d.num_carpeta_investigacion AS carpeta_investigacion
     FROM fiscalia_armas_aseguradas a
     JOIN ofi_reportes_campo rc ON rc.id = a.reporte_campo_id
     JOIN incidentes i ON i.id = rc.incidente_id
     LEFT JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = rc.id
     WHERE i.fecha_hora_inicio::date BETWEEN $1 AND $2
     ORDER BY i.fecha_hora_inicio DESC`,
    [fechaInicio, fechaFin],
  )
  return r.rows.map(row => ({
    id: String(row.id),
    fecha: String(row.fecha).slice(0, 10),
    tipo_arma: String(row.tipo_arma),
    marca: row.marca != null ? String(row.marca) : null,
    matricula: row.matricula != null ? String(row.matricula) : null,
    calibre: row.calibre != null ? String(row.calibre) : null,
    observaciones: row.observaciones != null ? String(row.observaciones) : null,
    carpeta_investigacion: row.carpeta_investigacion != null ? String(row.carpeta_investigacion) : null,
  }))
}

export interface ArmaOrigenInput extends FormatoNArmaAseguradaInput {
  origen_fiscalia_arma_id: string
}

async function upsertArmaDesdeFiscalia(data: ArmaOrigenInput): Promise<void> {
  await query(
    `INSERT INTO formato_n_armas_aseguradas (fecha, carpeta_investigacion, tipo_arma, matricula, calibre, observaciones, capturado_por, origen_fiscalia_arma_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     ON CONFLICT (origen_fiscalia_arma_id) WHERE origen_fiscalia_arma_id IS NOT NULL
     DO UPDATE SET tipo_arma = EXCLUDED.tipo_arma, matricula = EXCLUDED.matricula,
       calibre = EXCLUDED.calibre, observaciones = EXCLUDED.observaciones`,
    [data.fecha, data.carpeta_investigacion ?? null, data.tipo_arma, data.matricula ?? null, data.calibre ?? null, data.observaciones ?? null, data.capturado_por, data.origen_fiscalia_arma_id],
  )
}

export async function eliminarDuplicadosArmasDelDia(fecha: string): Promise<void> {
  // Huérfanos previos al upsert por origen_fiscalia_arma_id: debe correr ANTES
  // del match por campos exactos, o ese match puede quedarse con el huérfano
  // en vez del enlazado (bug real, ver boveda/🗺 Roadmap/Troubleshooting.md).
  await query(`
    DELETE FROM formato_n_armas_aseguradas a
    USING formato_n_armas_aseguradas b
    WHERE a.fecha = $1
      AND b.fecha = $1
      AND a.origen_fiscalia_arma_id IS NULL
      AND b.origen_fiscalia_arma_id IS NOT NULL
      AND a.tipo_arma = b.tipo_arma
      AND COALESCE(a.matricula, '') = COALESCE(b.matricula, '')
  `, [fecha])
  await query(`
    DELETE FROM formato_n_armas_aseguradas a
    USING formato_n_armas_aseguradas b
    WHERE a.fecha = $1
      AND b.fecha = $1
      AND a.tipo_arma = b.tipo_arma
      AND COALESCE(a.matricula, '') = COALESCE(b.matricula, '')
      AND COALESCE(a.calibre, '') = COALESCE(b.calibre, '')
      AND (b.creado_en < a.creado_en OR (b.creado_en = a.creado_en AND b.id::text < a.id::text))
  `, [fecha])
}

export async function sincronizarArmasDelDia(fecha: string, capturadoPor: string): Promise<FormatoNArmaAsegurada[]> {
  const armas = await buscarArmasFiscaliaPorRango(fecha, fecha)
  await eliminarDuplicadosArmasDelDia(fecha)
  for (const a of armas) {
    await upsertArmaDesdeFiscalia({
      fecha,
      carpeta_investigacion: a.carpeta_investigacion,
      tipo_arma: a.tipo_arma,
      matricula: a.matricula,
      calibre: a.calibre,
      observaciones: a.observaciones,
      capturado_por: capturadoPor,
      origen_fiscalia_arma_id: a.id,
    })
  }
  return obtenerArmasAseguradasPorFecha(fecha)
}
