# Contexto — PWA instalable + Notificaciones Push a dispositivo

Análisis hecho por Claude (arquitecto) el 2026-08-05, contra el código real del repo (`public/manifest.json`, `public/sw.js`, `components/sw-register.tsx`, `lib/notificaciones/*`, `lib/auth.ts`, `lib/db.ts`, `lib/db/schema.ts`) y la documentación de bóveda `🧩 Features/PWA Offline.md` y `🧩 Features/Notificaciones.md`. A construir por DeepSeek (worker).

## Qué existe hoy (no se reconstruye desde cero)

**PWA (parcial)** — ver `boveda/🧩 Features/PWA Offline.md`:
- `public/manifest.json` — ya instalable en el sentido mínimo: `display: standalone`, `theme_color`, `background_color`, `start_url`, 2 iconos (192/512, `purpose: any`, ambos apuntan al mismo `logo_sentinel.png`).
- `public/sw.js` — service worker **manual, sin dependencias** (nada de Workbox/`next-pwa`). Cubre solo el fallback offline: `network-first` en navegaciones con fallback a `/offline`, `cache-first` para `/_next/static`, `stale-while-revalidate` para el resto. `VERSION = 'centinela-offline-v1'`.
- `components/sw-register.tsx` — registra `/sw.js` solo en producción (`NODE_ENV !== 'production'` se omite), montado en `app/layout.tsx`.
- `app/offline/page.tsx` — página autocontenida de "conexión perdida".
- **No hay ningún flujo de instalación** (`beforeinstallprompt`) ni guía para iOS (Safari no dispara ese evento; ahí la instalación es manual desde el menú "Compartir").
- Iconos: solo `purpose: any`, falta `purpose: maskable` (Android recorta el icono `any` en un círculo si no hay uno maskable dedicado — se ve mal en muchos launchers).

**Notificaciones in-app (completo, en producción)** — ver `boveda/🧩 Features/Notificaciones.md` y `lib/notificaciones/`:
- Modelo: `notificaciones_eventos` (evento × destinatario, rol o usuario) + `notificaciones_lecturas` (quién leyó qué, fila aparte).
- `lib/notificaciones/emisor.ts` → `emitir(evento, datos)`: resuelve audiencia (roles suscritos en BD > override explícito > default del catálogo, más usuarios directos), inserta una fila por destinatario con `grupo_id` compartido y `clave_dedup` opcional para idempotencia. **Se llama siempre después del commit de la transacción de negocio** (`await emitir(...)`, ~10 call sites reales en `lib/incidentes/actions.ts`, `lib/fiscalia/actions.ts`, `lib/agente_juzgado/actions.ts`, `lib/notificaciones/checker.ts`, `lib/notificaciones/admin-actions.ts`). Nunca lanza — degradación silenciosa con `console.error`.
- `lib/notificaciones/catalogo.ts` → `EVENTOS`: catálogo versionado en código (label, módulo, severidad, roles por defecto, `href` de destino). ~15 eventos ya definidos (911/despacho, oficial, fiscalía/juzgado, admin, prevención).
- `components/notificaciones/CampanillaNotificaciones.tsx` — dropdown global (montado en `Header.tsx` y `SubHeader.tsx`), polling cada 30s vía `usePolling`, contador de no leídas, sonido con `AudioContext`.
- `lib/notificaciones/actions.ts` → `sesionConRol()`: patrón estándar para obtener `{ userId, rolId }` de la sesión actual (`auth.api.getSession` + `getUserWithRole`). **Se reutiliza tal cual para las acciones de suscripción push.**
- Auth: `better-auth` con adapter Drizzle (`lib/db/schema.ts`, tabla `users` con `rolId`). Las queries crudas del proyecto (`lib/db.ts`, `pg` Pool) coexisten con Drizzle — solo para auth. El resto de módulos (incluido `notificaciones` y el nuevo `push`) usa `query()` de `lib/db.ts` con SQL crudo, **no Drizzle**.
- Deploy: `next start` (servidor Node persistente, no serverless/Vercel) — el pool de `pg` es un singleton en `globalThis`. Esto importa para el diseño del push: **se puede disparar el envío sin bloquear la respuesta** (fire-and-forget dentro de `emitir()`), porque el proceso sigue vivo después de responder al cliente — en un entorno serverless esto no sería seguro.

