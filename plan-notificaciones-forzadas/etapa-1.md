# Etapa 1 — Vibración en push crítico

No depende de ninguna otra etapa. Leer primero `00-contexto.md`.

## Archivo a modificar: `public/sw.js`

Dentro del listener `push` ya existente (agregado en `plan-pwa-push/`), agregar `vibrate` al objeto de opciones de `showNotification`, condicionado a severidad crítica. Bump de `VERSION` para forzar la actualización del SW en dispositivos que ya lo tienen cacheado.

```js
const VERSION = 'centinela-offline-v3';  // era v2 — bump por el cambio de vibración
```

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
  const esCritico = severidad === 'critico';

  event.waitUntil(
    self.registration.showNotification(titulo, {
      body: mensaje,
      icon: '/logo_sentinel.png',
      badge: '/logo_sentinel.png',
      tag: href || undefined,
      data: { href: href || '/' },
      requireInteraction: esCritico,
      vibrate: esCritico ? [300, 150, 300, 150, 300] : undefined,
    })
  );
});
```

No tocar `notificationclick` ni el resto del archivo — este es el único cambio de la etapa.

Nota: `vibrate` en `NotificationOptions` solo tiene efecto en Android (Chrome/Edge/Firefox); iOS Safari lo ignora sin error — no hace falta detectar plataforma en el SW, el navegador que no lo soporta simplemente no vibra.

## Criterios de aceptación

1. Diff de `public/sw.js` limpio: solo el bump de `VERSION` y el campo `vibrate` agregado al `showNotification` existente — nada más cambia.
2. `npm run build` sin errores.
3. Prueba manual del usuario en Android: mandar un push de prueba con `severidad: "critico"` (vía DevTools → Application → Service Workers → Push, con el JSON de payload) → el dispositivo vibra además de mostrar la notificación. Con `severidad: "info"` no debe vibrar.

Detenerse aquí y esperar confirmación antes de pasar a Etapa 2.
