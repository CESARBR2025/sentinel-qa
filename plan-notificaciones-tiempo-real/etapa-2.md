# Etapa 2 — Puente Service Worker → pestaña abierta (near-instant vía push)

Depende de Etapa 1 (aplicada, no es requisito técnico duro, pero no combinar
ambas en el mismo cambio). Leer primero `00-contexto.md`, sección "Gap 2".

No confundir con el plan `plan-pwa-push/` (ya ejecutado, es el que agregó push
al proyecto) — aquí **no se toca** la lógica de suscripción/envío de push, ya
existe y funciona. Esta etapa solo agrega un puente de mensajería entre el SW
y las pestañas ya abiertas.

## 1. `public/sw.js` — avisar a las pestañas abiertas cuando llega un push

Ubicar el listener `push` existente (busca `self.addEventListener('push'`).
**No reescribir el archivo** — agregar la notificación a clientes dentro del
mismo `event.waitUntil`, junto al `showNotification` que ya existe:

```js
const VERSION = 'centinela-offline-v5';  // bump — obliga a actualizar el SW cacheado
```

Dentro del listener `push`, después de calcular `payload`/`titulo`/`mensaje`/
`href`/`severidad` (variables que ya existen ahí), reemplazar el
`event.waitUntil(self.registration.showNotification(...))` actual por:

```js
event.waitUntil(
  Promise.all([
    self.registration.showNotification(titulo, {
      body: mensaje,
      icon: '/logo_sentinel.png',
      badge: '/logo_sentinel.png',
      tag: href || undefined,
      data: { href: href || '/' },
      requireInteraction: esCritico,
      vibrate: VIBRACION[severidad] || VIBRACION.info,
    }),
    // Avisa a las pestañas ya abiertas de este origen para que refresquen
    // su contador/alerta de inmediato, sin esperar al próximo poll de 30s
    // ni a que el usuario haga click en la notificación del sistema.
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) client.postMessage({ tipo: 'notificacion-push' });
    }),
  ])
);
```

No tocar `install`/`activate`/`fetch` ni el listener `notificationclick` —
quedan intactos.

## 2. `components/notificaciones/CampanillaNotificaciones.tsx` — escuchar el mensaje

Agregar un `useEffect` nuevo, junto a los que ya existen (cerca del que
controla `visible`/`document.visibilityState`), que se suscribe a los mensajes
del Service Worker y dispara el mismo `refrescarContador` que ya usa el
polling:

```ts
// Puente near-instant: cuando llega un push mientras la pestaña está
// abierta, el SW manda un postMessage — refresca de inmediato en vez de
// esperar al próximo tick del polling de 30s. Si el navegador no soporta
// service workers (o no hay uno registrado, ej. en dev), no pasa nada.
useEffect(() => {
  if (!('serviceWorker' in navigator)) return
  const onMessage = (e: MessageEvent) => {
    if (e.data?.tipo === 'notificacion-push') void refrescarContador()
  }
  navigator.serviceWorker.addEventListener('message', onMessage)
  return () => navigator.serviceWorker.removeEventListener('message', onMessage)
}, [refrescarContador])
```

Ubicarlo después de la definición de `refrescarContador` (ya es un
`useCallback`, así que es seguro como dependencia).

No agregar este mismo listener a `ContadorAsignaciones.tsx` — ese contador no
es crítico/urgente (es un badge informativo de "asignaciones activas"), no
justifica la complejidad extra; se queda solo con el Fix A de la Etapa 1. Si
el usuario pide después que también sea instantáneo, es un cambio de una
línea análogo a este, pero no lo agregues sin que lo pida.

## Criterios de aceptación

1. `public/sw.js` conserva intacta la lógica `install`/`activate`/`fetch`/
   `notificationclick` — diff limpio, solo el bump de `VERSION` y el cambio
   dentro del listener `push`.
2. `npx tsc --noEmit` y `npm run build` sin errores.
3. Prueba manual — **requiere `npm run build && npm start`** (en `npm run dev`
   el service worker no se registra, ver `components/sw-register.tsx`, así
   que este flujo no es probable ahí):
   - Dispositivo/sesión A: oficial con push **activado** (toggle en la
     campanita), con la pestaña de `/oficial` abierta y visible.
   - Dispositivo/sesión B: despachador 911 le asigna un incidente a ese
     oficial (`createDespacho` o `enviarRefuerzos`).
   - En A, el banner rojo de alerta crítica debe aparecer en 1-2 segundos,
     sin recargar ni navegar.
   - Confirmar en DevTools → Application → Service Workers que sigue
     activo el SW nuevo (`centinela-offline-v5`).
4. Con push **desactivado** en A, el mismo escenario debe seguir funcionando
   igual que antes de este plan (polling normal + el fix de la Etapa 1) — no
   debe haber ninguna regresión ni error en consola por la ausencia de SW/push.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 3.
