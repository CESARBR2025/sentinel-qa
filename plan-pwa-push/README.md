# Plan: PWA instalable + Notificaciones Push a dispositivo

Carpeta de trabajo para dos entregables relacionados:

1. **Notificaciones push a dispositivo externo** (nuevo) — cuando ocurre un evento de negocio (despacho asignado, refuerzos, incidente cerrado con detención, evidencia solicitada, etc.), además de la notificación in-app que ya existe hoy, el sistema manda una notificación real del sistema operativo al celular/laptop del usuario, aunque no tenga la pestaña abierta. Implementado con **Web Push estándar (VAPID)**, integrado en el service worker manual que ya existe (`public/sw.js`), sin dependencias de terceros (nada de Firebase).
2. **PWA instalable** (mejora sobre lo que ya existe) — iconos maskable y un flujo de "Instalar app" (prompt nativo en Android/desktop, guía manual en iOS). Es un requisito real, no cosmético: **en iPhone/iPad, el push del punto 1 solo funciona si la PWA está instalada al Home Screen** (limitación de Safari, no de este proyecto).

Diseñado por Claude (arquitecto), verificado contra el código real del repo (`public/manifest.json`, `public/sw.js`, `lib/notificaciones/*`, `lib/auth.ts`, `lib/db/schema.ts`) — no hay BD nueva que inspeccionar más allá de la tabla que este mismo plan crea. A construir por DeepSeek (worker).

## Cómo llegó a esta forma (importante para entender las etapas)

El proyecto ya tenía dos piezas que parecían "falta hacer PWA desde cero" pero en realidad ya existían: un `manifest.json` funcional y un service worker manual que resuelve el fallback offline (`app/offline/page.tsx`, ver `boveda/🧩 Features/PWA Offline.md`). También ya existe un sistema de notificaciones in-app maduro (`lib/notificaciones/`, con `emisor.ts` como único punto donde se decide a quién le llega cada evento). El diseño de este plan parte de **reusar esas dos piezas al máximo**, no reconstruirlas: el push se agrega como 2 listeners nuevos al `sw.js` existente, y el enganche con la lógica de negocio es **un solo cambio en `emisor.ts`** — no se toca ninguno de los ~10 archivos que ya llaman a `emitir()`. Ver `00-contexto.md` para el detalle completo de por qué se eligió Web Push estándar sobre Firebase, y el mapeo de todo lo que ya existe vs. lo que se agrega.

## Orden de trabajo

Las etapas son **secuenciales** (con la excepción de la Etapa 6, que es independiente de las 2-5 pero se deja al final por orden de revisión). No avanzar a la siguiente sin validar los "Criterios de aceptación" de la anterior.

1. [00-contexto.md](00-contexto.md) — leer primero, siempre. Estado actual real del proyecto, decisión de arquitectura (Web Push vs. FCM), diseño de la tabla nueva y del punto de integración único.
2. [etapa-1.md](etapa-1.md) — Dependencia `web-push`, generación de llaves VAPID, migración `push_subscriptions`.
3. [etapa-2.md](etapa-2.md) — Capa de datos: módulo nuevo `lib/push/` (types, repository, service, actions).
4. [etapa-3.md](etapa-3.md) — Service worker: `public/sw.js` aprende a recibir push y abrir la app al hacer click en la notificación.
5. [etapa-4.md](etapa-4.md) — Cliente: toggle "Activar notificaciones en este dispositivo" dentro del dropdown de la campanita ya existente.
6. [etapa-5.md](etapa-5.md) — El enganche real: `lib/notificaciones/emisor.ts` dispara push automáticamente para todos los eventos existentes, sin tocar los call sites de negocio.
7. [etapa-6.md](etapa-6.md) — PWA instalable: iconos maskable + banner de instalación (Android/desktop con prompt nativo, iOS con instrucciones manuales).
8. [etapa-7.md](etapa-7.md) — Bóveda (ampliar `PWA Offline.md` y `Notificaciones.md`, ya existentes) + verificación final end-to-end en dispositivos reales.

## Decisiones ya tomadas por el arquitecto (no volver a preguntar)

