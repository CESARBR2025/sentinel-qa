# Etapa 5 — Enganche real: `emisor.ts` dispara push automáticamente

Depende de Etapa 2 (`enviarPush` debe existir y funcionar). Leer primero `00-contexto.md`, sección "Punto de integración". Esta es la etapa que hace que **todos los flujos de negocio existentes** (despacho 911, refuerzos, cierre con detención, evidencia solicitada, etc. — ver la lista de call sites de `emitir()` en `00-contexto.md`) empiecen a mandar push, sin tocar ninguno de esos archivos.

## Archivo a modificar: `lib/notificaciones/emisor.ts`

Import nuevo:

```ts
import { enviarPush } from '@/lib/push/service'
```

Dentro del `for (const fila of filas)` existente (línea ~68), **después** del `await query(...)` que hace el `INSERT`, agregar el disparo de push **sin `await`** (fire-and-forget — el proceso es un servidor Node persistente, `next start`, no serverless, así que esto es seguro; ver `00-contexto.md`):

```ts
for (const fila of filas) {
  const claveDedup = datos.dedup
    ? `${datos.dedup}:r${fila.rolId ?? ''}:u${fila.userId ?? ''}`
    : null
  await query(
    `INSERT INTO notificaciones_eventos
       (user_id, rol_id, evento, titulo, mensaje, href, severidad,
        entidad_tipo, entidad_id, emitida_por, grupo_id, clave_dedup)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     ON CONFLICT (clave_dedup) WHERE clave_dedup IS NOT NULL DO NOTHING`,
    [
      fila.userId, fila.rolId, evento, titulo, datos.mensaje, href, def.severidad,
      datos.entidadTipo ?? null, datos.entidadId ?? null,
      datos.emitidaPor ?? null, grupoId, claveDedup,
    ],
  )

  // Push va sin `await`: no puede alargar la respuesta del flujo de negocio
  // que llamó a emitir(). enviarPush() ya nunca lanza (mismo contrato que
  // esta función), así que no hace falta .catch() adicional aquí.
  void enviarPush(fila.rolId, fila.userId, { titulo, mensaje: datos.mensaje, href, severidad: def.severidad })
}
```

**No mover el disparo de push fuera del `for`** ni intentar agruparlo en un solo batch — cada `fila` puede tener un `rolId` o `userId` distinto (según cómo se resolvió la audiencia arriba en la función), y `enviarPush` ya resuelve internamente todas las suscripciones de esa fila puntual.

**Cuidado con `ON CONFLICT ... DO NOTHING`**: si la fila de `notificaciones_eventos` no se insertó porque ya existía (dedup), hoy el código no se entera de eso (el `INSERT` no lanza error, simplemente no afecta filas). Con este cambio, **eso significa que se mandaría push igual aunque la notificación ya existiera de un intento anterior** — duplicando el push en un reintento aunque la fila in-app esté deduplicada. Antes de dar por buena esta etapa, decidir con el usuario si esto importa para los flujos que usan `dedup` (revisar `grep -rn "dedup:" lib/*/actions.ts lib/notificaciones/checker.ts` para ver cuáles lo usan) — si importa, envolver el `INSERT` en `RETURNING id` y solo llamar a `enviarPush` cuando `result.rows.length > 0` (la fila sí se insertó). Aplicar esa versión con `RETURNING id` directamente, es la correcta — no dejar el push fuera del `if` de dedup.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. El `INSERT` usa `RETURNING id` y el push solo se dispara cuando la fila se insertó de verdad (no en un `ON CONFLICT DO NOTHING` que no afectó filas).
3. Prueba real (la hace el usuario, con push ya activado en un dispositivo desde la Etapa 4): disparar un evento real de negocio — por ejemplo asignar un despacho — y confirmar que llega la notificación push al dispositivo, con el mismo título/mensaje que la notificación in-app correspondiente.
4. Reintentar la misma acción que dispara un evento con `dedup` (si aplica al flujo probado) y confirmar que **no** llega un segundo push para el mismo evento ya deduplicado.
5. Ningún otro archivo de `lib/incidentes/`, `lib/fiscalia/`, `lib/agente_juzgado/` fue tocado — el enganche es enteramente dentro de `emisor.ts`.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 6.
