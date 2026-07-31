# Etapa 6 — Notificaciones (`despacho.en_camino`/`despacho.en_sitio`) + backfill de `hora_llegada`

> Lee primero [`00-contexto.md`](./00-contexto.md). Independiente de las Etapas 2-5 en términos de archivos (no toca el componente de mapa), pero conceptualmente depende de que el disparo automático de la Etapa 4 ya exista, porque ahora sí hay una fuente confiable que dispara estos eventos.

**Archivos a modificar:** `lib/oficial/actions.ts`, `lib/oficial/repository.ts`

## Objetivo

1. Emitir las notificaciones `despacho.en_camino`/`despacho.en_sitio` (ya definidas en el catálogo, nunca disparadas) cuando `marcarEnCaminoOficial`/`marcarEnSitioOficial` corren — ahora el despachador se entera en su campanita cuando el oficial sale y cuando llega, sin tener que refrescar el tablón.
2. Cerrar el hueco de `hora_llegada` sin backfill: hoy solo `hora_salida` tiene una red de seguridad en `insertarReporteCampo` para el caso de un cierre que nunca pasó por "en sitio" — se agrega el equivalente para `hora_llegada`.

## Parte A — Notificaciones en `lib/oficial/actions.ts`

### 1. Agregar el import de `emitir`

Imports actuales del archivo:

```ts
'use server'

import { auth }           from '@/lib/auth'
import { headers }        from 'next/headers'
import { redirect }       from 'next/navigation'
import { crearReporte }   from './service'
import { revalidatePath } from 'next/cache'
import { tryAction, tryActionRaw, AppError, ValidationError, NotFoundError, ForbiddenError, UnauthorizedError } from '@/lib/error-handler'
import { actualizarPatrullaOficial, actualizarTelefonoOficial, actualizarUbicacionOficial, telefonoExiste } from './repository'
```

Agrega:

```ts
import { emitir } from '@/lib/notificaciones/emisor'
```

### 2. `marcarEnCaminoOficial` — traer el folio y emitir al final

Código actual completo de la función:

