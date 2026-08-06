# Etapa 7 — Bóveda y verificación final

Leer primero `00-contexto.md`. Depende de todas las anteriores. Última etapa.

## Objetivo

Cerrar el checklist T2 de `AGENTS.md`: documentar los dos entregables (push + instalabilidad) ampliando los archivos de bóveda que ya existen para estas features — **no crear archivos nuevos**, ambos ya tienen doc propia.

## Archivo a modificar: `boveda/🧩 Features/PWA Offline.md`

Agregar una sección nueva al final, **"Instalación (Add to Home Screen)"**, cubriendo:
- Iconos `maskable` agregados al manifest y por qué (recorte de Android en distintos launchers).
- `components/InstalarApp.tsx`: cuándo aparece (`beforeinstallprompt` en Android/desktop, banner manual en iOS), cómo se descarta (`sessionStorage`, no permanente).
- Aclarar que esta sección es un complemento de instalación, distinto del SW de offline que ya documentaba el archivo — mismo `sw.js`, mismo `manifest.json`, no son sistemas separados.

## Archivo a modificar: `boveda/🧩 Features/Notificaciones.md`

Agregar una sección nueva, **"Push a dispositivo (Web Push / VAPID)"**, con el mismo nivel de detalle que el resto del documento (que ya es una spec portable de 987 líneas — mantener ese estilo):
- Decisión de arquitectura: Web Push estándar sobre VAPID, no FCM, y por qué (ver `00-contexto.md` de este plan).
- Tabla `push_subscriptions` y su relación con `users`.
- Que el punto de integración es un solo cambio en `emisor.ts` (`enviarPush` disparado sin `await` después de cada `INSERT` exitoso) — **todos** los eventos del catálogo existente heredan push automáticamente, no hace falta tocarlos uno por uno.
- Limitación de iOS (push solo funciona con la PWA instalada, Safari 16.4+) — marcada explícitamente como limitación de plataforma, no bug.
- `lib/push/` como módulo nuevo, mismo patrón de capas que el resto del proyecto.
- Componentes involucrados: `lib/push/{types,repository,service,actions}.ts`, `hooks/usePushSubscription.ts`, `components/notificaciones/TogglePush.tsx`, cambios en `public/sw.js` (listeners `push`/`notificationclick`) y en `lib/notificaciones/emisor.ts`.

## Archivo a modificar: `boveda/🧩 Features/Index.md`

Ampliar las entradas "PWA Offline" y "Notificaciones" para mencionar instalación/push respectivamente. No duplicar entradas ni crear una tercera para "push" — es parte de Notificaciones.

## Verificación final (todas las etapas juntas)

1. `npx tsc --noEmit` — sin errores en todo el proyecto.
2. `npm run build` — sin errores.
3. `npx graphify update`.
4. Confirmar en `git status`/`git diff` que los únicos archivos tocados son los listados en las Etapas 1-7 (en particular: ningún archivo de `lib/incidentes/`, `lib/fiscalia/`, `lib/agente_juzgado/` fue modificado — el enganche de push es enteramente vía `emisor.ts`, según Etapa 5).
5. Revisar que `.env` tiene las 4 variables VAPID con valores reales (no placeholders) y que `boveda/🛠 Stack/Variables de Entorno.md` las documenta.

## Criterios de aceptación

- Bóveda refleja ambos entregables con el mismo nivel de detalle que el resto de esas features.
- `npx tsc --noEmit` y `npm run build` limpios.
- Flujo end-to-end en dispositivo real (lo confirma el usuario): activar push desde el dropdown de notificaciones en un Android → disparar un evento de negocio real (p. ej. asignar un despacho) → notificación del sistema llega con la pestaña cerrada → tap la notificación → abre la app en la ruta correcta (`href` del evento).
- Repetir el mismo flujo en un iPhone real con la PWA instalada al Home Screen (iOS 16.4+), para confirmar el caso más restrictivo de la plataforma.
