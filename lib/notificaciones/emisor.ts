import { randomUUID } from 'node:crypto'
import { query } from '@/lib/db'
import { definicionEvento, type ClaveEvento } from './catalogo'
import { rolesSuscritos, idsRolesPorNombre } from './repository'
import { enviarPush } from '@/lib/push/service'

export interface DatosEmision {
  mensaje: string
  /** Por defecto, el `label` del catálogo. */
  titulo?: string
  entidadId?: string
  entidadTipo?: string
  /** Por defecto, `catalogo.href(entidadId)`. */
  href?: string
  /** Override puntual de audiencia: nombres de rol tal cual en `roles.nombre`. */
  roles?: string[]
  /** Destinatarios directos, además de los roles. */
  usuarios?: string[]
  emitidaPor?: string
  /**
   * Idempotencia. Con la misma clave, la notificación se inserta una sola vez
   * aunque la acción se reintente (índice único parcial sobre clave_dedup).
   */
  dedup?: string
}

/**
 * Emite una notificación a los destinatarios configurados para el evento.
 *
 * IMPORTANTE — llamar siempre DESPUÉS del COMMIT de la transacción de negocio,
 * nunca dentro. `insertarReporteCampo`, `createDespacho` y `createRondinEscalado`
 * corren con BEGIN/COMMIT explícito: emitir dentro dejaría notificaciones
 * fantasma si la transacción aborta.
 *
 * Nunca lanza: una notificación que falla no puede tumbar la operación de
 * negocio que la originó. Los errores se registran y se siguen.
 */
export async function emitir(evento: ClaveEvento | string, datos: DatosEmision): Promise<void> {
  try {
    const def = definicionEvento(evento)
    if (!def) {
      console.error(`[notificaciones] evento desconocido: ${evento}`)
      return
    }

    // Audiencia: override explícito > suscripciones de BD > default del catálogo.
    let rolIds: number[]
    if (datos.roles) {
      rolIds = await idsRolesPorNombre(datos.roles)
    } else {
      const suscritos = await rolesSuscritos(evento)
      rolIds = suscritos ?? await idsRolesPorNombre(def.rolesPorDefecto)
    }

    const usuarios = datos.usuarios ?? []
    if (rolIds.length === 0 && usuarios.length === 0) return

    const titulo = datos.titulo ?? def.label
    const href = datos.href ?? (datos.entidadId && def.href ? def.href(datos.entidadId) : null)
    const grupoId = randomUUID()

    // Una fila por destinatario (rol o usuario), todas con el mismo grupo_id
    // para que la auditoría pueda mostrarlas como un solo evento.
    const filas: { rolId: number | null; userId: string | null }[] = [
      ...rolIds.map(rolId => ({ rolId, userId: null })),
      ...usuarios.map(userId => ({ rolId: null, userId })),
    ]

    for (const fila of filas) {
      const claveDedup = datos.dedup
        ? `${datos.dedup}:r${fila.rolId ?? ''}:u${fila.userId ?? ''}`
        : null
      const result = await query<{ id: string }>(
        `INSERT INTO notificaciones_eventos
           (user_id, rol_id, evento, titulo, mensaje, href, severidad,
            entidad_tipo, entidad_id, emitida_por, grupo_id, clave_dedup)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (clave_dedup) WHERE clave_dedup IS NOT NULL DO NOTHING
         RETURNING id`,
        [
          fila.userId, fila.rolId, evento, titulo, datos.mensaje, href, def.severidad,
          datos.entidadTipo ?? null, datos.entidadId ?? null,
          datos.emitidaPor ?? null, grupoId, claveDedup,
        ],
      )

      // Solo push si la fila se insertó de verdad: con `ON CONFLICT ... DO NOTHING`
      // y una clave de dedup repetida, el INSERT no afecta filas y no debe
      // re-notificar por push un evento que ya se mandó antes.
      if (result.rows.length === 0) continue

      // Push va sin `await`: no puede alargar la respuesta del flujo de negocio
      // que llamó a emitir(). enviarPush() ya nunca lanza (mismo contrato que
      // esta función), así que no hace falta .catch() adicional aquí.
      void enviarPush(fila.rolId, fila.userId, { titulo, mensaje: datos.mensaje, href, severidad: def.severidad })
    }
  } catch (e) {
    // Degradación silenciosa: el flujo de negocio ya se completó.
    console.error(`[notificaciones] fallo al emitir "${evento}":`, e)
  }
}
