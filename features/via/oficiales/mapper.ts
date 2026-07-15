import { OfiOficialViaDTO } from "./types";

interface OfiOficialRow {
  id: string;
  numero_empleado: string | null;
  ofi_nombre: string;
  ofi_ap_paterno: string;
  ofi_ap_materno: string | null;
  telefono: string | null;
  departamento: string | null;
  rango: string | null;
  fecha_ingreso: string | null;
  patrulla_id: string | null;
  ofi_estatus: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export function mapRowToOficialViaDTO(row: OfiOficialRow): OfiOficialViaDTO {
  return {
    id: row.id,
    numeroEmpleado: row.numero_empleado,
    nombre: row.ofi_nombre,
    apellidoPaterno: row.ofi_ap_paterno,
    apellidoMaterno: row.ofi_ap_materno,
    telefono: row.telefono,
    departamento: row.departamento,
    rango: row.rango,
    fechaIngreso: row.fecha_ingreso,
    patrullaId: row.patrulla_id,
    estatus: row.ofi_estatus,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
