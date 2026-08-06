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

---

# Instalación (Add to Home Screen)

Complemento de instalabilidad de la PWA, **distinto** del SW de offline que
documenta el resto de este archivo — mismo `public/sw.js`, mismo
`public/manifest.json`, no son sistemas separados. El push a dispositivo
(ver `Notificaciones.md`) depende de esta instalación en iPhone/iPad.

## Iconos maskable

- `public/icons/icon-maskable-{48,72,96,144,192,384,512}.png` + variantes
  `icon-{size}.png` generados con `sharp` desde `public/logo_sentinel.png`
  (script de un solo uso; `sharp` quedó como devDependency para regenerarlos).
- El recorte aplica la zona segura del 80% central sobre fondo `#1f355a`
  (`theme_color` del manifest): el logo (154×166, no cuadrado) se centra con
  `fit: contain` al 80% y se extiende 10% por lado.
- Por qué: Android recorta los iconos `purpose: any` en un círculo/squircle en
  el launcher; sin una variante `maskable` dedicada el logo se ve recortado.
- `public/manifest.json` mantiene los 2 iconos `any` originales intactos y
  agrega 2 entradas `maskable` (192/512).

## Componente `components/InstalarApp.tsx`

Banner fijo (bottom, `zIndex 9999`, fondo `#1f355a`) montado en
`app/layout.tsx` junto a `SwRegister`. Aparece solo cuando tiene sentido:

- **Android / desktop**: escucha `beforeinstallprompt` (solo dispara si el
  navegador considera la PWA instalable: manifest válido + SW registrado +
  HTTPS) y muestra botón "Instalar" que invoca `prompt()` del evento nativo.
- **iOS**: Safari no dispara `beforeinstallprompt`; se detecta por user-agent
  y se muestra un banner de instrucciones manuales ("Compartir → Agregar a
  inicio"), sin botón.
- **Descarte**: `sessionStorage` (`pwa-instalar-descartado`) — no es
  permanente, puede volver a aparecer en la siguiente visita si sigue sin
  instalar.
- No se muestra si ya está instalada (`display-mode: standalone` o
  `navigator.standalone`).

## Requisito para push en iOS

Safari/iPadOS solo permite Push API **con la PWA instalada al Home Screen**
(iOS 16.4+); en pestaña normal no hay push. Por eso instalabilidad y push van
juntos en este proyecto.
