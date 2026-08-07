import { query } from '@/lib/db'
import type { Notificacion, NotificacionAuditoria, FiltrosAuditoria, SuscripcionEventoRol } from './types'
import { rowToNotificacion, rowToAuditoria } from './mapper'

// El estado de lectura NO es una columna de `notificaciones`: vive en
// `notificaciones_lecturas`, una fila por (notificación, persona). Por eso todas
// las consultas de usuario hacen LEFT JOIN contra esa tabla — así una misma
// notificación dirigida a un rol puede estar leída por unos y no por otros.
const SELECT_USUARIO = `
  SELECT n.id, n.evento, n.titulo, n.mensaje, n.href, n.severidad,
         n.entidad_tipo, n.entidad_id, n.creado_en,
         (l.user_id IS NOT NULL) AS leida
    FROM notificaciones_eventos n
    LEFT JOIN notificaciones_lecturas l
           ON l.notificacion_id = n.id AND l.user_id = $1
   WHERE (n.user_id = $1 OR n.rol_id = $2)`

/** Listado para la campanita y el historial. `rolId` puede ser null. */
export async function listarParaUsuario(
  userId: string,
  rolId: number | null,
  opciones: { limite?: number; offset?: number; soloNoLeidas?: boolean } = {},
): Promise<Notificacion[]> {
  const { limite = 20, offset = 0, soloNoLeidas = false } = opciones
  const result = await query<Record<string, unknown>>(
    `${SELECT_USUARIO}
       ${soloNoLeidas ? 'AND l.user_id IS NULL' : ''}
     ORDER BY n.creado_en DESC
     LIMIT $3 OFFSET $4`,
    [userId, rolId, limite, offset],
  )
  return result.rows.map(rowToNotificacion)
}

/**
 * Query del polling: sólo un conteo indexado, sin escrituras ni escaneos.
 * Es lo único que se ejecuta cada intervalo, de ahí que deba ser barata.
 */
export async function contarNoLeidas(userId: string, rolId: number | null): Promise<number> {
  const result = await query<{ total: string }>(
    `SELECT count(*)::int AS total
       FROM notificaciones_eventos n
       LEFT JOIN notificaciones_lecturas l
              ON l.notificacion_id = n.id AND l.user_id = $1
      WHERE (n.user_id = $1 OR n.rol_id = $2) AND l.user_id IS NULL`,
    [userId, rolId],
  )
  return Number(result.rows[0]?.total ?? 0)
}

/** Para la alerta de pantalla completa: la crítica no leída más reciente, o null. */
export async function criticaMasRecienteSinLeer(
  userId: string,
  rolId: number | null,
): Promise<Notificacion | null> {
  const result = await query<Record<string, unknown>>(
    `${SELECT_USUARIO}
       AND l.user_id IS NULL AND n.severidad = 'critico'
     ORDER BY n.creado_en DESC
     LIMIT 1`,
    [userId, rolId],
  )
  return result.rows[0] ? rowToNotificacion(result.rows[0]) : null
}

export async function contarTotal(userId: string, rolId: number | null): Promise<number> {
  const result = await query<{ total: string }>(
    `SELECT count(*)::int AS total FROM notificaciones_eventos n
      WHERE n.user_id = $1 OR n.rol_id = $2`,
    [userId, rolId],
  )
  return Number(result.rows[0]?.total ?? 0)
}

// Marcar leída = insertar la fila de lectura. Se valida que la notificación sea
// realmente del usuario (suya o de su rol) para que nadie marque las ajenas.
export async function marcarLeidaParaUsuario(notifId: string, userId: string, rolId: number | null) {
  await query(
    `INSERT INTO notificaciones_lecturas (notificacion_id, user_id)
     SELECT n.id, $2 FROM notificaciones_eventos n
      WHERE n.id = $1 AND (n.user_id = $2 OR n.rol_id = $3)
     ON CONFLICT DO NOTHING`,
    [notifId, userId, rolId],
  )
}

