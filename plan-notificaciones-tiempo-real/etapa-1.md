# Etapa 1 — `usePolling`: refetch inmediato al recuperar visibilidad

No depende de nada. Leer primero `00-contexto.md`, sección "Gap 1".

## Archivo a modificar: `hooks/usePolling.ts`

Estado actual:

```ts
'use client'
import { useEffect, useRef } from 'react'

export function usePolling(fn: () => void, intervalMs: number, activo = true) {
  const fnRef = useRef(fn)
  fnRef.current = fn

  useEffect(() => {
    if (!activo) return
    const id = setInterval(() => fnRef.current(), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, activo])
}
```

Cambiar a:

```ts
'use client'
import { useEffect, useRef } from 'react'

export function usePolling(fn: () => void, intervalMs: number, activo = true) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  // false en el primer render: el consumidor ya hace su propio fetch
  // inmediato al montar (patrón repetido en CampanillaNotificaciones y
  // ContadorAsignaciones), así que aquí NO se dispara fn() la primera vez
  // que activo es true, para no duplicar esa llamada inicial.
  const yaActivadoAntesRef = useRef(false)

  useEffect(() => {
    if (!activo) return
    // A partir de la segunda vez que activo pasa a true (ej. la pestaña
    // recupera visibilidad tras estar oculta/bloqueada), refresca de
    // inmediato en vez de esperar a que corra el próximo tick del
    // intervalo — sin esto, volver a la pestaña puede esperar hasta
    // intervalMs completos aunque haya algo nuevo esperando.
    if (yaActivadoAntesRef.current) fnRef.current()
    yaActivadoAntesRef.current = true

    const id = setInterval(() => fnRef.current(), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, activo])
}
```

No tocar la firma pública (`fn, intervalMs, activo`) — los dos consumidores
actuales (`CampanillaNotificaciones.tsx`, `ContadorAsignaciones.tsx`) no
necesitan ningún cambio, el fix vive enteramente dentro del hook.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores nuevos.
2. `npm run build` sin errores.
3. Prueba manual (`npm run dev` alcanza, no depende del service worker):
   - Abrir `/oficial` (o cualquier página con la campanita) con DevTools →
     Network abierto, filtrando por `contador`.
   - Cambiar a otra pestaña del navegador (o minimizar) por 10+ segundos.
   - Volver a la pestaña de la app.
   - Debe verse una request nueva a `/api/notificaciones/contador`
     disparada **inmediatamente** al volver, sin esperar a completar los 30s
     del intervalo.
4. Confirmar que en el montaje inicial de la página **no** se duplica el
   fetch (debe seguir viéndose solo una request a `contador` al cargar, no
   dos seguidas).

Detenerse aquí y esperar confirmación antes de pasar a Etapa 2.