## Qué falta: dos entregables distintos, una sola carpeta de plan

### 1. Push notifications a dispositivo externo (lo nuevo, el grueso del plan)

**Decisión de arquitectura: Web Push estándar (VAPID), no Firebase Cloud Messaging.**

Por qué:
- El `sw.js` ya es manual y sin dependencias — Web Push se integra ahí con 2 listeners nuevos (`push`, `notificationclick`), sin reescribir nada de la lógica offline existente.
- No agrega una cuenta/proyecto externo (Firebase) ni un SDK cliente pesado.
- El modelo de audiencia (rol o usuario, resuelto en `emisor.ts`) ya resuelve lo que FCM ofrecería vía "topics" — no hay necesidad real de esa capa.
- Es el estándar soportado nativamente por todos los navegadores modernos vía Push API + Notifications API.

**Limitación real a comunicar al usuario final (no es un bug del plan, es la plataforma):**
- Android (Chrome/Edge/Firefox): push funciona **sin necesidad de instalar la PWA**, basta con conceder el permiso de notificaciones.
- iOS/iPadOS Safari: push **solo funciona si la PWA está instalada al Home Screen** (Safari 16.4+, iOS 16.4+). Safari en pestaña normal no soporta Push API. Por eso este plan **incluye también** la mejora de instalabilidad (punto 2) — sin eso, push simplemente no existe en iPhone/iPad, que es hardware real que usan oficiales de campo.
- Desktop: Chrome/Edge/Firefox soportan push en pestaña normal, sin instalar. Safari desktop lo soporta desde macOS 13 (Ventura) — con matices, no se optimiza para ese caso específico, se degrada con gracia (permiso denegado o no soportado → simplemente no se muestra el toggle).

