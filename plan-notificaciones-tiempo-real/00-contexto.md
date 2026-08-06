# Contexto — Sincronización casi-instantánea de notificaciones/alertas en foreground

Análisis hecho por Claude (arquitecto) el 2026-08-06, contra el código real del
repo (`hooks/usePolling.ts`, `components/notificaciones/CampanillaNotificaciones.tsx`,
`components/oficial/ContadorAsignaciones.tsx`, `public/sw.js`,
`lib/notificaciones/repository.ts`, `app/api/notificaciones/contador/route.ts`,
`lib/incidentes/actions.ts`) y la documentación de bóveda
`🧩 Features/Notificaciones.md`. A construir por DeepSeek (worker).

## Caso reportado por el usuario

Oficial de campo viendo `/oficial`. Desde el 911, el despachador le asigna un
incidente (`createDespacho` → `emitir('despacho.asignado', ...)`, severidad
`critico`). El banner rojo de pantalla completa (`AlertaCriticaBanner.tsx`) **no
aparece** mientras el oficial se queda quieto en esa página — solo aparece si
navega a otra ruta y vuelve, o si recarga.

## Diagnóstico — no es un bug de negocio, es latencia de sincronización en el cliente

Se verificó que la cadena de emisión es correcta y no tiene ningún bug:

1. `lib/notificaciones/catalogo.ts` define `despacho.asignado` con
   `severidad: 'critico'` — correcto.
2. `createDespacho`/`enviarRefuerzos` (`lib/incidentes/actions.ts`) resuelven
   los `user_id` reales de los oficiales asignados (vía `no_nomina` →
   `ofi_oficiales.user_id`) y llaman `emitir('despacho.asignado', { usuarios:
   [...], dedup: 'despacho.asignado:{incidenteId}' })` **después** del COMMIT —
   correcto, coincide con el contrato documentado.
3. `lib/notificaciones/repository.ts::criticaMasRecienteSinLeer()` trae la
   crítica no leída más reciente por `(userId, rolId)` — query correcta.
4. `app/api/notificaciones/contador/route.ts` expone `{ noLeidas, critica }` —
   correcto.
5. `CampanillaNotificaciones.tsx` (montado en `Header.tsx`/`SubHeader.tsx`, es
   decir en **todas** las páginas incluida `/oficial`) consume ese endpoint y
   setea `alertaCritica` cuando llega una `critica` con `id` distinto al ya
   visto — correcto.

El problema real está en **cuándo** se dispara ese fetch. Hay dos gaps
concretos, ambos en el cliente:

### Gap 1 — `usePolling` no refresca al recuperar visibilidad, solo re-arma el timer

`hooks/usePolling.ts`:

```ts
export function usePolling(fn: () => void, intervalMs: number, activo = true) {
  const fnRef = useRef(fn)
  fnRef.current = fn
  useEffect(() => {
    if (!activo) return
    const id = setInterval(() => fnRef.current(), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs, activo])
}
```

`CampanillaNotificaciones.tsx` y `ContadorAsignaciones.tsx` pausan el polling
cuando `document.visibilityState !== 'visible'` (`activo = visible`). Cuando
`activo` vuelve a `true`, el `useEffect` **solo arranca un `setInterval` nuevo**
— no llama `fn()` de inmediato. Es decir: si el oficial bloqueó la pantalla del
celular 5 segundos y la desbloqueó justo cuando le asignaron el despacho, el
próximo fetch puede tardar hasta 30s más en dispararse, no los ~5s que
"debería" faltar del ciclo anterior (el timer se reinicia de cero).

Cada uno de los dos consumidores **sí** hace un fetch inmediato, pero solo
**al montar** (`useEffect(() => setTimeout(fetch, 0), [])`). Por eso "si
navego y vuelvo, se actualiza" — al navegar, el componente se desmonta y
vuelve a montar, disparando ese fetch inicial de nuevo. Quedarse quieto en la
misma página nunca vuelve a disparar ese fetch salvo por el timer de 30s, que
además se reinicia completo cada vez que la pestaña pierde y recupera
visibilidad.

