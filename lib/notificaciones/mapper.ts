import type { Severidad } from './catalogo'
import type { Notificacion, NotificacionAuditoria } from './types'

function txt(v: unknown): string { return v === null || v === undefined ? '' : String(v) }
function txtNull(v: unknown): string | null { return v === null || v === undefined ? null : String(v) }

function severidad(v: unknown): Severidad {
  const s = txt(v)
  return s === 'critico' || s === 'aviso' ? s : 'info'
}

export function rowToNotificacion(row: Record<string, unknown>): Notificacion {
  return {
    id: txt(row.id),
    evento: txt(row.evento),
    titulo: txt(row.titulo),
    mensaje: txt(row.mensaje),
    href: txtNull(row.href),
    severidad: severidad(row.severidad),
    leida: Boolean(row.leida),
    entidadTipo: txtNull(row.entidad_tipo),
    entidadId: txtNull(row.entidad_id),
    creadoEn: txt(row.creado_en),
  }
}

export function rowToAuditoria(row: Record<string, unknown>): NotificacionAuditoria {
  return {
    id: txt(row.id),
    grupoId: txtNull(row.grupo_id),
    evento: txt(row.evento),
    titulo: txt(row.titulo),
    mensaje: txt(row.mensaje),
    href: txtNull(row.href),
    severidad: severidad(row.severidad),
    rolId: row.rol_id === null || row.rol_id === undefined ? null : Number(row.rol_id),
    rolNombre: txtNull(row.rol_nombre),
    userId: txtNull(row.user_id),
    usuarioNombre: txtNull(row.usuario_nombre),
    emitidaPor: txtNull(row.emitida_por),
    emitidaPorNombre: txtNull(row.emitida_por_nombre),
    creadoEn: txt(row.creado_en),
    lecturas: Number(row.lecturas ?? 0),
  }
}
