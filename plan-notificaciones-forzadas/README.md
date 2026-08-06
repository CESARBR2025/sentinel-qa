# Plan: Notificaciones críticas más visibles + permisos obligatorios (Oficial de Campo)

Continuación directa de `plan-pwa-push/` (ya implementado y en producción en Vercel). Cubre dos pedidos del usuario, con alcance distinto cada uno:

1. **Notificaciones críticas más difíciles de ignorar** — alcance: todo el sistema, cualquier rol. Vibración en el push (Android), un banner de pantalla completa que interrumpe la app aunque el usuario esté en otra sección (no solo la campanita), reenvío automático del push si una crítica sigue sin leerse después de un umbral, y contador en el título de la pestaña del navegador.
2. **Modal obligatorio de ubicación + notificaciones activas** — alcance: **solo Oficial de Campo** (confirmado explícitamente con el usuario), bloqueo total sin excepción — el oficial no puede usar el sistema sin ambos permisos concedidos.

Diseñado por Claude (arquitecto), verificado contra el código real (`lib/notificaciones/`, `components/oficial/OficialUbicacionTracker.tsx`, `hooks/usePushSubscription.ts`, `app/api/cron/notificaciones/route.ts`) y la BD real (esquema de `notificaciones_eventos`/`notificaciones_lecturas`, consultado en vivo). A construir por DeepSeek (worker).

## Cómo llegó a esta forma

El usuario pidió originalmente "hacer las notificaciones más forzosas" y "un modal que no se quite si ubicación/notificaciones no están activos", ambas descritas como "vitales" para el sistema. Antes de diseñar, se investigó qué ya existía (para no reconstruir nada) y se encontraron dos piezas clave: (1) ya hay tracking de ubicación real en producción, pero **solo para Oficial de Campo** (`app/oficial/layout.tsx`) — es el único rol donde la ubicación tiene un consumidor real (el mapa de cercanía del despacho); (2) el toggle de push del plan anterior ya expone todo lo necesario (`usePushSubscription`) para construir el modal sin reinventar el flujo de suscripción. Con eso, se le preguntó al usuario si el modal bloqueante debía aplicar a todos los roles o solo a Oficial — confirmó que solo Oficial, con bloqueo total sin salida de emergencia. Ver `00-contexto.md` para el detalle completo.

## Orden de trabajo

Las etapas 1-4 son independientes entre sí (se pueden ejecutar en cualquier orden), pero se dejan numeradas para facilitar la revisión secuencial. La Etapa 5 depende de todas.

1. [00-contexto.md](00-contexto.md) — leer primero, siempre.
2. [etapa-1.md](etapa-1.md) — Vibración en push crítico (`public/sw.js`).
3. [etapa-2.md](etapa-2.md) — Alerta in-app de pantalla completa + contador en el título de la pestaña.
4. [etapa-3.md](etapa-3.md) — Escalación: reenviar push si una crítica sigue sin leer (incluye verificar si el cron de Vercel ya está configurado — hallazgo importante, ver la etapa).
5. [etapa-4.md](etapa-4.md) — Guardia de permisos obligatorios para Oficial de Campo (la pieza central del plan).
6. [etapa-5.md](etapa-5.md) — Bóveda + verificación final.

## Decisiones ya tomadas por el usuario (no volver a preguntar)

1. El modal de permisos obligatorios aplica **solo a Oficial de Campo** — ningún otro rol se ve afectado. Es el único rol con un consumidor real de la ubicación (el despacho).
2. Bloqueo **total**, sin botón de "continuar sin esto" — si falta ubicación o push, el oficial no puede usar nada del sistema.
3. Un solo reintento de push para críticas sin leer (no reenvío infinito) — evita que esto se vuelva spam si de verdad el dispositivo tiene las notificaciones bloqueadas a nivel de sistema operativo.
4. La alerta de pantalla completa (Etapa 2) solo aplica a `severidad: 'critico'` — no se toca el comportamiento de `info`/`aviso`.

## Reglas para quien construye (DeepSeek)

- No combinar etapas ni adelantar trabajo de una etapa posterior.
- No aplicar el guard de la Etapa 4 a ningún layout que no sea `app/oficial/layout.tsx`.
- No agregar un botón de "continuar sin esto" al modal de la Etapa 4 — el usuario pidió explícitamente bloqueo total.
- Al terminar cada etapa, correr `npx tsc --noEmit` como mínimo y los criterios de aceptación específicos, antes de reportarla como lista. **Detenerse y esperar confirmación del usuario antes de seguir.**
- La Etapa 3 requiere verificar si el cron de `/api/cron/notificaciones` ya está corriendo en producción (dashboard de Vercel) antes de asumir que la escalación va a dispararse sola — no es un supuesto trivial, revisar la sección "0. Verificación previa" de esa etapa con cuidado.
- Si el código real no coincide con lo descrito aquí, priorizar lo real, ajustar manteniendo el mismo patrón, y avisarlo explícitamente — no lo resuelvas en silencio.
- Antes de cualquier cambio de UI, leer `DESIGN.md` completo — el banner crítico y el modal de permisos deben verse consistentes con el resto de la app.
- La migración de la Etapa 3 sigue la convención de `lib/db/manual-migrations/README.md` — verificar el siguiente número libre antes de nombrar el archivo, no asumir que sigue siendo `0042` (puede haber avanzado por trabajo de otros planes en paralelo).

## Fuera de alcance (no implementar salvo pedido explícito)

- Aplicar el modal de permisos obligatorios a algún rol que no sea Oficial de Campo.
- Botón de "continuar sin esto" / salida de emergencia en el modal.
- Tracking de ubicación en background — sigue foreground-only, sin cambios a esa lógica.
- Reenvíos múltiples de push escalado (más de uno).
- Panel de administración para configurar el umbral de escalación — queda como constante en código.
- Tocar el comportamiento de notificaciones `info`/`aviso`.

## Checklist general al terminar TODAS las etapas

Ver la sección final de `00-contexto.md` y los criterios de aceptación de `etapa-5.md`.

---

## Prompt para DeepSeek

Ver [PROMPT-DEEPSEEK.md](PROMPT-DEEPSEEK.md) — pégalo tal cual como primer mensaje.
