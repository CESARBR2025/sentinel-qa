/* CENTINELA SSPM — Service Worker offline
 * Estrategia:
 *  - Navegaciones: network-first con fallback a /offline (sin señal, servidor caído, 5xx).
 *  - /_next/static: cache-first (archivos con hash, inmutables) → la página /offline se ve con estilos.
 *  - Resto: stale-while-revalidate.
 */
const VERSION = 'centinela-offline-v2';
const OFFLINE_URL = '/offline';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll([OFFLINE_URL]))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navegaciones (documento)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status >= 500) throw new Error('server-error');
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(OFFLINE_URL, copy));
          return response;
        })
        .catch(() =>
          caches.match(OFFLINE_URL).then((cached) => cached || Response.error())
        )
    );
    return;
  }

  // Estáticos hasheados (inmutables): cache-first
  if (url.pathname.startsWith('/_next/static')) {
    event.respondWith(
      caches.match(request).then((hit) => {
        if (hit) return hit;
        return fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
          return response;
        });
      })
    );
    return;
  }

  // Resto: stale-while-revalidate
  event.respondWith(
    caches.match(request).then((hit) => {
      const network = fetch(request)
        .then((response) => {
          if (response.ok || response.type === 'opaque') {
            const copy = response.clone();
            caches.open(VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => hit);
      return hit || network;
    })
  );
});

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
