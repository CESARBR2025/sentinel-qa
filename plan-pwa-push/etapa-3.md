# Etapa 3 — Service worker: recibir y mostrar push

Depende de Etapa 1 (VAPID configurado, aunque el SW en sí no usa las llaves — eso es del lado servidor). No depende de Etapa 2. Leer primero `00-contexto.md`.

## Archivo a modificar: `public/sw.js`

**No reescribir el archivo.** Se agregan 2 listeners nuevos al final, sin tocar `install`/`activate`/`fetch` (esa lógica offline sigue igual). Se sube la versión para forzar actualización del SW en dispositivos que ya lo tienen cacheado:

```js
const VERSION = 'centinela-offline-v2';  // era v1 — bump para forzar update por el cambio de push
```

Agregar al final del archivo (después del listener `fetch` existente):

```js
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = { titulo: 'CENTINELA', mensaje: event.data.text() };
  }

  const { titulo = 'CENTINELA', mensaje = '', href = '/', severidad = 'info' } = payload;

  event.waitUntil(
    self.registration.showNotification(titulo, {
      body: mensaje,
      icon: '/logo_sentinel.png',
      badge: '/logo_sentinel.png',
      tag: href || undefined,
      data: { href: href || '/' },
      requireInteraction: severidad === 'critico',
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const href = event.notification.data?.href || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        const url = new URL(client.url);
        if (url.origin === self.location.origin && 'focus' in client) {
          client.navigate(href);
          return client.focus();
        }
      }
      return self.clients.openWindow(href);
    })
  );
});
```

Notas de diseño (no cambiar sin razón):
- `tag: href` — si llegan varias notificaciones al mismo destino mientras el dispositivo estaba offline, el navegador las colapsa en una sola en vez de saturar la barra de notificaciones. Es consistente con que `emisor.ts` ya deduplica por `clave_dedup` a nivel de fila in-app.
- `requireInteraction: severidad === 'critico'` — las notificaciones críticas (p. ej. `despacho.asignado`, `despacho.refuerzos`) no se auto-descartan, quedan visibles hasta que el usuario interactúa. El resto se comporta como cualquier notificación normal del sistema operativo.
- `event.data.json()` puede fallar si el payload no es JSON válido — fallback a texto plano, nunca debe tirar una excepción no capturada dentro del SW (si eso pasa, el navegador descarta el push silenciosamente sin mostrar nada, peor que mostrar algo genérico).

## Criterios de aceptación

1. `public/sw.js` conserva intacta la lógica `install`/`activate`/`fetch` existente — diff limpio, solo agrega los 2 listeners nuevos y el bump de `VERSION`.
2. `npm run build` sin errores (el SW no pasa por el bundler de Next pero verificar que no rompe nada del build).
3. Prueba manual del usuario en DevTools → Application → Service Workers → "Push" (simular push con un payload JSON de prueba) → aparece la notificación del sistema con el texto correcto.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 4.
