import { query } from '@/lib/db'
import { rowToOficial, rowToReporteResumen, rowToReporteDetalle } from './mapper'
import type { OfiOficial, CrearReporteCampoInput, OfiReporteResumen, OfiReporteDetalle, CatalogoItem } from './types'

export async function obtenerOficialPorUserId(userId: string): Promise<OfiOficial | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT o.*, d.nombre AS departamento_nombre
     FROM ofi_oficiales o
     LEFT JOIN via.v2_departamentos d ON d.id = o.departamento_id
     WHERE o.user_id = $1 AND o.ofi_estatus = 'activo'
     LIMIT 1`,
    [userId]
  )
  return result.rows.length ? rowToOficial(result.rows[0]) : null
}

export async function verificarFolioExiste(folio: string): Promise<boolean> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count FROM ofi_reportes_campo WHERE folio_reporte_campo = $1`,
    [folio]
  )
  return parseInt(result.rows[0].count, 10) > 0
}

export async function insertarReporteCampo(data: CrearReporteCampoInput): Promise<string> {
  const result = await query<{ id: string }>(
    `INSERT INTO ofi_reportes_campo (
    folio_reporte_campo,
    ofi_folio_cad, ofi_nombre_reportante, ofi_anonimo,
    ofi_tipo_incidente, ofi_tipo_emergencia, ofi_prioridad,
    ofi_descripcion, ofi_contenido_reporte,
    ofi_calle, ofi_colonia, ofi_latitud, ofi_longitud,
    ofi_datos_pn, ofi_acciones,
    ofi_hay_detencion, ofi_detenidos, ofi_autoridad_recibe, ofi_monto_robo, ofi_hay_robo,
    ofi_objetos_recuperados, ofi_hay_vehiculo, ofi_vehiculos,
    ofi_hay_cateo, ofi_cateo, ofi_resultado_cateo,
    ofi_oficial_id,
    quiere_denuncia,
    ofi_hay_orden_aprehension, ofi_ordenes_aprehension,
    ofi_hay_hidrocarburo,      ofi_hidrocarburos,
    ofi_hay_arma_fuego,        ofi_armas_fuego,
    ofi_hay_droga,             ofi_drogas,
    ofi_telefono_reportante, ofi_observaciones
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
    $11, $12, $13, $14, $15, $16, $17::jsonb, $18, $19, $20,
    $21, $22, $23::jsonb,
    $24, $25::jsonb, $26,
    $27, $28, $29, $30::jsonb, $31, $32::jsonb, $33, $34::jsonb, $35, $36::jsonb, $37, $38
  ) RETURNING id`,
    [
      data.folioReporteCampo,
      data.ofiFolioCad,
      data.ofiNombreReportante,
      data.ofiAnonimo,
      data.ofiTipoIncidente,
      data.ofiTipoEmergencia,
      data.ofiPrioridad,
      data.ofiDescripcion,
      data.ofiContenidoReporte,
      data.ofiCalle,
      data.ofiColonia,
      data.ofiLatitud,
      data.ofiLongitud,
      data.ofiDatosPn,
      data.ofiAcciones,
      data.ofiHayDetencion,
      JSON.stringify(data.ofiDetenidos),
      data.ofiAutoridadRecibe,
      data.ofiMontoRobo,
      data.ofiHayRobo,
      data.ofiObjetosRecuperados,
      data.ofiHayVehiculo,
      JSON.stringify(data.ofiVehiculos),
      data.ofiHayCateo,
      data.ofiCateo ? JSON.stringify(data.ofiCateo) : null,
      data.ofiResultadoCateo,
      data.ofiOficialId,
      data.ofiQuiereDenuncia,
      data.ofiHayOrdenAprehension,
      JSON.stringify(data.ofiOrdenesAprehension),
      data.ofiHayHidrocarburo, JSON.stringify(data.ofiHidrocarburos),
      data.ofiHayArmaFuego, JSON.stringify(data.ofiArmasFuego),
      data.ofiHayDroga, JSON.stringify(data.ofiDrogas),
      data.ofiTelefonoReportante, data.ofiObservaciones,
    ]
  )
  return result.rows[0].id
}

export async function obtenerRolUsuario(userId: string): Promise<string | null> {
  const result = await query<{ nombre: string }>(
    `SELECT roles.nombre
     FROM users
     LEFT JOIN roles ON roles.id = users.rol_id
     WHERE users.id = $1
     LIMIT 1`,
    [userId]
  )
  return result.rows.length ? result.rows[0].nombre : null
}

