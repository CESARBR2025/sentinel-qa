# Plan: Sincronización casi-instantánea de notificaciones/alertas en foreground

Carpeta de trabajo para resolver un caso concreto reportado por el usuario:
el oficial de campo viendo `/oficial` no ve el banner rojo de alerta crítica
cuando 911 le asigna un despacho, mientras se queda quieto en esa página —
solo aparece si navega a otra ruta y vuelve. Diagnóstico completo en
`00-contexto.md`.

Diseñado por Claude (arquitecto), verificado contra el código real del repo
(`hooks/usePolling.ts`, `CampanillaNotificaciones.tsx`, `public/sw.js`,
`lib/notificaciones/*`) — la cadena de emisión de notificaciones (catálogo,
`emisor.ts`, repository) ya es correcta y **no se toca**; el problema es
enteramente de latencia de sincronización en el cliente. A construir por
DeepSeek (worker).

## Cómo llegó a esta forma

Se evaluó primero una solución genérica de "refresh global cada X segundos
independiente de la página" (`router.refresh()` por ruta, con un catálogo de
rutas/intervalos). Se descartó para este caso porque el usuario señaló el
riesgo real: si el oficial está a mitad de llenar un formulario cuando el
refresh dispara, podría perder datos no guardados. Este plan es más
quirúrgico — ataca solo el subsistema de notificaciones/alertas (que no tiene
inputs de usuario que perder), con dos fixes independientes: uno universal
(recuperar el foco de la pestaña refresca de inmediato) y uno near-instant
para quien ya tiene push activado (el Service Worker avisa a la pestaña
abierta en el momento exacto en que llega el push, sin esperar ningún poll).

## Orden de trabajo

Las etapas son **secuenciales**. No avanzar a la siguiente sin validar los
"Criterios de aceptación" de la anterior.

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Diagnóstico
   completo de por qué pasa (dos gaps concretos en el cliente, ninguno es un
   bug de negocio) y diseño de los dos fixes.
2. [etapa-1.md](etapa-1.md) — `hooks/usePolling.ts`: refetch inmediato al
   recuperar visibilidad de la pestaña. Universal, cubre a todos los
   consumidores del hook.
3. [etapa-2.md](etapa-2.md) — Puente Service Worker → pestaña abierta: al
   recibir un push, además de mostrar la notificación del sistema, avisa a
   las pestañas ya abiertas del mismo origen para que refresquen de
   inmediato. Near-instant, requiere push activado.
4. [etapa-3.md](etapa-3.md) — Bóveda (`Notificaciones.md`, ya existente) +
   verificación final end-to-end.

## Decisiones ya tomadas por el arquitecto (no volver a preguntar)

1. No se toca `lib/notificaciones/emisor.ts`, `catalogo.ts`, `repository.ts`
   ni ningún call site de negocio (`lib/incidentes/actions.ts`, etc.) — esa
   cadena ya es correcta, verificada línea por línea en `00-contexto.md`.
2. No se acorta el intervalo de polling global de 30s — los dos fixes
   resuelven el caso reportado sin ese costo extra de BD.
3. No se implementa SSE/WebSockets — el push+Service Worker ya existente
   cubre el caso de "pestaña abierta" sin depender de conexiones
   persistentes, y funciona igual en el QA serverless de Vercel y en la
   producción final de servidor Node propio.
4. El puente SW→pestaña (Etapa 2) solo se agrega a
   `CampanillaNotificaciones.tsx` (campanita + banner crítico), no a
   `ContadorAsignaciones.tsx` (badge informativo, no urgente).
5. No se implementa el refresh global genérico por rutas (`router.refresh()`
   con catálogo) — se evaluó y se descartó explícitamente por riesgo de
   pérdida de datos en formularios. Si se retoma esa idea en el futuro, es un
   plan aparte, con su propio análisis de qué rutas son puramente lectura.

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior.
- No tocar la lógica offline existente de `public/sw.js`
  (`install`/`activate`/`fetch`) ni el listener `notificationclick` — Etapa 2
  solo modifica el listener `push` y sube `VERSION`.
- No tocar ningún archivo de `lib/incidentes/`, `lib/notificaciones/emisor.ts`,
  `catalogo.ts` ni `repository.ts` — ya están correctos.
- Al terminar cada etapa, correr `npx tsc --noEmit` y `npm run build` como
  mínimo, más los criterios de aceptación específicos, antes de reportarla
  como lista. **Detenerse y esperar confirmación del usuario antes de
  seguir.**
- La prueba manual de la Etapa 2 requiere `npm run build && npm start` (no
  `npm run dev`) — el service worker no se registra en modo desarrollo, ver
  `components/sw-register.tsx`.
- Si el código real no coincide con lo descrito aquí (por ejemplo, el
  contenido exacto del listener `push` en `sw.js` cambió desde el
  2026-08-06), priorizar lo real, ajustar manteniendo el mismo patrón, y
  avisarlo explícitamente — no lo resuelvas en silencio.

## Fuera de alcance (no implementar salvo pedido explícito)

- Bajar el intervalo de polling global.
- SSE / WebSockets / long-polling.
- Refresh global por rutas con `router.refresh()`.
- Agregar el puente SW→pestaña a `ContadorAsignaciones.tsx` u otros
  contadores no críticos.
- Tocar la lógica de negocio de emisión de notificaciones.

## Checklist general al terminar TODAS las etapas

Ver la sección final de `00-contexto.md` y los criterios de aceptación de
`etapa-3.md`.