1. **Web Push estándar (VAPID) sobre Firebase Cloud Messaging.** El SW ya es manual y sin dependencias; FCM agregaría una cuenta/SDK externo sin resolver nada que el modelo de audiencia actual (rol/usuario en `emisor.ts`) no resuelva ya.
2. El punto de integración con la lógica de negocio es **único**: dentro de `emisor.ts`, después de cada `INSERT` exitoso en `notificaciones_eventos`. Ningún otro archivo de negocio (`lib/incidentes/actions.ts`, `lib/fiscalia/actions.ts`, etc.) se toca.
3. El push se dispara **sin `await`** (fire-and-forget) porque el deploy es un servidor Node persistente (`next start`), no serverless — seguro mantener el proceso vivo después de responder al cliente. Si el proyecto migrara a un runtime serverless en el futuro, este supuesto habría que revisarlo (fuera de alcance de este plan).
4. El toggle de activar/desactivar push vive dentro del dropdown ya global de `CampanillaNotificaciones.tsx` — no se crea una pantalla de configuración nueva.
5. Payload del push: solo título + cuerpo + `href` de destino (click abre esa ruta). Sin acciones enriquecidas, sin imágenes.
6. Un usuario puede tener varias suscripciones (varios dispositivos) — todas reciben el push, cada una se limpia independientemente si el navegador la reporta muerta (404/410).
7. Los iconos maskable son una mejora deseable, no bloqueante: si el asset actual (`logo_sentinel.png`) no se presta a un recorte automático limpio, se documenta y se deja pendiente de un asset de diseño dedicado — no se fuerza un resultado feo.

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior.
- No tocar la lógica offline existente de `public/sw.js` (`install`/`activate`/`fetch`) — solo agregar los listeners `push`/`notificationclick` (Etapa 3).
- No tocar ningún archivo de `lib/incidentes/`, `lib/fiscalia/`, `lib/agente_juzgado/`, `lib/notificaciones/checker.ts` ni `lib/notificaciones/admin-actions.ts` — el enganche de push es enteramente dentro de `lib/notificaciones/emisor.ts` (Etapa 5).
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo y los criterios de aceptación específicos, antes de reportarla como lista. **Detenerse y esperar confirmación del usuario antes de seguir.**
- Si el código real no coincide con lo descrito aquí (por ejemplo, el tipo real de `users.id`, o la estructura de `app/layout.tsx`), priorizar lo real, ajustar manteniendo el mismo patrón, y avisarlo explícitamente — no lo resuelvas en silencio.
- Antes de tocar cualquier UI, leer `DESIGN.md` completo — el toggle y el banner de instalación deben verse consistentes con el resto de la app (Barlow Condensed / JetBrains Mono / Inter, paleta `#1f355a`), no inventar un estilo nuevo.
- La migración de la Etapa 1 sigue la convención de `lib/db/manual-migrations/README.md` (numeración, `IF NOT EXISTS`, correr `npm run db:schema` después) — verificar el siguiente número libre, no asumir que sigue siendo `0040`.
- Las llaves VAPID y `.env` contienen secretos reales una vez generados — no imprimirlos completos en el reporte de la etapa, confirmar solo que existen.

## Fuera de alcance (no implementar salvo pedido explícito)

- Firebase Cloud Messaging o cualquier proveedor de push de terceros.
- Panel de administración para auditar/gestionar suscripciones push de todos los usuarios.
- Notificaciones enriquecidas (botones, imágenes) o agrupación/digest de varias notificaciones en una.
- Background Sync API / sincronización en segundo plano — es un problema distinto al de push.
- Cambiar la estrategia de caché offline ya existente en `sw.js`.
- Cualquier cambio a los ~10 call sites de negocio que ya llaman `emitir()` — todos heredan push automáticamente vía la Etapa 5, sin tocarlos.

## Checklist general al terminar TODAS las etapas

Ver la sección final de `00-contexto.md` y los criterios de aceptación de `etapa-7.md`.

---

## Prompt para DeepSeek

Ver [PROMPT-DEEPSEEK.md](PROMPT-DEEPSEEK.md) — pégalo tal cual como primer mensaje.