export async function marcarTodasLeidasParaUsuario(userId: string, rolId: number | null) {
  await query(
    `INSERT INTO notificaciones_lecturas (notificacion_id, user_id)
     SELECT n.id, $1 FROM notificaciones_eventos n
      WHERE (n.user_id = $1 OR n.rol_id = $2)
     ON CONFLICT DO NOTHING`,
    [userId, rolId],
  )
}

// El estado de lectura vive desacoplado del estatus de la entidad (ej. un
// incidente): cerrar el incidente no marcaba las notificaciones como leídas,
// así que una alerta crítica de un caso ya resuelto seguía apareciendo
// indefinidamente. Se llama al cerrar/resolver la entidad — marca como leída,
// para TODOS sus destinatarios (usuario directo o cada miembro del rol), toda
// notificación ligada a esa entidad.
export async function marcarLeidasPorEntidad(entidadTipo: string, entidadId: string) {
  await query(
    `INSERT INTO notificaciones_lecturas (notificacion_id, user_id)
     SELECT n.id, n.user_id FROM notificaciones_eventos n
      WHERE n.entidad_tipo = $1 AND n.entidad_id = $2 AND n.user_id IS NOT NULL
     ON CONFLICT DO NOTHING`,
    [entidadTipo, entidadId],
  )
  await query(
    `INSERT INTO notificaciones_lecturas (notificacion_id, user_id)
     SELECT n.id, u.id FROM notificaciones_eventos n
     JOIN users u ON u.rol_id = n.rol_id
      WHERE n.entidad_tipo = $1 AND n.entidad_id = $2 AND n.rol_id IS NOT NULL
     ON CONFLICT DO NOTHING`,
    [entidadTipo, entidadId],
  )
}

// ─── Suscripciones (matriz evento × rol del panel admin) ─────────────────────

export async function listarSuscripciones(): Promise<SuscripcionEventoRol[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT evento, rol_id, activo FROM notificaciones_suscripciones`,
  )
  return result.rows.map(r => ({
    evento: String(r.evento ?? ''),
    rolId: Number(r.rol_id),
    activo: Boolean(r.activo),
  }))
}

export async function guardarSuscripcion(evento: string, rolId: number, activo: boolean) {
  await query(
    `INSERT INTO notificaciones_suscripciones (evento, rol_id, activo, actualizado_en)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (evento, rol_id)
     DO UPDATE SET activo = EXCLUDED.activo, actualizado_en = now()`,
    [evento, rolId, activo],
  )
}

/** Roles suscritos a un evento. Vacío = no hay override, manda el catálogo. */
export async function rolesSuscritos(evento: string): Promise<number[] | null> {
  const result = await query<{ rol_id: number }>(
    `SELECT rol_id FROM notificaciones_suscripciones WHERE evento = $1 AND activo = true`,
    [evento],
  )
  const hayOverride = await query<{ total: string }>(
    `SELECT count(*)::int AS total FROM notificaciones_suscripciones WHERE evento = $1`,
    [evento],
  )
  if (Number(hayOverride.rows[0]?.total ?? 0) === 0) return null
  return result.rows.map(r => Number(r.rol_id))
}

export async function idsRolesPorNombre(nombres: string[]): Promise<number[]> {
  if (nombres.length === 0) return []
  const result = await query<{ id: number }>(
    `SELECT id FROM roles WHERE nombre = ANY($1) AND activo = true`,
    [nombres],
  )
  return result.rows.map(r => Number(r.id))
}

// ─── Auditoría / mantenimiento (panel admin) ─────────────────────────────────

export async function listarAuditoria(filtros: FiltrosAuditoria = {}): Promise<NotificacionAuditoria[]> {
  const { evento, rolId, desde, hasta, limite = 100, offset = 0 } = filtros
  const cond: string[] = []
  const params: unknown[] = []
  if (evento) { cond.push(`n.evento = $${params.length + 1}`); params.push(evento) }
  if (rolId)  { cond.push(`n.rol_id = $${params.length + 1}`); params.push(rolId) }
  if (desde)  { cond.push(`n.creado_en >= $${params.length + 1}`); params.push(desde) }
  if (hasta)  { cond.push(`n.creado_en <= $${params.length + 1}`); params.push(hasta) }
  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : ''

  const result = await query<Record<string, unknown>>(
    `SELECT n.id, n.grupo_id, n.evento, n.titulo, n.mensaje, n.href, n.severidad,
            n.rol_id, r.nombre AS rol_nombre,
            n.user_id, u.name AS usuario_nombre,
            n.emitida_por, e.name AS emitida_por_nombre,
            n.creado_en,
            (SELECT count(*)::int FROM notificaciones_lecturas l WHERE l.notificacion_id = n.id) AS lecturas
       FROM notificaciones_eventos n
       LEFT JOIN roles r ON r.id = n.rol_id
       LEFT JOIN users u ON u.id = n.user_id
       LEFT JOIN users e ON e.id = n.emitida_por
       ${where}
      ORDER BY n.creado_en DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limite, offset],
  )
  return result.rows.map(rowToAuditoria)
}

