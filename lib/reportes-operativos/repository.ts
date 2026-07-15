import { query } from '@/lib/db'
import type {
  VehiculoRow, CateoRow, DetencionResult,
  OrdenAprehensionRow, HidrocarburoRow, ArmaRow, DrogaRow,
  ExtorsionRow,
} from './types'
import {
  rowToVehiculo, rowToCateo, rowToDetencionOfi, rowToDetencionInc,
  rowToOrdenAprehension, rowToHidrocarburo, rowToArma, rowToDroga,
  rowToExtorsion,
} from './mapper'

export async function obtenerVehiculos(desde: string, hasta: string): Promise<VehiculoRow[]> {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      ofi_reportes_campo.created_at::date       AS fecha,
      ofi_folio_cad          AS folio,
      CONCAT(u.name, ' ', u.apellido) AS seguimiento,
      jsonb_array_elements(ofi_vehiculos) AS vehiculo
    FROM ofi_reportes_campo
    LEFT JOIN ofi_oficiales o ON o.id = ofi_reportes_campo.ofi_oficial_id
    LEFT JOIN users u ON u.id = o.user_id
    WHERE ofi_hay_vehiculo = true
      AND jsonb_array_length(ofi_vehiculos) > 0
      AND ofi_reportes_campo.created_at::date BETWEEN $1 AND $2
  `, [desde, hasta])

  const inc = await query<Record<string, unknown>>(`
    SELECT
      rc.creado_en::date     AS fecha,
      i.folio                AS folio,
      rc.policia_a_cargo     AS seguimiento,
      jsonb_array_elements(rc.vehiculos) AS vehiculo
    FROM incidente_reporte_campo rc
    JOIN incidentes i ON i.id = rc.incidente_id
    WHERE rc.hay_vehiculo = true
      AND jsonb_array_length(rc.vehiculos) > 0
      AND rc.creado_en::date BETWEEN $1 AND $2
  `, [desde, hasta])

  return [...ofi.rows.map(rowToVehiculo), ...inc.rows.map(rowToVehiculo)]
}

export async function obtenerCateos(desde: string, hasta: string): Promise<CateoRow[]> {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      ofi_reportes_campo.created_at::date                          AS fecha,
      ofi_folio_cad                             AS folio,
      (ofi_cateo->>'calle')                     AS ubicacion,
      'SSPM'                                    AS dependencia,
      CONCAT(u.name, ' ', u.apellido) AS seguimiento
    FROM ofi_reportes_campo
    LEFT JOIN ofi_oficiales o ON o.id = ofi_reportes_campo.ofi_oficial_id
    LEFT JOIN users u ON u.id = o.user_id
    WHERE ofi_hay_cateo = true
      AND ofi_reportes_campo.created_at::date BETWEEN $1 AND $2
  `, [desde, hasta])

  const inc = await query<Record<string, unknown>>(`
    SELECT
      rc.creado_en::date  AS fecha,
      i.folio             AS folio,
      rc.cateo_calle      AS ubicacion,
      'SSPM'              AS dependencia,
      rc.policia_a_cargo  AS seguimiento
    FROM incidente_reporte_campo rc
    JOIN incidentes i ON i.id = rc.incidente_id
    WHERE rc.hay_cateo = true
      AND rc.creado_en::date BETWEEN $1 AND $2
  `, [desde, hasta])

  return [...ofi.rows.map(rowToCateo), ...inc.rows.map(rowToCateo)]
}

export async function obtenerDetenidos(desde: string, hasta: string): Promise<DetencionResult> {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      ofi_reportes_campo.created_at::date      AS fecha,
      ofi_folio_cad         AS folio,
      ofi_detenidos         AS detenidos,
      ofi_autoridad_recibe  AS fiscalia,
      CONCAT(u.name, ' ', u.apellido) AS seguimiento
    FROM ofi_reportes_campo
    LEFT JOIN ofi_oficiales o ON o.id = ofi_reportes_campo.ofi_oficial_id
    LEFT JOIN users u ON u.id = o.user_id
    WHERE ofi_hay_detencion = true
      AND ofi_reportes_campo.created_at::date BETWEEN $1 AND $2
  `, [desde, hasta])

  const inc = await query<Record<string, unknown>>(`
    SELECT
      rc.creado_en::date   AS fecha,
      i.folio              AS folio,
      rc.nombre_detenidos  AS nombre,
      rc.autoridad_recibe  AS fiscalia,
      rc.policia_a_cargo   AS seguimiento
    FROM incidente_reporte_campo rc
    JOIN incidentes i ON i.id = rc.incidente_id
    WHERE rc.hay_detencion = true
      AND rc.creado_en::date BETWEEN $1 AND $2
  `, [desde, hasta])

  return {
    ofi: ofi.rows.map(rowToDetencionOfi),
    inc: inc.rows.map(rowToDetencionInc),
  }
}

export async function obtenerOrdenesAprehension(desde: string, hasta: string): Promise<OrdenAprehensionRow[]> {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      ofi_reportes_campo.created_at::date         AS fecha,
      ofi_folio_cad            AS folio,
      ofi_ordenes_aprehension  AS ordenes,
      CONCAT(u.name, ' ', u.apellido) AS seguimiento_reporte
    FROM ofi_reportes_campo
    LEFT JOIN ofi_oficiales o ON o.id = ofi_reportes_campo.ofi_oficial_id
    LEFT JOIN users u ON u.id = o.user_id
    WHERE ofi_hay_orden_aprehension = true
      AND ofi_reportes_campo.created_at::date BETWEEN $1 AND $2
  `, [desde, hasta])

  const inc = await query<Record<string, unknown>>(`
    SELECT
      rc.creado_en::date       AS fecha,
      i.folio                  AS folio,
      rc.ordenes_aprehension   AS ordenes,
      rc.policia_a_cargo       AS seguimiento_reporte
    FROM incidente_reporte_campo rc
    JOIN incidentes i ON i.id = rc.incidente_id
    WHERE rc.hay_orden_aprehension = true
      AND rc.creado_en::date BETWEEN $1 AND $2
  `, [desde, hasta])

  return [...ofi.rows.map(rowToOrdenAprehension), ...inc.rows.map(rowToOrdenAprehension)]
}

