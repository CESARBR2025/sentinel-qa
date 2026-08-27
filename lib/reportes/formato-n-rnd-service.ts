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
  origen_reporte_campo_id: string | null
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
    origen_reporte_campo_id: r.origen_reporte_campo_id != null ? String(r.origen_reporte_campo_id) : null,
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

export async function obtenerRndPorFecha(fecha: string): Promise<FormatoNRnd[]> {
  const r = await query<Record<string, unknown>>(`SELECT * FROM formato_n_rnd WHERE fecha = $1 ORDER BY hora_detencion ASC`, [fecha])
  return r.rows.map(rowTo)
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

export interface FormatoNRndOrigenInput extends FormatoNRndInput {
  origen_reporte_campo_id: string
}

async function upsertRndDesdeReporteCampo(data: FormatoNRndOrigenInput): Promise<void> {
  await query(
    `INSERT INTO formato_n_rnd (fecha, hora_detencion, delito, autoridad_que_realizo_detencion, folio, capturado_por, origen_reporte_campo_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (origen_reporte_campo_id) WHERE origen_reporte_campo_id IS NOT NULL
     DO UPDATE SET hora_detencion = EXCLUDED.hora_detencion, delito = EXCLUDED.delito,
       autoridad_que_realizo_detencion = EXCLUDED.autoridad_que_realizo_detencion, folio = EXCLUDED.folio`,
    [data.fecha, data.hora_detencion, data.delito, data.autoridad_que_realizo_detencion, data.folio, data.capturado_por, data.origen_reporte_campo_id],
  )
}

export interface FuenteDetencion {
  id: string
  fecha: string
  hora_detencion: string
  delito: string
  autoridad_que_realizo_detencion: string
  folio: string
}

export async function buscarDetencionesPorRango(fechaInicio: string, fechaFin: string): Promise<FuenteDetencion[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT rc.id, i.fecha_hora_inicio::date AS fecha, TO_CHAR(i.fecha_hora_inicio, 'HH24:MI') AS hora_detencion,
            COALESCE(NULLIF(d.delito, ''), NULLIF(rc.delito, ''), ti.nombre, 'Sin clasificar') AS delito_falta,
            TRIM(CONCAT(u.name, ' ', COALESCE(u.apellido, ''))) AS policia_a_cargo, i.folio
     FROM ofi_reportes_campo rc
     INNER JOIN incidentes i ON i.id = rc.incidente_id
     LEFT JOIN ofi_oficiales o ON o.id = rc.ofi_oficial_id
     LEFT JOIN users u ON u.id = o.user_id
     LEFT JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = rc.id
     LEFT JOIN cat_tipos_incidente ti ON i.tipo_incidente_id = ti.id
     WHERE rc.ofi_hay_detencion = true AND i.fecha_hora_inicio::date BETWEEN $1 AND $2
     ORDER BY i.fecha_hora_inicio DESC`,
    [fechaInicio, fechaFin],
  )
  return r.rows.map(row => {
    return {
      id: String(row.id),
      fecha: String(row.fecha).slice(0, 10),
      hora_detencion: String(row.hora_detencion).slice(0, 5),
      delito: row.delito_falta != null ? String(row.delito_falta) : '',
      autoridad_que_realizo_detencion: row.policia_a_cargo != null ? String(row.policia_a_cargo) : '',
      folio: row.folio != null ? String(row.folio) : '',
    }
  })
}

export async function eliminarDuplicadosRndDelDia(fecha: string): Promise<void> {
  // Huérfanos previos al upsert por origen_reporte_campo_id (mismo folio, ya reemplazados
  // por una fila enlazada a la fuente real): se quedaron duplicados porque nunca calzaron
  // con el ON CONFLICT al no tener el enlace. Limpieza autocurativa en cada sync — debe
  // correr ANTES del match por campos exactos, o ese match (que no distingue huérfano de
  // enlazado, solo el más reciente) puede quedarse con el huérfano.
  await query(`
    DELETE FROM formato_n_rnd a
    USING formato_n_rnd b
    WHERE a.fecha = $1
      AND b.fecha = $1
      AND a.origen_reporte_campo_id IS NULL
      AND b.origen_reporte_campo_id IS NOT NULL
      AND a.folio = b.folio
  `, [fecha])
  await query(`
    DELETE FROM formato_n_rnd a
    USING formato_n_rnd b
    WHERE a.fecha = $1
      AND b.fecha = $1
      AND a.hora_detencion = b.hora_detencion
      AND a.delito = b.delito
      AND COALESCE(a.autoridad_que_realizo_detencion, '') = COALESCE(b.autoridad_que_realizo_detencion, '')
      AND (b.creado_en < a.creado_en OR (b.creado_en = a.creado_en AND b.id::text < a.id::text))
  `, [fecha])
}

export async function sincronizarDetencionesDelDia(fecha: string, capturadoPor: string): Promise<FormatoNRnd[]> {
  const detenciones = await buscarDetencionesPorRango(fecha, fecha)
  // Limpia duplicados exactos heredados de sincronizaciones previas a origen_reporte_campo_id (sin fuente enlazada).
  await eliminarDuplicadosRndDelDia(fecha)
  for (const d of detenciones) {
    await upsertRndDesdeReporteCampo({
      fecha,
      hora_detencion: d.hora_detencion,
      delito: d.delito,
      autoridad_que_realizo_detencion: d.autoridad_que_realizo_detencion,
      folio: d.folio,
      capturado_por: capturadoPor,
      origen_reporte_campo_id: d.id,
    })
  }
  return obtenerRndPorFecha(fecha)
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