export async function obtenerRetencionDias(): Promise<number> {
  const result = await query<{ valor: string }>(
    `SELECT valor FROM notificaciones_config WHERE clave = 'retencion_dias'`,
  )
  return Number(result.rows[0]?.valor ?? 90)
}

export async function guardarRetencionDias(dias: number) {
  await query(
    `INSERT INTO notificaciones_config (clave, valor) VALUES ('retencion_dias', $1)
     ON CONFLICT (clave) DO UPDATE SET valor = EXCLUDED.valor`,
    [String(dias)],
  )
}

export async function contarAntiguas(dias: number): Promise<number> {
  const result = await query<{ total: string }>(
    `SELECT count(*)::int AS total FROM notificaciones_eventos
      WHERE creado_en < now() - ($1 || ' days')::interval`,
    [String(dias)],
  )
  return Number(result.rows[0]?.total ?? 0)
}

/** Borra por retención. Las lecturas caen solas por ON DELETE CASCADE. */
export async function purgarAntiguas(dias: number): Promise<number> {
  const result = await query<{ id: string }>(
    `DELETE FROM notificaciones_eventos
      WHERE creado_en < now() - ($1 || ' days')::interval
      RETURNING id`,
    [String(dias)],
  )
  return result.rowCount ?? 0
}

// ─── Escalación (cron) ────────────────────────────────────────────────────

export interface CandidataEscalacion {
  id: string
  rolId: number | null
  userId: string | null
  titulo: string
  mensaje: string
  href: string | null
}

/**
 * Críticas sin ninguna lectura, con más de `minutos` de antigüedad y que
 * todavía no se han escalado. Para una fila dirigida a un rol, "sin lectura"
 * significa que NADIE del rol la ha visto — simplificación deliberada, no se
 * pide que cada integrante individual la haya leído.
 */
export async function candidatasEscalacion(minutos: number): Promise<CandidataEscalacion[]> {
  const result = await query<Record<string, unknown>>(
    `SELECT n.id, n.rol_id, n.user_id, n.titulo, n.mensaje, n.href
       FROM notificaciones_eventos n
      WHERE n.severidad = 'critico'
        AND n.push_reescalado_en IS NULL
        AND n.creado_en < now() - ($1 || ' minutes')::interval
        AND NOT EXISTS (SELECT 1 FROM notificaciones_lecturas l WHERE l.notificacion_id = n.id)`,
    [String(minutos)],
  )
  return result.rows.map(r => ({
    id: String(r.id),
    rolId: r.rol_id === null || r.rol_id === undefined ? null : Number(r.rol_id),
    userId: r.user_id === null || r.user_id === undefined ? null : String(r.user_id),
    titulo: String(r.titulo),
    mensaje: String(r.mensaje),
    href: r.href === null || r.href === undefined ? null : String(r.href),
  }))
}

export async function marcarEscalada(id: string): Promise<void> {
  await query(`UPDATE notificaciones_eventos SET push_reescalado_en = now() WHERE id = $1`, [id])
}
