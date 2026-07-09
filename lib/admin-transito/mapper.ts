export function rowToUserWithRole(row: Record<string, unknown>) {
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
