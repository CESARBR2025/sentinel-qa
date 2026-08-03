# PWA Offline — páginas propias ante caída de señal / crash

**Propósito**: cuando se va la señal, el servidor cae o la app falla, sustituir
la página genérica del navegador (ERR_INTERNET_DISCONNECTED / "Site can't be
reached" / error de Next) por una página propia del sistema, estética login
claro CENTINELA.

## Cómo funciona

Un **service worker manual** (`public/sw.js`, sin dependencias) intercepta las
navegaciones y, cuando la red falla, responde con una página `/offline` cacheada.
Además, `app/error.tsx` y `app/global-error.tsx` cubren los crash de la app
(500 / runtime) con una página propia.

```
red OK        → respuesta normal
sin señal     → SW responde /offline (cacheado al instalar)
servidor 5xx  → SW responde /offline
crash runtime → error.tsx (rutas) / global-error.tsx (layout raíz)
```

## Archivos

| Archivo | Rol |
|---------|-----|
| `public/sw.js` | Service worker: precachea `/offline` en `install`; `network-first` en navegaciones con fallback a `/offline` (falla de red o `status >= 500`); `cache-first` para `/_next/static` (hasheados, inmutables → la página offline sale con estilos); `stale-while-revalidate` para el resto. `activate`: limpia cachés viejas + `clients.claim()`. |
| `app/offline/page.tsx` | Página "CONEXIÓN PERDIDA" (client, **autocontenida**: estilos inline en `<style>`, escudo SVG inline, sin dependencias de red). Detecta `navigator.onLine` para distinguir "sin conexión a internet" vs "el servicio no responde". Botón **Reintentar** (`location.reload()`) + auto-recarga al volver la señal (listener `online`). Reloj en vivo. |
| `components/sw-register.tsx` | Registra `/sw.js` **solo en producción** (en dev se omite para no cachear el dev server). Montado en `app/layout.tsx`. |
| `public/manifest.json` | PWA manifest: `display: standalone`, `theme_color: #1f355a`, `background_color: #f8fafc`, icono `logo_sentinel.png`. Enlazado vía metadata `manifest` en `app/layout.tsx` (+ `themeColor`, `appleWebApp`). |
| `app/error.tsx` | Fallback de error de rutas (client). Recibe `error` + `unstable_retry` (Next 16.2+; antes era `reset`). Botones **Reintentar** (`unstable_retry()`) y **Volver al inicio** (`/dashboard`). Muestra `error.digest`. |
| `app/global-error.tsx` | Fallback del layout raíz (client). **Debe incluir su propio `<html>`/`<body>`** (convención App Router, ver `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`). |

## Config relacionada

- `proxy.ts`: `/offline` agregado a `PUBLIC_PATHS` (sin sesión, lo sirve el SW
  desde caché). El matcher excluye `.json` (nuevo) → `manifest.json` no pasa por
  el gate de auth.
- Next 16.2.4: los callbacks de reintento de `error.tsx`/`global-error.tsx` son
  `unstable_retry` (no `reset`), añadido en v16.2.0.

## Verificación

- `npx tsc --noEmit` y `npm run build`: `/offline` queda prerendered estático (○),
  se sirve `200` sin sesión.
- `npm start` + DevTools → Network → **Offline** → navegar → aparece `/offline`
  con estilos. Detener el servidor → misma prueba.
- Lógica del SW cubierta por test de mocks (Cache Storage API): install
  precachea `/offline`; navigate + red caída → `/offline`; navigate + 5xx →
  `/offline`; navigate OK → red; `_next/static` cache-first; imagen sin cachear
  sin red → no crash (fallback browser); POST ignorado.

## Limitaciones

- Si el **primer acceso** ya es offline (SW nunca instalado), el navegador igual
  muestra su página genérica: no hay forma de interceptar sin SW registrado.
- La página `/offline` se ve bien con fuentes de fallback si Google Fonts
  (JetBrains Mono / Barlow Condensed) no están cacheadas por el navegador.
- El SW solo aplica a navegadores que soporten service workers (Chrome, Edge,
  Firefox, Safari 11.1+; no en navegadores sin soporte).
