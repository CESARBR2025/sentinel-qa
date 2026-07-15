import { query } from '@/lib/db'

export async function obtenerSolicitudesPendientes() {
  return query<Record<string, unknown>>(`
    SELECT
      id,
      folio,
      placa,
      estatus_dependencia,
      motivo_retencion,
      created_at,
      nombre_infractor,
      correo_infractor,
      nombre_titular_liberacion,
      appaterno_titular_liberacion,
      apmaterno_titular_liberacion,
      correo_titular_liberacion,
      url_orden_salida_liberaciones,
      url_oficio_pago_corralon
    FROM via.v2_infracciones
    WHERE estatus = 'CERRADA'
      AND estatus_dependencia IN ('LIBERADA_POR_ACCIDENTE', 'LIBERADA_POR_DELITO', 'LIBERADA_POR_INFRACCION')
    ORDER BY created_at DESC
  `)
}

export async function obtenerEstatusInfraccion(id: string): Promise<string | null> {
  const result = await query<{ estatus_dependencia: string }>(
    `SELECT estatus_dependencia FROM via.v2_infracciones WHERE id = $1 LIMIT 1`,
    [id],
  )
  return result.rows[0]?.estatus_dependencia ?? null
}

export async function finalizarInfraccionCorralon(id: string, urlDocumento: string, estatusDep: string): Promise<void> {
  await query(
    `UPDATE via.v2_infracciones
     SET url_oficio_pago_corralon = $2,
         estatus = 'FINALIZADA',
         estatus_dependencia = $3,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $1`,
    [id, urlDocumento, estatusDep],
  )
}

export async function obtenerSolicitudesFinalizadas() {
  return query<Record<string, unknown>>(`
    SELECT
      id,
      folio,
      placa,
      estatus_dependencia,
      motivo_retencion,
      created_at,
      nombre_infractor,
      correo_infractor,
      nombre_titular_liberacion,
      appaterno_titular_liberacion,
      apmaterno_titular_liberacion,
      correo_titular_liberacion,
      url_orden_salida_liberaciones,
      url_oficio_pago_corralon
    FROM via.v2_infracciones
    WHERE estatus = 'FINALIZADA'
      AND estatus_dependencia IN ('FINALIZADA_ACCIDENTE', 'FINALIZADA_DELITO', 'FINALIZADA_INFRACCION')
      AND url_oficio_pago_corralon IS NOT NULL
    ORDER BY updated_at DESC
  `)
}