export async function obtenerCatalogoIncidentes(): Promise<CatalogoItem[]> {
  const result = await query<CatalogoItem>(
    `SELECT id, nombre FROM cat_tipos_incidente WHERE activo = true ORDER BY nombre`
  )
  return result.rows
}

export async function obtenerCatalogoEmergencias(): Promise<CatalogoItem[]> {
  const result = await query<CatalogoItem>(
    `SELECT id, nombre FROM cat_tipos_emergencia WHERE activo = true ORDER BY nombre`
  )
  return result.rows
}

export async function obtenerCatalogoPrioridades(): Promise<CatalogoItem[]> {
  const result = await query<CatalogoItem>(
    `SELECT id, nombre FROM cat_prioridades WHERE activo = true ORDER BY orden`
  )
  return result.rows
}

export async function obtenerCatalogoCanalizaciones(): Promise<CatalogoItem[]> {
  const result = await query<CatalogoItem>(
    `SELECT id, nombre FROM cat_medios_canalizacion WHERE activo = true ORDER BY nombre`
  )
  return result.rows
}

export async function contarDenunciasPendientes(userId: string): Promise<number> {
  const result = await query<{ count: string }>(
    `SELECT COUNT(*)::int AS count
     FROM ofi_reportes_campo r
     LEFT JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = r.id
     WHERE r.ofi_oficial_id = (
       SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1
     )
     AND r.quiere_denuncia = true
     AND d.id IS NULL`,
    [userId]
  )
  return parseInt(result.rows[0].count, 10)
}

export async function obtenerReportesOficial(userId: string): Promise<OfiReporteResumen[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       r.id,
       r.folio_reporte_campo,
       r.ofi_folio_cad,
       r.ofi_tipo_incidente,
       r.ofi_calle,
       r.ofi_colonia,
       r.ofi_latitud,
       r.ofi_longitud,
       r.quiere_denuncia,
       r.created_at,
       d.id           AS d1_id,
       d.folio_denuncia AS d1_folio
     FROM ofi_reportes_campo r
     LEFT JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = r.id
     WHERE r.ofi_oficial_id = (
       SELECT id FROM ofi_oficiales WHERE user_id = $1 LIMIT 1
     )
     ORDER BY r.created_at DESC
     LIMIT 50`,
    [userId]
  )
  return result.rows.map(rowToReporteResumen)
}

export async function obtenerReporteDetalle(
  id: string,
  userId: string
): Promise<OfiReporteDetalle | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT
       r.*,
       r.quiere_denuncia,
       CONCAT(o.ofi_nombre, ' ', o.ofi_ap_paterno) AS ofi_oficial_nombre,
       d.id                  AS d1_id,
       d.folio_denuncia      AS d1_folio,
       d.iph                 AS d1_iph,
       d.folio_cu            AS d1_folio_cu,
       d.fecha_reporte       AS d1_fecha_reporte,
       d.hora_reporte        AS d1_hora_reporte,
       d.tipo_evento         AS d1_tipo_evento,
       d.delito              AS d1_delito,
       d.violencia           AS d1_violencia,
       d.lugar_hecho         AS d1_lugar_hecho,
       d.colonia_hecho       AS d1_colonia_hecho,
       d.latitud             AS d1_latitud,
       d.longitud            AS d1_longitud,
       d.policia_a_cargo     AS d1_policia_cargo,
       d.se_genero_d1        AS d1_se_genero,
       d.observaciones       AS d1_observaciones,
       d.ofendido_hombre     AS d1_ofendido_hombre,
       d.ofendido_mujer      AS d1_ofendido_mujer
     FROM ofi_reportes_campo r
     LEFT JOIN ofi_oficiales o ON o.id = r.ofi_oficial_id
     LEFT JOIN ofi_reporte_denuncia d ON d.reporte_campo_id = r.id
     WHERE r.id = $1::uuid
       AND r.ofi_oficial_id = (
         SELECT id FROM ofi_oficiales WHERE user_id = $2 LIMIT 1
       )
     LIMIT 1`,
    [id, userId]
  )
  return result.rows.length ? rowToReporteDetalle(result.rows[0]) : null
}

export async function actualizarPatrullaOficial(
  userId: string,
  patrullaId: string | null,
): Promise<void> {
  await query(
    `UPDATE ofi_oficiales
     SET patrulla_id = $1
     WHERE user_id = $2`,
    [patrullaId, userId],
  )
}
