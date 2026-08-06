# Contexto — Notificaciones críticas más visibles + permisos obligatorios (Oficial de Campo)

Análisis hecho por Claude (arquitecto) el 2026-08-05, contra el código real del repo y la BD real (`notificaciones_eventos`, `notificaciones_lecturas`, consultadas en vivo por `pg`/`DATABASE_URL`). Continuación directa de `plan-pwa-push/` (ya implementado y en producción en Vercel) — este plan **reutiliza sus piezas**, no las reconstruye: `lib/push/service.ts` (`enviarPush`), el catálogo de eventos, el toggle de push (`usePushSubscription`), y el sistema de tracking de ubicación que **ya existía antes de este plan**. A construir por DeepSeek (worker).

## Por qué existen dos partes distintas en un solo plan

El usuario pidió dos cosas relacionadas pero con alcance distinto, aclarado con el usuario antes de diseñar:

1. **Notificaciones críticas más difíciles de ignorar** — alcance: **todo el sistema**, cualquier rol. Ya existen 5 eventos con `severidad: 'critico'` en el catálogo (`lib/notificaciones/catalogo.ts`): `despacho.asignado`, `despacho.refuerzos`, `incidente.cerrado_detencion`, `busqueda.creada`, `busqueda_plazo`. Hoy, "crítico" solo significa color rojo en la campanita + `requireInteraction: true` en el push (no se auto-descarta) — pero si el usuario nunca vio el push (dispositivo apagado, notificaciones del navegador silenciadas a nivel SO, etc.) no hay ningún reintento ni alerta más fuerte dentro de la propia app.

2. **Modal obligatorio de ubicación + notificaciones activas** — alcance: **solo Oficial de Campo**, confirmado explícitamente con el usuario, y con bloqueo total (sin botón de "continuar sin esto"). La razón del alcance acotado: ya existe un sistema real de tracking de ubicación (`components/oficial/OficialUbicacionTracker.tsx`, montado únicamente en `app/oficial/layout.tsx`) que reporta la posición del oficial cada 30s al despachador — es el único rol donde la ubicación tiene un consumidor real (`AsignacionMapa.tsx`, mapa de cercanía del despacho). Pedirle este mismo permiso a Fiscalía/Juzgado/Admin no tendría ningún propósito funcional, así que no se generaliza.

## Parte 1 — Qué existe hoy (no se reconstruye)

**Push crítico** — `public/sw.js` (del plan `plan-pwa-push/`, ya en prod):
```js
requireInteraction: severidad === 'critico'
```
Mantiene la notificación visible hasta que el usuario interactúa — pero solo si el push llegó y el dispositivo lo mostró. No hay vibración, no hay reintento.

**In-app** — `components/notificaciones/CampanillaNotificaciones.tsx`: polling cada 30s (`INTERVALO_MS`) contra `/api/notificaciones/contador` (solo trae el conteo de no leídas, query barata a propósito). Si el conteo sube, suena `sonarAlerta()` (4 tonos con `AudioContext`) y sacude el ícono de la campana — pero **solo si el usuario está viendo esa pestaña**, y es el mismo sonido sin importar la severidad. No hay ninguna alerta visual más allá del ícono — si el usuario está en otra sección de la app, un evento crítico no interrumpe nada, solo espera pasivamente a que abra el dropdown.

**Ubicación** — `components/oficial/OficialUbicacionTracker.tsx`, montado en `app/oficial/layout.tsx`:
- `OficialUbicacionProvider` llama `navigator.geolocation.watchPosition(...)` automáticamente al montar (dispara el prompt del navegador solo). Heartbeat cada 30s vía `reportarUbicacionOficial(lat, lng)`.
- Expone `useUbicacionOficial()`: `{ posicionActual, ultimoEnvio, segundosParaProximoEnvio, permisoDenegado, soportado }`.
- Si `permisoDenegado`, hoy solo aparece un toast pequeño, **descartable** ("Ubicación no disponible — el despachador no podrá verte en el mapa de cercanía."), en la esquina — el oficial puede cerrarlo y seguir usando la app sin ubicación real.
- `components/oficial/MiUbicacionSection.tsx` (en `/oficial/configuracion`) consume el mismo contexto para mostrar el estado — referencia de estilo para el modal nuevo.

**Push (toggle)** — `hooks/usePushSubscription.ts` (del plan `plan-pwa-push/`): expone `{ estado, activar, desactivar }` con `estado` en `'no-soportado' | 'cargando' | 'inactivo' | 'activo' | 'denegado'`. `activar()` ya maneja el flujo completo (pide permiso → suscribe → guarda en `push_subscriptions`). Se reutiliza tal cual, sin modificar el hook.

