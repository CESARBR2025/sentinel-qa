'use server'

import { query } from '@/lib/db'

// ─── Componente TEMPORAL de desarrollo: cambiar de usuario sin login ─────────
// El switch de sesión vive en app/api/dev/cambiar-sesion (la lógica en
// lib/auth/dev-sesiones.ts). Aquí solo queda la lista de usuarios del dropdown.
// Eliminar junto con components/dev/CambiarSesionDev.tsx, lib/auth/dev-sesiones.ts
// y su integración en components/partials/Header.tsx cuando deje de ser necesario.

export interface UsuarioSesionDev {
  id: string
  name: string
  apellido: string
  email: string
  rolNombre: string | null
}

export async function listarUsuariosSesionDev(): Promise<UsuarioSesionDev[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT u.id, u.name, u.apellido, u.email, r.nombre AS rol_nombre
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.activo = true
     ORDER BY r.nombre NULLS LAST, u.name, u.apellido`,
  )
  return result.rows.map((row) => ({
    id: String(row.id),
    name: String(row.name ?? ''),
    apellido: String(row.apellido ?? ''),
    email: String(row.email ?? ''),
    rolNombre: row.rol_nombre ? String(row.rol_nombre) : null,
  }))
}
