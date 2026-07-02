import { query, queryVia } from "@/lib/db";
import type { RolRow } from "./types";

export async function obtenerRolUsuario(userId: string): Promise<string> {
  const result = await query<RolRow>(
    `SELECT r.nombre AS rol
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [userId],
  );
  return result.rows[0]?.rol ?? "";
}

export async function obtenerLiberaciones() {
  return queryVia<Record<string, unknown>>(`
    SELECT
      id,
      folio,
      estatus,
      placa,
      created_at,
      correo_infractor,
      nombre_infractor,
      estatus_dependencia,
      no_carpeta_investigacion,
      url_orden_salida_liberaciones
    FROM v2_infracciones
    WHERE estatus_dependencia IN ('ESPERA_REVISION', 'EN_PROCESO_LIBERACIONES', 'LIBERADA_POR_INFRACCION', 'VEHICULO_EN_CORRALON', 'LIBERADA_POR_DELITO', 'LIBERADA_POR_ACCIDENTE')
       OR (estatus = 'REGISTRADA' AND estatus_dependencia IN ('MESA_DE_CONTROL_REVISION', 'MESA_DE_CONTROL_PENDIENTE_DOCS'))
       OR (estatus = 'PENDIENTE_PAGO' AND estatus_dependencia = 'PENDIENTE_PAGO_LIBERACION')
  `);
}