```ts
export async function marcarEnCaminoOficial(incidenteId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  await tryActionRaw(async () => {
    const { query } = await import('@/lib/db')
    const inc = await query<{ estatus: string }>(
      `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
      [incidenteId],
    )
    if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
    if (inc.rows[0].estatus !== 'en_despacho')
      throw new ValidationError('El incidente debe estar en_despacho para marcar en camino')

    // Solo registra hora_salida — el estatus del incidente sigue en_despacho hasta "Marcar en Sitio"
    await query(
      `UPDATE incidente_despacho_unidades du
       SET hora_salida = COALESCE(du.hora_salida, NOW())
       FROM incidente_despacho d
       WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
      [incidenteId],
    )
  })

  revalidatePath('/oficial/despachos')
  revalidatePath(`/oficial/despachos/${incidenteId}`)
  revalidatePath('/incidentes')
}
```

Reemplázala por:

```ts
export async function marcarEnCaminoOficial(incidenteId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  let folioNotificar = ''

  await tryActionRaw(async () => {
    const { query } = await import('@/lib/db')
    const inc = await query<{ estatus: string; folio: string }>(
      `SELECT estatus, folio FROM incidentes WHERE id = $1 LIMIT 1`,
      [incidenteId],
    )
    if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
    if (inc.rows[0].estatus !== 'en_despacho')
      throw new ValidationError('El incidente debe estar en_despacho para marcar en camino')
    folioNotificar = inc.rows[0].folio

    // Solo registra hora_salida — el estatus del incidente sigue en_despacho hasta "Marcar en Sitio"
    await query(
      `UPDATE incidente_despacho_unidades du
       SET hora_salida = COALESCE(du.hora_salida, NOW())
       FROM incidente_despacho d
       WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
      [incidenteId],
    )
  })

  revalidatePath('/oficial/despachos')
  revalidatePath(`/oficial/despachos/${incidenteId}`)
  revalidatePath('/incidentes')

  await emitir('despacho.en_camino', {
    mensaje: `La unidad va en camino al incidente ${folioNotificar}.`,
    entidadTipo: 'incidente',
    entidadId: incidenteId,
    emitidaPor: session.user.id,
    dedup: `despacho.en_camino:${incidenteId}`,
  })
}
```

### 3. `marcarEnSitioOficial` — mismo patrón

Código actual completo de la función:

```ts
export async function marcarEnSitioOficial(incidenteId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  await tryActionRaw(async () => {
    const { query } = await import('@/lib/db')
    const inc = await query<{ estatus: string }>(
      `SELECT estatus FROM incidentes WHERE id = $1 LIMIT 1`,
      [incidenteId],
    )
    if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
    if (inc.rows[0].estatus !== 'en_despacho')
      throw new ValidationError('El incidente debe estar en_despacho para marcar en sitio')

    await query(
      `UPDATE incidentes SET estatus = 'en_sitio', actualizado_en = NOW() WHERE id = $1`,
      [incidenteId],
    )

    // Si el oficial nunca marcó "voy en camino" (ej. trayecto muy corto), hora_salida se infiere
    // aquí como respaldo — nunca pisa lo que ya haya quedado registrado.
    await query(
      `UPDATE incidente_despacho_unidades du
       SET hora_salida = COALESCE(du.hora_salida, d.fecha_hora_despacho),
           hora_llegada = COALESCE(du.hora_llegada, NOW())
       FROM incidente_despacho d
       WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
      [incidenteId],
    )
  })

  revalidatePath('/oficial/despachos')
  revalidatePath(`/oficial/despachos/${incidenteId}`)
  revalidatePath('/incidentes')
}
```

Reemplázala por:

```ts
export async function marcarEnSitioOficial(incidenteId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  let folioNotificar = ''

  await tryActionRaw(async () => {
    const { query } = await import('@/lib/db')
    const inc = await query<{ estatus: string; folio: string }>(
      `SELECT estatus, folio FROM incidentes WHERE id = $1 LIMIT 1`,
      [incidenteId],
    )
    if (!inc.rows[0]) throw new NotFoundError('Incidente no encontrado')
    if (inc.rows[0].estatus !== 'en_despacho')
      throw new ValidationError('El incidente debe estar en_despacho para marcar en sitio')
    folioNotificar = inc.rows[0].folio

    await query(
      `UPDATE incidentes SET estatus = 'en_sitio', actualizado_en = NOW() WHERE id = $1`,
      [incidenteId],
    )

    // Si el oficial nunca marcó "voy en camino" (ej. trayecto muy corto), hora_salida se infiere
    // aquí como respaldo — nunca pisa lo que ya haya quedado registrado.
    await query(
      `UPDATE incidente_despacho_unidades du
       SET hora_salida = COALESCE(du.hora_salida, d.fecha_hora_despacho),
           hora_llegada = COALESCE(du.hora_llegada, NOW())
       FROM incidente_despacho d
       WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
      [incidenteId],
    )
  })

  revalidatePath('/oficial/despachos')
  revalidatePath(`/oficial/despachos/${incidenteId}`)
  revalidatePath('/incidentes')

  await emitir('despacho.en_sitio', {
    mensaje: `La unidad llegó al incidente ${folioNotificar}.`,
    entidadTipo: 'incidente',
    entidadId: incidenteId,
    emitidaPor: session.user.id,
    dedup: `despacho.en_sitio:${incidenteId}`,
  })
}
```

Puntos clave a respetar (mismo criterio que el resto del sistema de notificaciones, ver `docs/notificaciones-oficial-despacho/00-contexto.md` si existe en el repo, o `boveda/🧩 Features/Notificaciones.md`):
- `emitir(...)` va **después** de `tryActionRaw(...)` y de los `revalidatePath`, nunca dentro de la transacción/query.
- No se pasa `usuarios`/`roles` — se deja que use el default del catálogo (`rolesPorDefecto: ['agente_despacho']`), a diferencia de `despacho.asignado` que sí necesita destinatarios puntuales. Aquí el destinatario correcto es "cualquiera con rol de despacho", no una persona específica.
- `dedup` evita duplicar si `tryActionRaw`/la acción se reintenta, pero **no** evita que se emita una vez por cada llamada legítima — si el geofence y el botón manual "LLEGUÉ" (Etapa 4) ambos intentan disparar, la guarda `estatus !== 'en_despacho'` del segundo intento lanza error antes de llegar al `emitir`, así que no hay doble notificación en ese caso tampoco.
- Si `tryActionRaw` lanza (incidente no encontrado, estatus inválido), la función corta antes de llegar al `emitir` — correcto, no debe notificarse nada si la operación falló.

## Parte B — Backfill de `hora_llegada` en `lib/oficial/repository.ts::insertarReporteCampo`

Localiza el bloque `if (data.incidenteId) { ... }` dentro de la función (dentro de la misma transacción que hace el `INSERT` del reporte). Código actual:

```ts
    if (data.incidenteId) {
      const nuevoEstatus = data.ofiHayDetencion ? 'cerrado_detencion' : 'atendido'
      await cliente.query(
        `UPDATE incidentes SET estatus = $1, actualizado_en = NOW() WHERE id = $2 AND estatus IN ('en_despacho', 'en_sitio')`,
        [nuevoEstatus, data.incidenteId],
      );

      // Red de seguridad de la Regla 3 (form-003): garantizar hora_salida por unidad al cerrar,
      // por si el oficial cerró directo desde en_despacho sin pasar por "Marcar en Sitio".
      await cliente.query(
        `UPDATE incidente_despacho_unidades du
         SET hora_salida = COALESCE(du.hora_salida, d.fecha_hora_despacho)
         FROM incidente_despacho d
         WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
        [data.incidenteId],
      );
    }
```

Agrega el backfill simétrico de `hora_llegada`, justo después del de `hora_salida`:

```ts
    if (data.incidenteId) {
      const nuevoEstatus = data.ofiHayDetencion ? 'cerrado_detencion' : 'atendido'
      await cliente.query(
        `UPDATE incidentes SET estatus = $1, actualizado_en = NOW() WHERE id = $2 AND estatus IN ('en_despacho', 'en_sitio')`,
        [nuevoEstatus, data.incidenteId],
      );

      // Red de seguridad de la Regla 3 (form-003): garantizar hora_salida por unidad al cerrar,
      // por si el oficial cerró directo desde en_despacho sin pasar por "Marcar en Sitio".
      await cliente.query(
        `UPDATE incidente_despacho_unidades du
         SET hora_salida = COALESCE(du.hora_salida, d.fecha_hora_despacho)
         FROM incidente_despacho d
         WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
        [data.incidenteId],
      );

      // Backfill simétrico para hora_llegada: si nunca se disparó "en sitio" (geofence
      // o botón manual "LLEGUÉ"), se usa el momento del cierre como mejor aproximación.
      await cliente.query(
        `UPDATE incidente_despacho_unidades du
         SET hora_llegada = COALESCE(du.hora_llegada, NOW())
         FROM incidente_despacho d
         WHERE du.despacho_id = d.id AND d.incidente_id = $1`,
        [data.incidenteId],
      );
    }
```

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores nuevos.
- [ ] Al iniciar navegación (Etapa 4), aparece una fila nueva en `notificaciones_eventos` con `evento = 'despacho.en_camino'`, `rol_id` correspondiente a `agente_despacho`, `entidad_id` = el incidente.
- [ ] Al llegar (geofence o botón manual), aparece la fila equivalente con `evento = 'despacho.en_sitio'`.
- [ ] Un usuario con rol `agente_despacho` ve ambas notificaciones en su campanita, con click llevando a `/agente_911/despacho`.
- [ ] Si `marcarEnCaminoOficial`/`marcarEnSitioOficial` lanzan un error de validación (ej. estatus ya no es `en_despacho`), no se inserta ninguna notificación.
- [ ] Cerrar un reporte de campo (`insertarReporteCampo` con `incidenteId`) para un incidente que quedó en `en_despacho` sin haber pasado nunca por `en_sitio` (simula esto forzando el cierre directo, si el flujo de la Etapa 4 lo permite, o verifícalo a nivel de función/test) — confirmar que `hora_llegada` queda poblada igual, no `NULL`.
- [ ] No se modificó el comportamiento de `insertarReporteCampo` para ningún otro campo — mismo INSERT, mismo cambio de estatus.
