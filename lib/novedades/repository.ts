import pool, { query } from '@/lib/db'
import type { FilaNovedad } from './types'

// Repositorio del Parte de Novedades. SOLO toca las 3 tablas de persistencia
// (novedades_seccion, novedades_filas, novedades_estatus_dia). Las tablas de
// origen se consultan desde los servicios de cálculo (etapas 4-6), no aquí.

export async function obtenerSeccion(
  fecha: string,
  seccion: string,
): Promise<Record<string, unknown> | null> {
  const r = await query<{ datos: Record<string, unknown> }>(
    `SELECT datos FROM novedades_seccion WHERE fecha = $1 AND seccion = $2 LIMIT 1`,
    [fecha, seccion],
  )
  return r.rows[0]?.datos ?? null
}

export async function upsertSeccion(
  fecha: string,
  seccion: string,
  datos: Record<string, unknown>,
  userId: string,
): Promise<void> {
  await query(
    `INSERT INTO novedades_seccion (fecha, seccion, datos, capturado_por, actualizado_en)
     VALUES ($1, $2, $3::jsonb, $4, now())
     ON CONFLICT (fecha, seccion) DO UPDATE SET
       datos = EXCLUDED.datos,
       capturado_por = EXCLUDED.capturado_por,
       actualizado_en = now()`,
    [fecha, seccion, JSON.stringify(datos), userId],
  )
}

export async function obtenerFilas(fecha: string, seccion: string): Promise<FilaNovedad[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, fecha, seccion, orden, datos
     FROM novedades_filas
     WHERE fecha = $1 AND seccion = $2
     ORDER BY orden ASC, creado_en ASC`,
    [fecha, seccion],
  )
  return r.rows.map(rowToFilaNovedad)
}

/** Filas de una sección incluyendo sus listados con clave sufijada (ej. transito.hechos, prevencion.convenios). */
export async function obtenerFilasDeSeccion(fecha: string, seccion: string): Promise<FilaNovedad[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, fecha, seccion, orden, datos
     FROM novedades_filas
     WHERE fecha = $1 AND (seccion = $2 OR seccion LIKE $3)
     ORDER BY seccion ASC, orden ASC, creado_en ASC`,
    [fecha, seccion, `${seccion}.%`],
  )
  return r.rows.map(rowToFilaNovedad)
}

export async function reemplazarFilas(
  fecha: string,
  seccion: string,
  filas: { datos: Record<string, unknown> }[],
  userId: string,
): Promise<void> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(`DELETE FROM novedades_filas WHERE fecha = $1 AND seccion = $2`, [fecha, seccion])
    for (let i = 0; i < filas.length; i++) {
      await client.query(
        `INSERT INTO novedades_filas (fecha, seccion, orden, datos, capturado_por)
         VALUES ($1, $2, $3, $4::jsonb, $5)`,
        [fecha, seccion, i, JSON.stringify(filas[i].datos ?? {}), userId],
      )
    }
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {})
    throw e
  } finally {
    client.release()
  }
}

export async function agregarFila(
  fecha: string,
  seccion: string,
  datos: Record<string, unknown>,
  userId: string,
): Promise<FilaNovedad> {
  const r = await query<{ id: string }>(
    `INSERT INTO novedades_filas (fecha, seccion, orden, datos, capturado_por)
     VALUES ($1, $2, COALESCE((SELECT MAX(orden) + 1 FROM novedades_filas WHERE fecha = $1 AND seccion = $2), 0), $3::jsonb, $4)
     RETURNING id`,
    [fecha, seccion, JSON.stringify(datos), userId],
  )
  const id = r.rows[0].id
  const fila = await obtenerFilaPorId(id)
  if (!fila) throw new Error('No se pudo leer la fila recién creada')
  return fila
}

export async function eliminarFila(id: string): Promise<void> {
  await query(`DELETE FROM novedades_filas WHERE id = $1`, [id])
}

export async function obtenerFilaPorId(id: string): Promise<FilaNovedad | null> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, fecha, seccion, orden, datos
     FROM novedades_filas WHERE id = $1 LIMIT 1`,
    [id],
  )
  return r.rows.length ? rowToFilaNovedad(r.rows[0]) : null
}

function rowToFilaNovedad(row: Record<string, unknown>): FilaNovedad {
  return {
    id: String(row.id),
    fecha: String(row.fecha).slice(0, 10),
    seccion: String(row.seccion),
    orden: Number(row.orden ?? 0),
    datos: (row.datos as Record<string, unknown>) ?? {},
  }
}
