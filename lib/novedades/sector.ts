import { query } from '@/lib/db'

/**
 * Resolución del sector de un hecho (Etapa 0.3).
 *
 * sectorDeHecho(hecho) =
 *     sector del oficial que lo atendió        (ofi_oficiales.sector_id)
 *   ?? sector inferido por colonia del hecho    (fallback — sin catálogo, ver abajo)
 *   ?? null  → "sin asignar" (se distribuye a mano en el stepper, nunca solo)
 *
 * La columna CENTRO es el tercer sector del catálogo `cat_sectores` (decisión
 * del usuario, 2026-08-10); las tablas T0, T2 y T7 del documento imprimen
 * ORIENTE | PONIENTE | CENTRO | TOTALES.
 *
 * NOTA sobre el fallback por colonia: se revisó el esquema completo
 * (2026-08-10) y NO existe catálogo que mapee colonia → sector. El único dato
 * parecido es `ofi_reporte_denuncia.sector` (texto libre con valores tipo
 * "SECTOR 1", "Poniente") y `iph_detenidos.sector_hecho/sector_arresto`, sin FK
 * ni normalización. Por eso el fallback queda como hook documentado que hoy
 * devuelve null: si Administración da de alta un catálogo de colonias con
 * sector, se conecta aquí en un solo lugar.
 */

export type TablaHecho =
  | 'ofi_reportes_campo'
  | 'ofi_reporte_denuncia'
  | 'iph_detenidos'
  | 'via.v2_infracciones'
  | 'incidentes'

export interface SectorCatalogo {
  id: number
  clave: string
  nombre: string
}

/** Catálogo de sectores activos, para generar las columnas del documento. */
export async function obtenerSectoresActivos(): Promise<SectorCatalogo[]> {
  const r = await query<Record<string, unknown>>(
    `SELECT id, clave, nombre FROM cat_sectores WHERE activo = true ORDER BY nombre`,
  )
  return r.rows.map(row => ({
    id: Number(row.id),
    clave: String(row.clave ?? ''),
    nombre: String(row.nombre ?? ''),
  }))
}

/** Nombre de un sector por su id (para imprimir). */
export async function nombreSector(sectorId: number | null): Promise<string | null> {
  if (sectorId == null) return null
  const r = await query<{ nombre: string }>(
    `SELECT nombre FROM cat_sectores WHERE id = $1 LIMIT 1`,
    [sectorId],
  )
  return r.rows[0]?.nombre ?? null
}

/** Sector del oficial por su id (`ofi_oficiales.sector_id`). */
export async function sectorDeOficial(oficialId: string | null): Promise<number | null> {
  if (!oficialId) return null
  const r = await query<{ sector_id: number | null }>(
    `SELECT sector_id FROM ofi_oficiales WHERE id = $1 LIMIT 1`,
    [oficialId],
  )
  return r.rows[0]?.sector_id ?? null
}

/** Sector del oficial resuelto por número de nómina (para `iph_detenidos`). */
export async function sectorDeNomina(noNomina: string | null): Promise<number | null> {
  if (!noNomina || !noNomina.trim()) return null
  const r = await query<{ sector_id: number | null }>(
    `SELECT sector_id FROM ofi_oficiales WHERE no_nomina = $1 LIMIT 1`,
    [noNomina.trim()],
  )
  return r.rows[0]?.sector_id ?? null
}

/**
 * Sector de un hecho según su tabla de origen.
 * Resuelve primero por el oficial que lo atendió; si no hay oficial asignado
 * o no tiene sector, devuelve null ("sin asignar").
 */
export async function sectorDeHecho(tabla: TablaHecho, id: string): Promise<number | null> {
  const map: Record<TablaHecho, string> = {
    ofi_reportes_campo: `
      SELECT o.sector_id
      FROM ofi_reportes_campo rc
      JOIN ofi_oficiales o ON o.id = rc.ofi_oficial_id
      WHERE rc.id = $1 LIMIT 1`,
    ofi_reporte_denuncia: `
      SELECT o.sector_id
      FROM ofi_reporte_denuncia d
      JOIN ofi_oficiales o ON o.id = d.oficial_id
      WHERE d.id = $1 LIMIT 1`,
    iph_detenidos: `
      SELECT o.sector_id
      FROM iph_detenidos ipd
      JOIN ofi_oficiales o ON o.no_nomina = ipd.agente_aprehensor
      WHERE ipd.id = $1 LIMIT 1`,
    'via.v2_infracciones': `
      SELECT o.sector_id
      FROM via.v2_infracciones i
      JOIN ofi_oficiales o ON o.id = i.oficial_id
      WHERE i.id = $1 LIMIT 1`,
    incidentes: `
      SELECT o.sector_id
      FROM incidentes inc
      JOIN incidente_despacho des ON des.incidente_id = inc.id
      JOIN incidente_despacho_elementos ele ON ele.despacho_id = des.id
      JOIN ofi_oficiales o ON o.id = ele.oficial_id
      WHERE inc.id = $1 LIMIT 1`,
  }

  const r = await query<{ sector_id: number | null }>(map[tabla], [id])
  return r.rows[0]?.sector_id ?? null
}
