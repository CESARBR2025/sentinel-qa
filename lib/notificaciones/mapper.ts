import type { Notificacion } from './types'

export function rowToNotificacion(row: Record<string, unknown>): Notificacion {
  return {
    id: String(row.id ?? ''),
    userId: String(row.userId ?? ''),
    tipo: String(row.tipo ?? ''),
    titulo: String(row.titulo ?? ''),
    mensaje: String(row.mensaje ?? ''),
    href: row.href ? String(row.href) : null,
    leida: Boolean(row.leida),
    fichaId: row.fichaId ? String(row.fichaId) : null,
    hito: row.hito ? String(row.hito) : null,
    creadoEn: String(row.creadoEn ?? ''),
  }
}
