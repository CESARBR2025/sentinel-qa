import { query } from '@/lib/db'

export interface UserWithRole {
  id: string
  name: string
  apellido: string
  email: string
  rolId: number | null
  rolNombre: string | null
  activo: boolean
  esAdmin: boolean
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
    esAdmin: Boolean(row.es_admin),
  }
}

// Único lugar que resuelve "es admin" (vía roles.es_admin) — todo lo demás
// consume esAdmin, nunca compara rolNombre contra un string hardcodeado.
export async function getUserWithRole(userId: string): Promise<UserWithRole | null> {
  const result = await query<Record<string, unknown>>(
    `SELECT u.*, r.nombre AS rol_nombre, r.es_admin AS es_admin
     FROM users u
     LEFT JOIN roles r ON u.rol_id = r.id
     WHERE u.id = $1
     LIMIT 1`,
    [userId],
  )
  return result.rows.length ? rowToUserWithRole(result.rows[0]) : null
}

// Único lugar que mapea rol → su hub de aterrizaje (usado por app/dashboard/page.tsx
// para el redirect de login, y por las páginas que SON ese hub para decidir si
// mostrar el botón "← Dashboard" o no — si el rol ya está en su hub, /dashboard
// solo lo rebotaría de vuelta aquí mismo). null = el rol no tiene hub propio,
// /dashboard le muestra el panel general real.
const HUB_POR_ROL: Record<string, string> = {
  admin_transito: '/admin-transito',
  'Oficial de Campo': '/oficial',
  agente_fiscalia: '/fiscalia',
  agente_juzgado: '/agente_juzgado',
  agente_liberaciones: '/agente_liberaciones',
  agente_infracciones: '/agente_infracciones',
  Monitorista: '/monitorista',
  Auxiliar: '/auxiliar',
  'Auxiliar de Novedades': '/auxiliar',
  Reportante: '/reportes',
  agente_911: '/agente_911',
  agente_despacho: '/agente_despacho',
  agente_bitacorista: '/agente_bitacorista',
  corralon_mw: '/corralon',
  corralon_mejia: '/corralon',
  agente_reportes: '/nCoordinacion',
}

export function obtenerHubRol(rolNombre: string | null | undefined): string | null {
  if (!rolNombre) return null
  return HUB_POR_ROL[rolNombre] ?? null
}
