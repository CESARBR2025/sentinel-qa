import type { Departamento, OficialLista, UserBasico, UserWithRole } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  return String(val)
}

export function rowToUserWithRole(row: Record<string, unknown>): UserWithRole {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    apellido: String(row.apellido ?? ''),
    email: String(row.email ?? ''),
    rolId: row.rol_id ? Number(row.rol_id) : null,
    rolNombre: row.rol_nombre ? String(row.rol_nombre) : null,
    activo: Boolean(row.activo),
  }
}

export function rowToDepartamento(row: Record<string, unknown>): Departamento {
  return {
    id: String(row.id ?? ''),
    clave: toStr(row.clave) ?? '',
    nombre: toStr(row.nombre) ?? '',
  }
}

export function rowToOficialLista(row: Record<string, unknown>): OficialLista {
  return {
    id: String(row.id ?? ''),
    userName: toStr(row.user_name) ?? '',
    userApellido: toStr(row.user_apellido) ?? '',
    userEmail: toStr(row.user_email) ?? '',
    noNomina: toStr(row.no_nomina),
    numeroEmpleado: toStr(row.numero_empleado),
    telefono: toStr(row.telefono),
    departamentoId: toStr(row.departamento_id),
    departamentoNombre: toStr(row.departamento_nombre),
    patrullaId: toStr(row.patrulla_id),
    patrullaUnidad: toStr(row.patrulla_unidad),
    userId: toStr(row.user_id),
    ofiEstatus: toStr(row.ofi_estatus) ?? 'activo',
    createdAt: toStr(row.created_at) ?? '',
    updatedAt: toStr(row.updated_at) ?? '',
  }
}

export function rowToUserBasico(row: Record<string, unknown>): UserBasico {
  return {
    id: String(row.id ?? ''),
    name: toStr(row.name) ?? '',
    apellido: toStr(row.apellido) ?? '',
    email: toStr(row.email) ?? '',
  }
}
