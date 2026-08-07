import { query } from '@/lib/db'
import type {
  VehiculoRow, CateoRow, DetencionResult,
  OrdenAprehensionRow, HidrocarburoRow, ArmaRow, DrogaRow,
  ExtorsionRow, ExtorsionDetalleRow,
} from './types'
import {
  rowToVehiculo, rowToCateo, rowToDetencionOfi,
  rowToOrdenAprehension, rowToHidrocarburo, rowToArma, rowToDroga,
  rowToExtorsion, rowToExtorsionDetalle,
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

  return ofi.rows.map(rowToVehiculo)
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

  return ofi.rows.map(rowToCateo)
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

  return {
    ofi: ofi.rows.map(rowToDetencionOfi),
    inc: [],
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

  return ofi.rows.map(rowToOrdenAprehension)
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

  return ofi.rows.map(rowToHidrocarburo)
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

  return ofi.rows.map(rowToArma)
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

  return ofi.rows.map(rowToDroga)
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

// Reporte de Llamadas de Extorsión 911 (formato C4): 9 columnas oficiales.
// UNIDAD se deriva del despacho real de la incidencia (incidente_despacho_unidades,
// mismo pipeline que TablonDespacho/SeleccionarUnidadesModal) — 'C4' si nunca se
// canalizó a una patrulla. FOLIO DE REPORTE es incidentes.folio_cad (folio CAD
// capturado por el operador, no el folio interno del sistema).
export async function obtenerExtorsionesDetalle(desde: string, hasta: string): Promise<ExtorsionDetalleRow[]> {
  const result = await query<Record<string, unknown>>(`
    SELECT
      i.folio                                     AS folio,
      i.folio_cad                                  AS folio_reporte,
      e.telefono_extorsion                         AS telefono,
      i.fecha_hora_inicio::date                    AS fecha,
      TO_CHAR(i.fecha_hora_inicio, 'HH24:MI')       AS hora,
      TRIM(BOTH ', ' FROM CONCAT_WS(', ', NULLIF(i.calle, ''), NULLIF(i.colonia, ''))) AS lugar,
      e.grupo_delictivo                            AS grupo_delictivo,
      e.modus_operandi                             AS modus_operandi,
      COALESCE(
        (SELECT string_agg(du.unidad_placa, ', ')
         FROM incidente_despacho_unidades du
         JOIN incidente_despacho d ON d.id = du.despacho_id
         WHERE d.incidente_id = i.id AND du.unidad_placa IS NOT NULL AND du.unidad_placa <> ''),
        'C4'
      )                                             AS unidad,
      e.resultado                                  AS resultado
    FROM incidentes i
    JOIN incidente_extorsion e ON e.incidente_id = i.id
    WHERE i.fecha_hora_inicio::date BETWEEN $1 AND $2
    ORDER BY i.fecha_hora_inicio DESC
  `, [desde, hasta])
  return result.rows.map(rowToExtorsionDetalle)
}

export async function obtenerNumerosTelefonicos911(desde: string, hasta: string): Promise<ExtorsionRow[]> {
  const result = await query<Record<string, unknown>>(`
    SELECT
      i.folio                            AS folio,
      i.telefono_reportante              AS telefono,
      i.fecha_hora_inicio::date          AS fecha,
      COALESCE(cti.nombre, i.tipo_reporte) AS incidencia
    FROM incidentes i
    LEFT JOIN cat_tipos_incidente cti ON i.tipo_incidente_id = cti.id
    WHERE i.canal = '911'
      AND i.telefono_reportante IS NOT NULL
      AND i.telefono_reportante <> ''
      AND i.fecha_hora_inicio::date BETWEEN $1 AND $2
    ORDER BY i.fecha_hora_inicio DESC
  `, [desde, hasta])
  return result.rows.map(rowToExtorsion)
}
