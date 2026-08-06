Eres el worker de implementación para el repo `seguridad_publica` (Next.js 16 + Postgres, capa `lib/<modulo>/{types,repository,service,actions}.ts`, sin ORM salvo better-auth con Drizzle, deploy final en servidor Node persistente vía `next start`, QA actual en Vercel Hobby serverless).

Hay un plan ya diseñado en la carpeta `plan-notificaciones-tiempo-real/` (raíz del repo). Tu trabajo es **ejecutarlo etapa por etapa**, no rediseñarlo. Resuelve un caso concreto: un oficial de campo viendo `/oficial` no ve el banner rojo de alerta crítica cuando 911 le asigna un despacho mientras se queda quieto en esa página — solo aparece si navega a otra ruta y vuelve. El diagnóstico completo (dos gaps de latencia en el cliente, ninguno es un bug de la cadena de emisión de notificaciones, que ya es correcta) está en `00-contexto.md` — no lo reinventes ni la vuelvas a auditar, ya se verificó línea por línea.

Instrucciones:

1. Lee `plan-notificaciones-tiempo-real/README.md` completo primero.
2. Lee `plan-notificaciones-tiempo-real/00-contexto.md` completo — ahí está el diagnóstico exacto (Gap 1: `usePolling` no refresca al recuperar visibilidad de la pestaña, solo re-arma el timer; Gap 2: el push ya llega instantáneo al dispositivo pero no le avisa a una pestaña ya abierta) y el diseño de los dos fixes. No propongas alternativas (SSE, WebSockets, bajar el intervalo global) — ya se evaluaron y se descartaron explícitamente, están documentados en "Fuera de alcance".
3. Antes de escribir código, revisa con tus propios ojos el estado real de `hooks/usePolling.ts`, `components/notificaciones/CampanillaNotificaciones.tsx`, `components/oficial/ContadorAsignaciones.tsx` y `public/sw.js` (el listener `push`) — el plan describe su estado al 2026-08-06; si algo cambió, prioriza lo real, ajusta manteniendo el mismo patrón, y avísalo.
4. Ejecuta `etapa-1.md`. Al terminar, corre sus "Criterios de aceptación" (incluye una prueba manual en `npm run dev`, no necesitas producción para esta etapa). Reporta qué hiciste y **detente** — no sigas a la Etapa 2 sin que el usuario confirme.
5. Ejecuta `etapa-2.md`. Su prueba manual requiere `npm run build && npm start` (el service worker no se registra en `npm run dev`, ver `components/sw-register.tsx`) — dilo explícitamente en tu reporte si no puedes correr esa prueba tú mismo y necesitas que el usuario la confirme. Detente al terminar.
6. Ejecuta `etapa-3.md` (bóveda + verificación final). Detente al terminar — no hay etapa 4.
7. No toques `lib/notificaciones/emisor.ts`, `catalogo.ts`, `repository.ts` ni ningún archivo de `lib/incidentes/` — la cadena de emisión ya es correcta, confirmado en el diagnóstico. Si crees que hace falta tocar algo fuera de los archivos listados en cada etapa, pregunta antes.
8. En la Etapa 2, no reescribas `public/sw.js` completo — localiza el listener `push` existente y modifica solo lo que la etapa indica, conservando intacta la lógica `install`/`activate`/`fetch`/`notificationclick`.
9. Al final de cada etapa corre como mínimo `npx tsc --noEmit` y `npm run build`.

Empieza confirmando que leíste `README.md` y `00-contexto.md`, y luego arranca la Etapa 1.
