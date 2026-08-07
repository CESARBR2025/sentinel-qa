import { query } from '@/lib/db'
import type {
  VehiculoRow, CateoRow, DetencionResult,
  OrdenAprehensionRow, HidrocarburoRow, ArmaRow, DrogaRow,
  ExtorsionRow, ExtorsionDetalleRow, AlarmaEscolarDetalleRow,
} from './types'
import {
  rowToVehiculo, rowToCateo, rowToDetencionOfi,
  rowToOrdenAprehension, rowToHidrocarburo, rowToArma, rowToDroga,
  rowToExtorsion, rowToExtorsionDetalle, rowToAlarmaEscolarDetalle,
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

// Reporte de Alarmas Escolares 911: incidentes de tipo alarma_escolar con el
// detalle de la tabla incidente_alarma_escolar (establecimiento, dirección,
// responsable, verificación) + los datos reales de canalización/cierre que ya
// existen en el flujo de Despacho + Reporte de Campo. Solo entran al reporte
// los casos cerrados formalmente (con reporte de campo), que es la regla de
// negocio real: una alarma escolar solo "cuenta" cuando se canalizó y el
// oficial cerró el caso (incidentes.estatus IN ('atendido','cerrado_detencion'),
// ver lib/oficial/repository.ts donde se fija ese estatus al capturar el reporte).
//
// Unidad/oficial se agregan con LATERAL + STRING_AGG (no JOIN directo): un despacho
// puede traer varios oficiales, y `atiende_caso` es `true` por default para TODO el
// equipo asignado (no aísla a un solo responsable salvo en el flujo de rondín
// escalado) — un JOIN directo produce una fila del reporte por cada oficial
// (fan-out). unidad_arribo usa `unidad_placa` (identificador legible, ej. "ER-721-A1"),
// no `unidad_ext_id` (UUID interno).
export async function obtenerAlarmasEscolaresDetalle(desde: string, hasta: string): Promise<AlarmaEscolarDetalleRow[]> {
  const result = await query<Record<string, unknown>>(`
    SELECT
      i.folio                                     AS folio,
      i.folio_cad                                  AS folio_reporte,
      i.fecha_hora_inicio::date                    AS fecha,
      TO_CHAR(i.fecha_hora_inicio, 'HH24:MI')       AS hora,
      a.establecimiento                            AS establecimiento,
      TRIM(BOTH ', ' FROM CONCAT_WS(', ',
        NULLIF(TRIM(CONCAT_WS(' ', i.calle, i.numero_exterior)), ''),
        NULLIF(i.colonia, ''),
        NULLIF(i.referencia_ubicacion, '')
      ))                                            AS direccion,
      a.inmueble                                   AS inmueble,
      a.responsable                                AS responsable,
      a.nombre_responsable                         AS nombre_responsable,
      a.reporte_descripcion                        AS reporte_descripcion,
      cp.nombre                                    AS prioridad,
      a.activaciones                               AS activaciones,
      a.es_falso                                   AS es_falso,
      d.fecha_hora_despacho                        AS hora_canalizacion,
      du.unidades                                  AS unidad_arribo,
      du.hora_arribo                               AS hora_arribo,
      de.oficiales                                 AS oficial,
      a.nombre_verificador                         AS nombre_verificador
    FROM incidentes i
    JOIN incidente_alarma_escolar a ON a.incidente_id = i.id
    LEFT JOIN cat_prioridades cp ON cp.id = i.prioridad_id
    LEFT JOIN incidente_despacho d ON d.incidente_id = i.id
    LEFT JOIN LATERAL (
      SELECT STRING_AGG(DISTINCT du2.unidad_placa, ', ' ORDER BY du2.unidad_placa) AS unidades,
             MIN(du2.hora_llegada) AS hora_arribo
      FROM incidente_despacho_unidades du2
      WHERE du2.despacho_id = d.id AND du2.es_refuerzo = false
    ) du ON true
    LEFT JOIN LATERAL (
      SELECT STRING_AGG(de2.elemento_nombre, ', ' ORDER BY de2.creado_en) AS oficiales
      FROM incidente_despacho_elementos de2
      WHERE de2.despacho_id = d.id AND de2.es_refuerzo = false
    ) de ON true
    WHERE i.tipo_reporte = 'alarma_escolar'
      AND i.estatus IN ('atendido', 'cerrado_detencion')
      AND i.fecha_hora_inicio::date BETWEEN $1 AND $2
    ORDER BY i.fecha_hora_inicio DESC
  `, [desde, hasta])
  return result.rows.map(rowToAlarmaEscolarDetalle)
}
