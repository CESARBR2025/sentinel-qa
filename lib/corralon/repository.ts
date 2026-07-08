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
      correo_infractor
    FROM via.v2_infracciones
    WHERE estatus = 'CERRADA'
      AND estatus_dependencia IN ('LIBERADA_POR_ACCIDENTE', 'DELITO', 'LIBERADA_POR_INFRACCION')
    ORDER BY created_at DESC
  `)
}