**Cron ya existente** — `app/api/cron/notificaciones/route.ts`, protegido con `CRON_SECRET`, corre `generarAlertasBusquedas()` y `purgarAntiguas()`. Es el lugar natural para agregar la escalación de críticas sin leer (mismo patrón, misma protección).

## Parte 2 — Qué se agrega

### 1.1 Vibración en push crítico (Android)

`public/sw.js`, dentro del listener `push` ya existente, agregar `vibrate` al `showNotification` solo si `severidad === 'critico'`. iOS no soporta vibración vía Web Push — se degrada solo (el campo se ignora ahí, no rompe nada).

### 1.2 Alerta in-app de pantalla completa para críticas

Hoy el polling de `CampanillaNotificaciones` solo trae el **conteo**. Se extiende `contarNoLeidas`-adyacente con una segunda pieza de información barata: la crítica no leída más reciente (si existe una nueva desde el último poll). Con eso, un componente nuevo muestra un banner de ancho completo (no un toast pequeño) que no depende de que el usuario tenga el dropdown abierto — se ve en cualquier pantalla de la app mientras haya sesión.

### 1.3 Escalación: reenviar push si sigue sin leer

Nueva columna `notificaciones_eventos.push_reescalado_en` (nullable). El cron ya existente revisa cada corrida: críticas con más de N minutos sin ninguna lectura y sin escalar aún → reenvía el push (reusa `enviarPush`, ya existente) y marca `push_reescalado_en`. **Un solo reintento**, no reenvío infinito — evita convertir esto en spam si de verdad nadie va a leerlo desde el navegador (p. ej. notificaciones bloqueadas a nivel SO).

### 2. Guardia de permisos obligatorios (Oficial de Campo)

Componente nuevo montado en `app/oficial/layout.tsx`, junto a `OficialUbicacionProvider` (no lo reemplaza, lo envuelve). Lee `useUbicacionOficial()` + `usePushSubscription()`. Si falta cualquiera de los dos, cubre toda la pantalla con un overlay sin botón de cerrar ni click-outside — el oficial no puede interactuar con nada del sistema hasta que ambos estén en estado `activo`/`posicionActual` presente.

Casos a cubrir explícitamente (no es un simple "if faltan, bloquea"):
- **Ubicación pendiente** (el navegador aún no respondió el prompt, que ya se disparó solo al montar `OficialUbicacionProvider`): mensaje de espera, nada que el usuario deba clickear.
- **Ubicación denegada**: JS no puede reabrir el prompt del navegador una vez bloqueado — el modal debe explicar cómo reactivarlo manualmente (candado de la barra de direcciones → Ubicación → Permitir) + botón "Ya lo activé, recargar" (`location.reload()`).
- **Push pendiente**: botón "Activar notificaciones" dentro del propio modal, reutilizando `usePushSubscription().activar()` — pedir permiso de `Notification` sí requiere un gesto del usuario (click), por eso no se puede auto-disparar como la ubicación.
- **Push denegado**: mismo patrón que ubicación denegada — instrucciones + botón de recargar.
- **Navegador sin soporte** (geolocalización o Push API, caso raro): mensaje explicando que el navegador no es compatible, sin acción posible — el oficial no puede pasar esta pantalla en ese dispositivo. Se documenta como limitación aceptada, no se resuelve con un fallback.

## Fuera de alcance (no implementar salvo pedido explícito)

- Aplicar el modal de permisos obligatorios a algún rol que no sea Oficial de Campo.
- Botón de "continuar sin esto" en el modal — el usuario pidió bloqueo total, sin excepción.
- Tracking de ubicación en background (fuera del navegador/pestaña) — sigue siendo foreground-only, sin cambios a `OficialUbicacionTracker.tsx` más allá de ser envuelto por el guard.
- Reenvíos múltiples/infinitos de push escalado — un solo reintento por notificación.
- Cambiar el sonido/severidad de notificaciones `info`/`aviso` — solo `critico` se toca en este plan.
- Panel de administración para configurar el umbral de minutos de escalación — se deja como constante en código (`UMBRAL_ESCALACION_MINUTOS`), ajustable en un cambio futuro si hace falta exponerlo en UI.

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update`.
3. `npm run db:schema` después de aplicar la migración de Etapa 3.
4. Bóveda actualizada (Etapa 5): ampliar `Notificaciones.md` (escalación + alerta in-app) y crear/ampliar la sección de `app/oficial/layout.tsx` en la doc de arquitectura o en el feature de Oficial si existe una.
5. Prueba manual (la hace el usuario): en un dispositivo real, silenciar/no activar push y bloquear ubicación en `/oficial/*` → confirmar que el modal no se puede cerrar → activar ambos → confirmar que desaparece y la app funciona normal. Aparte, disparar un evento crítico (p. ej. `despacho.asignado`) sin leerlo y esperar el umbral de escalación → confirmar que llega un segundo push.
