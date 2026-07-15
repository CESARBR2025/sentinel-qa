import { query } from '@/lib/db'

export interface GruaRow {
  id: string
  nombre: string
  activo: boolean
}

export async function listarGruasActivas(): Promise<GruaRow[]> {
  const result = await query<Record<string, unknown>>(
    'SELECT id, nombre, activo FROM via.v2_gruas WHERE activo = true ORDER BY nombre',
  )
  return result.rows.map(r => ({
    id: String(r.id ?? ''),
    nombre: String(r.nombre ?? ''),
    activo: Boolean(r.activo),
  }))
}
