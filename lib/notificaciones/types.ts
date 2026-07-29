import type { Severidad } from './catalogo'

/** Notificación tal como la ve un usuario concreto (con SU estado de lectura). */
export interface Notificacion {
  id: string
  evento: string
  titulo: string
  mensaje: string
  href: string | null
  severidad: Severidad
  /** Derivado por usuario: existe fila en notificaciones_lecturas. */
  leida: boolean
  entidadTipo: string | null
  entidadId: string | null
  creadoEn: string
}

/** Fila de la auditoría del panel admin: el evento y a cuántos alcanzó. */
export interface NotificacionAuditoria {
  id: string
  grupoId: string | null
  evento: string
  titulo: string
  mensaje: string
  href: string | null
  severidad: Severidad
  rolId: number | null
  rolNombre: string | null
  userId: string | null
  usuarioNombre: string | null
  emitidaPor: string | null
  emitidaPorNombre: string | null
  creadoEn: string
  /** Cuántas personas la han marcado leída. */
  lecturas: number
}

export interface SuscripcionEventoRol {
  evento: string
  rolId: number
  activo: boolean
}

export interface FiltrosAuditoria {
  evento?: string | null
  rolId?: number | null
  desde?: string | null
  hasta?: string | null
  limite?: number
  offset?: number
}
