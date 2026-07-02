import { query } from '@/lib/db'

export async function obtenerVehiculos(desde: string, hasta: string) {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      created_at::date       AS fecha,
      ofi_folio_cad          AS folio,
      ofi_oficial_nombre     AS seguimiento,
      jsonb_array_elements(ofi_vehiculos) AS vehiculo
    FROM ofi_reportes_campo
    WHERE ofi_hay_vehiculo = true
      AND jsonb_array_length(ofi_vehiculos) > 0
      AND created_at::date BETWEEN $1 AND $2
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

  return [...ofi.rows, ...inc.rows]
}

export async function obtenerCateos(desde: string, hasta: string) {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      created_at::date                          AS fecha,
      ofi_folio_cad                             AS folio,
      (ofi_cateo->>'calle')                     AS ubicacion,
      'SSPM'                                    AS dependencia,
      ofi_oficial_nombre                        AS seguimiento
    FROM ofi_reportes_campo
    WHERE ofi_hay_cateo = true
      AND created_at::date BETWEEN $1 AND $2
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

  return [...ofi.rows, ...inc.rows]
}

export async function obtenerDetenidos(desde: string, hasta: string) {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      created_at::date      AS fecha,
      ofi_folio_cad         AS folio,
      ofi_detenidos         AS detenidos,
      ofi_autoridad_recibe  AS fiscalia,
      ofi_oficial_nombre    AS seguimiento
    FROM ofi_reportes_campo
    WHERE ofi_hay_detencion = true
      AND created_at::date BETWEEN $1 AND $2
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

  return { ofi: ofi.rows, inc: inc.rows }
}

export async function obtenerOrdenesAprehension(desde: string, hasta: string) {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      created_at::date         AS fecha,
      ofi_folio_cad            AS folio,
      ofi_ordenes_aprehension  AS ordenes,
      ofi_oficial_nombre       AS seguimiento_reporte
    FROM ofi_reportes_campo
    WHERE ofi_hay_orden_aprehension = true
      AND created_at::date BETWEEN $1 AND $2
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

  return [...ofi.rows, ...inc.rows]
}

export async function obtenerHidrocarburos(desde: string, hasta: string) {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      created_at::date   AS fecha,
      ofi_folio_cad      AS folio,
      ofi_hidrocarburos  AS hidrocarburos,
      ofi_oficial_nombre AS seguimiento_reporte
    FROM ofi_reportes_campo
    WHERE ofi_hay_hidrocarburo = true
      AND created_at::date BETWEEN $1 AND $2
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

  return [...ofi.rows, ...inc.rows]
}

export async function obtenerArmas(desde: string, hasta: string) {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      created_at::date   AS fecha,
      ofi_folio_cad      AS folio,
      ofi_armas_fuego    AS armas,
      ofi_oficial_nombre AS seguimiento_reporte
    FROM ofi_reportes_campo
    WHERE ofi_hay_arma_fuego = true
      AND created_at::date BETWEEN $1 AND $2
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

  return [...ofi.rows, ...inc.rows]
}

export async function obtenerDrogas(desde: string, hasta: string) {
  const ofi = await query<Record<string, unknown>>(`
    SELECT
      created_at::date   AS fecha,
      ofi_folio_cad      AS folio,
      ofi_drogas         AS drogas,
      ofi_oficial_nombre AS seguimiento_reporte
    FROM ofi_reportes_campo
    WHERE ofi_hay_droga = true
      AND created_at::date BETWEEN $1 AND $2
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

  return [...ofi.rows, ...inc.rows]
}

export async function obtenerExtorsiones(desde: string, hasta: string) {
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
  return result.rows
}