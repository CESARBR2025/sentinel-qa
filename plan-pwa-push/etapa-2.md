# Etapa 2 — Capa de datos: módulo `lib/push/`

Depende de Etapa 1 (tabla y dependencia ya deben existir). Leer primero `00-contexto.md`.

Sigue el mismo patrón por capas que el resto del proyecto (ver `lib/notificaciones/` como referencia directa — mismo estilo de comentarios, mismo uso de `query()` de `lib/db.ts`, sin ORM).

## Archivo nuevo: `lib/push/types.ts`

```ts
export interface PushSubscriptionRow {
  id: string
  userId: string
  endpoint: string
  p256dh: string
  auth: string
}

/** Payload que se manda al dispositivo — mismos campos que ya usa la campanita in-app. */
export interface PayloadPush {
  titulo: string
  mensaje: string
  href: string | null
  severidad: 'info' | 'aviso' | 'critico'
}

/** Forma que manda el navegador desde `PushSubscription.toJSON()`. */
export interface SuscripcionCliente {
  endpoint: string
  keys: { p256dh: string; auth: string }
}
```

## Archivo nuevo: `lib/push/repository.ts`

```ts
import { query } from '@/lib/db'
import type { PushSubscriptionRow, SuscripcionCliente } from './types'

function rowToSuscripcion(row: Record<string, unknown>): PushSubscriptionRow {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    endpoint: String(row.endpoint),
    p256dh: String(row.p256dh),
    auth: String(row.auth),
  }
}

/** Alta o refresco de una suscripción. `endpoint` es único por dispositivo+navegador. */
export async function guardarSuscripcion(
  userId: string,
  sub: SuscripcionCliente,
  userAgent: string | null,
): Promise<void> {
  await query(
    `INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent, ultimo_uso)
     VALUES ($1, $2, $3, $4, $5, NOW())
     ON CONFLICT (endpoint) DO UPDATE SET
       user_id = EXCLUDED.user_id,
       p256dh = EXCLUDED.p256dh,
       auth = EXCLUDED.auth,
       user_agent = EXCLUDED.user_agent,
       ultimo_uso = NOW()`,
    [userId, sub.endpoint, sub.keys.p256dh, sub.keys.auth, userAgent],
  )
}

export async function eliminarSuscripcion(endpoint: string): Promise<void> {
  await query(`DELETE FROM push_subscriptions WHERE endpoint = $1`, [endpoint])
}

/** ¿Este dispositivo (endpoint) ya está suscrito? Para pintar el estado del toggle. */
export async function tieneSuscripcion(userId: string, endpoint: string): Promise<boolean> {
  const result = await query(
    `SELECT 1 FROM push_subscriptions WHERE user_id = $1 AND endpoint = $2`,
    [userId, endpoint],
  )
  return result.rows.length > 0
}

/**
 * Suscripciones de todos los destinatarios de un evento — mismo criterio de
 * audiencia que `notificaciones_eventos` (rol O usuario directo), pero acá
 * hace falta expandir el rol a personas reales porque el push va por
 * dispositivo, no por rol.
 */
export async function suscripcionesParaAudiencia(
  rolId: number | null,
  userId: string | null,
): Promise<PushSubscriptionRow[]> {
  if (!rolId && !userId) return []
  const result = await query<Record<string, unknown>>(
    `SELECT ps.id, ps.user_id, ps.endpoint, ps.p256dh, ps.auth
       FROM push_subscriptions ps
       JOIN users u ON u.id = ps.user_id
      WHERE (u.rol_id = $1 AND u.activo = true) OR ps.user_id = $2`,
    [rolId, userId],
  )
  return result.rows.map(rowToSuscripcion)
}
```

**Antes de escribir la última query**, confirmar el nombre real de la columna de estado activo en `users` (`activo` — se vio en `lib/permisos/registro.ts` y en el patrón de otras tablas del proyecto como `formato_incidencia_complemento.completado_por REFERENCES users(id)`; verificar con `\d users` o `lib/db/schema.ts` antes de asumir). Si no existe esa columna en `users` (podría estar en otra tabla), ajustar el filtro sin bloquear la etapa por eso — documentarlo si cambia.

## Archivo nuevo: `lib/push/service.ts`

```ts
import webpush from 'web-push'
import { suscripcionesParaAudiencia, eliminarSuscripcion } from './repository'
import type { PayloadPush } from './types'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

/**
 * Manda el push a todos los dispositivos de la audiencia de un evento (mismo
 * rol/usuario que ya resolvió `emisor.ts` para la notificación in-app).
 *
 * Nunca lanza — mismo contrato que `emitir()`. Un push que falla no puede
 * tumbar el flujo de negocio que lo originó (se llama sin await desde ahí).
 * Suscripciones muertas (410 Gone / 404 Not Found — el usuario revocó el
 * permiso o desinstaló) se borran en el momento.
 */
export async function enviarPush(
  rolId: number | null,
  userId: string | null,
  payload: PayloadPush,
): Promise<void> {
  try {
    const suscripciones = await suscripcionesParaAudiencia(rolId, userId)
    if (suscripciones.length === 0) return

    const body = JSON.stringify(payload)

    await Promise.all(
      suscripciones.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            body,
          )
        } catch (err) {
          const status = (err as { statusCode?: number }).statusCode
          if (status === 404 || status === 410) {
            await eliminarSuscripcion(sub.endpoint)
          } else {
            console.error('[push] fallo al enviar a', sub.endpoint, err)
          }
        }
      }),
    )
  } catch (e) {
    console.error('[push] fallo al resolver audiencia:', e)
  }
}
```

## Archivo nuevo: `lib/push/actions.ts`

```ts
'use server'

import { headers } from 'next/headers'
import { sesionConRol } from '@/lib/notificaciones/actions'
import { tryActionRaw } from '@/lib/error-handler'
import { guardarSuscripcion, eliminarSuscripcion, tieneSuscripcion } from './repository'
import type { SuscripcionCliente } from './types'

export async function suscribirPush(sub: SuscripcionCliente) {
  const ctx = await sesionConRol()
  if (!ctx) return
  const userAgent = (await headers()).get('user-agent')
  await tryActionRaw(async () => {
    await guardarSuscripcion(ctx.userId, sub, userAgent)
  })
}

export async function desuscribirPush(endpoint: string) {
  await tryActionRaw(async () => {
    await eliminarSuscripcion(endpoint)
  })
}

export async function estadoSuscripcion(endpoint: string): Promise<boolean> {
  const ctx = await sesionConRol()
  if (!ctx) return false
  return tieneSuscripcion(ctx.userId, endpoint)
}
```

`sesionConRol` hoy no está exportado como reutilizable fuera de `lib/notificaciones/actions.ts` — confirmar que el import funciona (es una función `export async function` normal en un archivo `'use server'`, así que sí es importable desde otro módulo server-side). Si Next.js se queja de reexportar algo de un archivo `'use server'` que no sea una server action pura, mover `sesionConRol` a un archivo sin la directiva (p. ej. `lib/notificaciones/sesion.ts`) y reexportarla desde `actions.ts` para no romper los imports existentes — evaluar en esta etapa, no en Etapa 5.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Los 4 archivos existen con las capas correctas, sin lógica de UI ni de negocio fuera de lugar (nada de JSX aquí).
3. Ningún archivo de `lib/notificaciones/` fue modificado en esta etapa (el enganche real es la Etapa 5).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 3.