### Gap 2 — sin puente en tiempo real entre el push (ya instantáneo del lado servidor) y la pestaña abierta

El sistema de **push a dispositivo ya dispara en el instante exacto** en que
se emite la notificación (`emisor.ts` → `enviarPush()` fire-and-forget, sin
esperar al próximo poll de nada). El Service Worker (`public/sw.js`) recibe el
evento `push` y muestra la notificación del sistema operativo — eso ya es
instantáneo. Pero si la pestaña de la PWA está **abierta y visible** en ese
momento (el caso exacto reportado: el oficial viendo `/oficial`), ese `push`
no le dice nada al React que ya está corriendo ahí — el SW y la página nunca
se comunican. El React sigue dependiendo del polling de 30s para enterarse,
aunque el dato ya llegó al dispositivo hace rato.

## Diseño de la solución (2 fixes independientes, complementarios)

**Fix A (universal, cubre a todos incluso sin push activado)**: `usePolling`
dispara `fn()` de inmediato cuando `activo` pasa de `false` a `true` **después**
del montaje inicial (no duplica el fetch que cada consumidor ya hace al
montar). Cierra el Gap 1 — recuperar el foco de la pestaña ya no espera hasta
30s completos.

**Fix B (near-instant, requiere que el oficial tenga push activado — ya es un
toggle de un click, ver `boveda/🧩 Features/Notificaciones.md` sección Push)**:
el Service Worker, al recibir un `push`, además de `showNotification()`,
hace `self.clients.matchAll()` y le manda un `postMessage()` a todas las
pestañas abiertas del mismo origen. `CampanillaNotificaciones.tsx` escucha
`navigator.serviceWorker.addEventListener('message', ...)` y, al recibir ese
mensaje, llama a `refrescarContador()` de inmediato — cierra el Gap 2. Esto
reutiliza infraestructura que **ya existe** (push + VAPID), no agrega
websockets ni SSE ni ninguna dependencia nueva.

**Por qué no SSE/WebSockets aquí**: el QA actual corre en Vercel Hobby
(serverless, sin conexiones persistentes reales) y la producción final migra a
un servidor Node propio — pero el push+SW ya resuelve el caso de "pestaña
abierta" sin depender de mantener una conexión persistente en ningún lado, y
funciona igual de bien en ambos entornos de despliegue. No hay razón para
introducir una tecnología nueva cuando la que ya existe (Web Push) cubre el
caso.

## Fuera de alcance (no implementar salvo pedido explícito)

- Bajar el intervalo de polling global de 30s a algo más corto — el Fix A+B ya
  resuelve el caso reportado sin tocar el costo de BD del polling normal.
- Cualquier forma de SSE/WebSockets/long-polling.
- Tocar la lógica de negocio de `lib/incidentes/actions.ts` o el catálogo de
  eventos — ya están correctos, no se tocan.
- Refresh global tipo `router.refresh()` de la página completa por intervalo —
  se evaluó con el usuario y se descartó por riesgo de perder datos de
  formularios sin guardar a mitad de llenado. Este plan es más quirúrgico:
  solo el subsistema de notificaciones/alertas, que no tiene ese riesgo (no
  hay inputs de usuario que perder al refrescar el contador).

## Checklist general al terminar TODAS las etapas

1. `npx tsc --noEmit` y `npm run build` sin errores.
2. `npx graphify update`.
3. Bóveda actualizada (Etapa 3): ampliar `Notificaciones.md` con la sección de
   sincronización en tiempo real — no crear archivo nuevo.
4. Prueba manual (la hace el usuario, dos sesiones/dispositivos):
   - Con push **activado** en el dispositivo del oficial: asignar un despacho
     desde 911 mientras el oficial está quieto en `/oficial` → banner rojo
     debe aparecer en 1-2s, no 30s.
   - Con push **desactivado**: mismo escenario, pero adicionalmente
     minimizar/bloquear la pantalla del oficial unos segundos antes de que
     llegue la asignación y volver justo después → el fetch debe dispararse
     de inmediato al recuperar el foco, no esperar el resto del intervalo.