export async function obtenerHidrocarburos(desde: string, hasta: string): Promise<HidrocarburoRow[]> {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      ofi_reportes_campo.created_at::date   AS fecha,
      ofi_folio_cad      AS folio,
      ofi_hidrocarburos  AS hidrocarburos,
      CONCAT(u.name, ' ', u.apellido) AS seguimiento_reporte
    FROM ofi_reportes_campo
    LEFT JOIN ofi_oficiales o ON o.id = ofi_reportes_campo.ofi_oficial_id
    LEFT JOIN users u ON u.id = o.user_id
    WHERE ofi_hay_hidrocarburo = true
      AND ofi_reportes_campo.created_at::date BETWEEN $1 AND $2
  `, [desde, hasta])

  const inc = await query<Record<string, unknown>>(`
    SELECT
      rc.creado_en::date  AS fecha,
      i.folio             AS folio,
      rc.hidrocarburos    AS hidrocarburos,
      rc.policia_a_cargo  AS seguimiento_reporte
    FROM incidente_reporte_campo rc
    JOIN incidentes i ON i.id = rc.incidente_id
    WHERE rc.hay_hidrocarburo = true
      AND rc.creado_en::date BETWEEN $1 AND $2
  `, [desde, hasta])

  return [...ofi.rows.map(rowToHidrocarburo), ...inc.rows.map(rowToHidrocarburo)]
}

export async function obtenerArmas(desde: string, hasta: string): Promise<ArmaRow[]> {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      ofi_reportes_campo.created_at::date   AS fecha,
      ofi_folio_cad      AS folio,
      ofi_armas_fuego    AS armas,
      CONCAT(u.name, ' ', u.apellido) AS seguimiento_reporte
    FROM ofi_reportes_campo
    LEFT JOIN ofi_oficiales o ON o.id = ofi_reportes_campo.ofi_oficial_id
    LEFT JOIN users u ON u.id = o.user_id
    WHERE ofi_hay_arma_fuego = true
      AND ofi_reportes_campo.created_at::date BETWEEN $1 AND $2
  `, [desde, hasta])

  const inc = await query<Record<string, unknown>>(`
    SELECT
      rc.creado_en::date  AS fecha,
      i.folio             AS folio,
      rc.armas_fuego      AS armas,
      rc.policia_a_cargo  AS seguimiento_reporte
    FROM incidente_reporte_campo rc
    JOIN incidentes i ON i.id = rc.incidente_id
    WHERE rc.hay_arma_fuego = true
      AND rc.creado_en::date BETWEEN $1 AND $2
  `, [desde, hasta])

  return [...ofi.rows.map(rowToArma), ...inc.rows.map(rowToArma)]
}

export async function obtenerDrogas(desde: string, hasta: string): Promise<DrogaRow[]> {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      ofi_reportes_campo.created_at::date   AS fecha,
      ofi_folio_cad      AS folio,
      ofi_drogas         AS drogas,
      CONCAT(u.name, ' ', u.apellido) AS seguimiento_reporte
    FROM ofi_reportes_campo
    LEFT JOIN ofi_oficiales o ON o.id = ofi_reportes_campo.ofi_oficial_id
    LEFT JOIN users u ON u.id = o.user_id
    WHERE ofi_hay_droga = true
      AND ofi_reportes_campo.created_at::date BETWEEN $1 AND $2
  `, [desde, hasta])

  const inc = await query<Record<string, unknown>>(`
    SELECT
      rc.creado_en::date  AS fecha,
      i.folio             AS folio,
      rc.drogas           AS drogas,
      rc.policia_a_cargo  AS seguimiento_reporte
    FROM incidente_reporte_campo rc
    JOIN incidentes i ON i.id = rc.incidente_id
    WHERE rc.hay_droga = true
      AND rc.creado_en::date BETWEEN $1 AND $2
  `, [desde, hasta])

  return [...ofi.rows.map(rowToDroga), ...inc.rows.map(rowToDroga)]
}

export async function obtenerExtorsiones(desde: string, hasta: string): Promise<ExtorsionRow[]> {
  const result = await query<Record<string, unknown>>(`
    SELECT
      i.folio                AS folio,
      e.telefono_extorsion   AS telefono,
      e.creado_en::date      AS fecha,
      e.modus_operandi       AS incidencia
    FROM incidente_extorsion e
    JOIN incidentes i ON i.id = e.incidente_id
    WHERE e.creado_en::date BETWEEN $1 AND $2
    ORDER BY e.creado_en DESC
  `, [desde, hasta])
  return result.rows.map(rowToExtorsion)
}
