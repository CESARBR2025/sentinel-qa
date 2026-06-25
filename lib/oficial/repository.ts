import { query } from '@/lib/db'
import { rowToOficial, rowToReporteCampo } from './mapper'
import type { OfiOficial, CrearReporteCampoInput } from './types'

export async function obtenerOficialPorUserId(userId: string): Promise<OfiOficial | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT * FROM ofi_oficiales WHERE user_id = $1 AND ofi_estatus = 'activo' LIMIT 1`,
    [userId]
  )
  return result.rows.length ? rowToOficial(result.rows[0]) : null
}

export async function insertarReporteCampo(data: CrearReporteCampoInput): Promise<string> {
  const result = await query<{ id: string }>(
    `INSERT INTO ofi_reportes_campo (
      ofi_folio_cad, ofi_nombre_reportante, ofi_anonimo,
      ofi_tipo_incidente, ofi_tipo_emergencia, ofi_prioridad,
      ofi_descripcion, ofi_contenido_reporte,
      ofi_calle, ofi_colonia, ofi_latitud, ofi_longitud,
      ofi_datos_pn, ofi_acciones,
      ofi_hay_detencion, ofi_detenidos, ofi_autoridad_recibe, ofi_monto_robo,
      ofi_objetos_recuperados, ofi_hay_vehiculo, ofi_vehiculos,
      ofi_hay_cateo, ofi_cateo, ofi_resultado_cateo,
      ofi_oficial_id, ofi_oficial_nombre
    ) VALUES (
      $1, $2, $3,
      $4, $5, $6,
      $7, $8,
      $9, $10, $11, $12,
      $13, $14,
      $15, $16::jsonb, $17, $18,
      $19, $20, $21::jsonb,
      $22, $23::jsonb, $24,
      $25, $26
    ) RETURNING id`,
    [
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
      data.ofiObjetosRecuperados,
      data.ofiHayVehiculo,
      JSON.stringify(data.ofiVehiculos),
      data.ofiHayCateo,
      data.ofiCateo ? JSON.stringify(data.ofiCateo) : null,
      data.ofiResultadoCateo,
      data.ofiOficialId,
      data.ofiOficialNombre,
    ]
  )
  return result.rows[0].id
}