**Librería**: [`web-push`](https://www.npmjs.com/package/web-push) (npm) — implementa el protocolo Web Push (VAPID + cifrado del payload) en Node. Incluye CLI `web-push generate-vapid-keys` para generar el par de llaves. No está instalada hoy (`package.json` no la tiene).

**Tabla nueva: `push_subscriptions`**

```sql
CREATE TABLE push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint text NOT NULL UNIQUE,
  p256dh text NOT NULL,
  auth text NOT NULL,
  user_agent text,
  creado_en timestamptz NOT NULL DEFAULT NOW(),
  ultimo_uso timestamptz
);
```

- `endpoint` es único por diseño del navegador (una URL propia del push service — FCM para Chrome/Edge/Android, Mozilla para Firefox, Apple para Safari — por dispositivo+navegador+origen). `UNIQUE` evita duplicar la misma suscripción si el usuario repite el toggle.
- Un usuario puede tener **varias filas** (celular + laptop + tablet) — el fan-out manda a todas.
- `ON DELETE CASCADE`: si se borra un usuario, sus suscripciones se van con él (igual patrón que otras FKs a `users` en el proyecto, ver `formato_incidencia_complemento.completado_por`).
- `user_id` es `text` (no `uuid`) porque así es `users.id` en el schema de better-auth (`lib/db/schema.ts`) — confirmar tipo exacto en Etapa 1 antes de escribir la migración.

**Módulo nuevo `lib/push/`** (mismo patrón por capas que el resto del proyecto):
```
lib/push/
├── types.ts       — PushSubscriptionRow, PayloadPush
├── repository.ts  — guardarSuscripcion, eliminarSuscripcion, suscripcionesParaAudiencia(rolId, userId)
├── service.ts      — enviarPush(rolId, userId, payload) — usa web-push, limpia suscripciones muertas (404/410)
└── actions.ts      — 'use server': suscribirPush(subscriptionJSON), desuscribirPush(endpoint) — reutilizan sesionConRol() de lib/notificaciones/actions.ts
```

**Punto de integración — un solo cambio en código ya existente**: `lib/notificaciones/emisor.ts`, dentro de `emitir()`, después del `INSERT` de cada fila en `notificaciones_eventos`, disparar (sin `await`, con su propio try/catch interno) `enviarPush(fila.rolId, fila.userId, { titulo, mensaje: datos.mensaje, href, severidad: def.severidad })`. Con esto, **los ~10 call sites de negocio que ya emiten notificaciones (despacho 911, refuerzos, cierre con detención, evidencia solicitada, etc.) ganan push automáticamente**, sin tocar ni uno de esos archivos.

**Cliente**: hook/UI para pedir permiso (`Notification.requestPermission()`) y suscribirse (`registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: <VAPID public key> })`). Vive como un ítem nuevo dentro del dropdown de `CampanillaNotificaciones.tsx` (componente ya global, montado en cada página vía `Header`/`SubHeader`) — no se crea una pantalla de configuración nueva.

**`sw.js`**: agregar (no reescribir) `self.addEventListener('push', ...)` que muestra la notificación (`self.registration.showNotification(titulo, { body, icon: '/logo_sentinel.png', data: { href } })`) y `self.addEventListener('notificationclick', ...)` que enfoca/abre la app en `event.notification.data.href`. Bump de `VERSION` para forzar la actualización del SW instalado en los dispositivos que ya lo tienen cacheado.

**Env vars nuevas** (agregar a `.env` y a `boveda/🛠 Stack/Variables de Entorno.md`):
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` — par generado con `npx web-push generate-vapid-keys`.
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` — la misma pública, expuesta al cliente (necesaria para `pushManager.subscribe`).
- `VAPID_SUBJECT` — `mailto:` o URL de contacto, requerido por el protocolo VAPID (identifica al remitente ante los push services).

### 2. PWA instalable (complemento necesario para que push funcione en iOS, y mejora de UX en Android/desktop)

- `manifest.json`: agregar icono(s) `purpose: maskable` (Android) y tamaños intermedios recomendados (48/72/96/144/384) — generados desde `public/logo_sentinel.png` con un script Node de un solo uso (`sharp`, no está instalado hoy, se agrega como devDependency temporal o se corre con `npx sharp-cli` sin instalar).
- Componente "Instalar app": escucha `beforeinstallprompt` (dispara en Android/Chrome/Edge cuando el navegador considera la PWA instalable — requiere manifest válido + SW registrado + servidor HTTPS, todo lo cual ya existe) y muestra un botón. En iOS ese evento no existe — se muestra en su lugar un banner con instrucciones manuales ("Compartir → Agregar a pantalla de inicio"), detectado por user-agent.

## Fuera de alcance (no implementar salvo pedido explícito)

- Firebase Cloud Messaging / cualquier SDK de push de terceros.
- Pantalla de administración para ver/gestionar todas las suscripciones push de todos los usuarios (auditoría) — el admin ya tiene la matriz evento×rol para las notificaciones in-app; push hereda esa misma audiencia, no se duplica.
- Notificaciones push con acciones enriquecidas (botones dentro de la notificación, imágenes grandes) — solo título + cuerpo + click-to-open, igual de simple que la notificación in-app de hoy.
- Cambiar la estrategia de caché offline existente en `sw.js` (network-first/cache-first/stale-while-revalidate) — solo se agregan los 2 listeners de push, no se toca `install`/`activate`/`fetch`.
- Sincronización en background (`sync` event / Background Sync API) — no se pidió, es un problema distinto al de push.
- Digest/agrupación de notificaciones (varias notificaciones colapsadas en una) — cada evento manda su propio push, igual que hoy cada evento genera su propia fila in-app.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update`.
3. `npm run db:schema` después de aplicar la migración de Etapa 1.
4. Bóveda actualizada (Etapa 7): ampliar `PWA Offline.md` (sección instalación) y `Notificaciones.md` (sección push) — no crear archivos nuevos, son extensiones de features ya documentadas.
5. Prueba manual (la hace el usuario): activar push en un dispositivo Android real, disparar un evento real (p. ej. crear un despacho), confirmar que llega la notificación del sistema aunque la pestaña esté cerrada; repetir instalando la PWA en un iPhone real (iOS 16.4+) para confirmar el caso más restrictivo.
