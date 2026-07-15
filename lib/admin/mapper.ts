import type { UsuarioLista, RolItem } from './types'

function toStr(val: unknown): string | null {
  if (val === null || val === undefined) return null
  return String(val)
}

export function rowToUsuarioLista(row: Record<string, unknown>): UsuarioLista {
  return {
    id: String(row.id ?? ''),
    name: String(row.name ?? ''),
    apellido: String(row.apellido ?? ''),
    email: String(row.email ?? ''),
    emailVerified: Boolean(row.email_verified),
    image: toStr(row.image),
    rolId: row.rol_id ? Number(row.rol_id) : null,
    rolNombre: toStr(row.rol_nombre),
    activo: Boolean(row.activo),
    twoFactorEnabled: Boolean(row.two_factor_enabled),
    createdAt: toStr(row.created_at) ?? '',
  }
}

export function rowToRol(row: Record<string, unknown>): RolItem {
  return {
    id: Number(row.id ?? 0),
    nombre: String(row.nombre ?? ''),
    descripcion: toStr(row.descripcion),
    activo: Boolean(row.activo),
  }
}
