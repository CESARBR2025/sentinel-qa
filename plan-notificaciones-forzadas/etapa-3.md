# Etapa 3 — Escalación: reenviar push si una crítica sigue sin leer

No depende de las Etapas 1-2. Leer primero `00-contexto.md`.

## 0. Verificación previa — el cron puede no estar corriendo todavía

`boveda/🧩 Features/Notificaciones.md` documenta que `/api/cron/notificaciones` **no se autoinvoca** — necesita un disparador externo (Vercel Cron u otro) con el schedule recomendado `*/20 * * * *`. **No existe `vercel.json` en la raíz del repo** con una sección `crons` — esto significa que, salvo que el disparador esté configurado directamente en el dashboard de Vercel (Project → Settings → Cron Jobs) fuera del repo, es posible que `generarAlertasBusquedas()` y `purgarAntiguas()` **tampoco estén corriendo hoy en producción**, y la escalación de esta etapa heredaría el mismo problema.

Antes de dar por buena esta etapa:
1. Verificar en el dashboard de Vercel del proyecto si ya hay un Cron Job apuntando a `/api/cron/notificaciones`. Si existe, confirmar el schedule real (no asumir `*/20 * * * *`).
2. Si no existe, crear `vercel.json` en la raíz con:
   ```json
   {
     "crons": [
       { "path": "/api/cron/notificaciones", "schedule": "*/5 * * * *" }
     ]
   }
   ```
   Se recomienda `*/5 * * * *` (cada 5 minutos) en vez de los `*/20` documentados originalmente — la escalación de críticas pierde sentido si el propio cron solo corre cada 20 minutos (un despacho crítico esperaría hasta 25-40 min por su reintento). **Confirmar antes con el usuario si el plan de Vercel del proyecto permite ese intervalo** (Hobby limita la frecuencia de cron; Pro la permite) — si no lo permite, usar el intervalo más corto disponible y ajustar `UMBRAL_ESCALACION_MINUTOS` (paso 3 de abajo) para que sea coherente con esa cadencia real, documentando el ajuste.
3. Si ya existe un cron configurado fuera del repo (dashboard), no crear `vercel.json` (evitar doble programación) — solo confirmar y documentar el schedule real encontrado.

## 1. Migración: columna de control de reenvío

Verificar el siguiente número libre en `lib/db/manual-migrations/` (al momento de diseñar este plan, el último aplicado era `0041_push_subscriptions.sql`, pero **puede haber avanzado** por trabajo de otros planes en paralelo — no asumir `0042` sin verificar con `ls lib/db/manual-migrations | sed -E 's/^([0-9]+)_.*/\1/' | sort -n | tail -1`).

`lib/db/manual-migrations/0042_notificaciones_escalacion.sql` (ajustar número según el paso anterior):

```sql
-- Marca cuándo se reenvió el push de una notificación crítica que nadie había
-- leído (un solo reintento, no reenvío infinito). NULL = no escalada todavía.
-- Ver 00-contexto.md del plan plan-notificaciones-forzadas/.

ALTER TABLE notificaciones_eventos ADD COLUMN IF NOT EXISTS push_reescalado_en timestamptz;
```

Correr `npm run db:schema` después de aplicarla.

## 2. Archivo a modificar: `lib/notificaciones/repository.ts`

Agregar al final del archivo:

```ts
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
 * significa que NADIE del rol la ha visto — es una simplificación deliberada
 * (no se pide que cada integrante individual la haya leído), documentada en
 * 00-contexto.md.
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
```

## 3. Archivo a modificar: `lib/notificaciones/checker.ts`

Agregar, junto a `generarAlertasBusquedas`:

```ts
import { enviarPush } from '@/lib/push/service'
import { candidatasEscalacion, marcarEscalada } from './repository'

// Cuánto tiempo sin ninguna lectura antes de reintentar el push. Ajustar solo
// junto con el schedule real del cron (ver README del plan) — escalar antes
// de lo que el cron puede detectar no tiene efecto.
const UMBRAL_ESCALACION_MINUTOS = 5

/**
 * Reenvía el push de notificaciones críticas que nadie ha leído después de
 * UMBRAL_ESCALACION_MINUTOS. Un solo reintento por notificación (marcado con
 * push_reescalado_en) — no es un reenvío infinito.
 */
export async function escalarCriticasSinLeer(): Promise<number> {
  const candidatas = await candidatasEscalacion(UMBRAL_ESCALACION_MINUTOS)
  let escaladas = 0
  for (const c of candidatas) {
    try {
      await enviarPush(c.rolId, c.userId, {
        titulo: `⚠ ${c.titulo}`,
        mensaje: c.mensaje,
        href: c.href,
        severidad: 'critico',
      })
      await marcarEscalada(c.id)
      escaladas++
    } catch (e) {
      console.error('[notificaciones] fallo al escalar', c.id, e)
    }
  }
  return escaladas
}
```

El prefijo `⚠ ` en el título del reenvío es deliberado — para que quien sí llegue a ver ambas notificaciones (la original y la escalada) entienda que es un recordatorio, no un evento nuevo distinto.

## 4. Archivo a modificar: `app/api/cron/notificaciones/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { generarAlertasBusquedas, escalarCriticasSinLeer } from '@/lib/notificaciones/checker'
import { obtenerRetencionDias, purgarAntiguas } from '@/lib/notificaciones/repository'

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    if (req.headers.get('authorization') !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'CRON_SECRET no configurado' }, { status: 503 })
  }

  const alertas = await generarAlertasBusquedas()
  const escaladas = await escalarCriticasSinLeer()
  const dias = await obtenerRetencionDias()
  const purgadas = await purgarAntiguas(dias)

  return NextResponse.json({ alertasGeneradas: alertas, escaladas, purgadas, retencionDias: dias })
}
```

Solo se agrega la llamada a `escalarCriticasSinLeer()` y el campo `escaladas` en la respuesta — el resto de la ruta queda igual.

## Criterios de aceptación

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. Confirmado (y documentado en el reporte de esta etapa) si el cron ya estaba configurado en Vercel o si se agregó `vercel.json` — con el schedule real que va a correr en producción.
3. `curl -H "Authorization: Bearer $CRON_SECRET" https://<dominio>/api/cron/notificaciones` (o en local con `CRON_SECRET` de `.env`) responde `200` con `escaladas` en el JSON.
4. Prueba real (la hace el usuario): generar un evento crítico real (p. ej. `despacho.asignado`), no leerlo, esperar más de `UMBRAL_ESCALACION_MINUTOS` y una corrida del cron → confirmar que llega un segundo push con el prefijo `⚠`, y que `push_reescalado_en` de esa fila en `notificaciones_eventos` ya no es `NULL`.
5. Repetir la prueba sin marcarla como leída después del reenvío → confirmar que **no** llega un tercer push (la condición `push_reescalado_en IS NULL` ya no aplica).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 4.
