# Etapa 3 — Bóveda + verificación final end-to-end

Depende de Etapas 1 y 2 ya aplicadas y confirmadas por el usuario.

## Bóveda: ampliar `boveda/🧩 Features/Notificaciones.md`

No crear un archivo nuevo — es una extensión de la feature ya documentada.
Agregar una sección nueva al final del archivo (después de la sección "Push a
dispositivo (Web Push / VAPID)" y su subsección de escalación/vibración si
existen), con este contenido aproximado (ajustar si el código real de las
Etapas 1-2 quedó distinto a lo planeado):

```markdown
# Sincronización casi-instantánea en foreground (plan `plan-notificaciones-tiempo-real/`)

Antes de este plan, una pestaña abierta y quieta (sin navegar) solo se
enteraba de notificaciones nuevas vía el polling de 30s de
`CampanillaNotificaciones.tsx`/`ContadorAsignaciones.tsx` — y ese polling no
refrescaba de inmediato al recuperar el foco tras estar oculto, solo
reiniciaba el timer completo. Dos fixes independientes:

**`hooks/usePolling.ts`**: dispara `fn()` de inmediato cuando `activo` pasa de
`false` a `true` después del montaje inicial (ej. la pestaña recupera
visibilidad) — antes solo re-armaba el `setInterval`, podía tardar hasta
`intervalMs` completos en refrescar aunque el usuario acabara de volver a
mirar la pantalla.

**Puente Service Worker → pestaña abierta**: `public/sw.js`, en el listener
`push`, además de `showNotification()` hace `self.clients.matchAll()` +
`postMessage({ tipo: 'notificacion-push' })` a todas las pestañas del origen.
`CampanillaNotificaciones.tsx` escucha ese mensaje
(`navigator.serviceWorker.addEventListener('message', ...)`) y llama a
`refrescarContador()` de inmediato — el banner de alerta crítica y el
contador de no leídas se actualizan en 1-2s en vez de hasta 30s, **siempre
que el usuario tenga push activado** (toggle de un click en la campanita, ver
sección de arriba). Sin push activo, sigue dependiendo del polling normal +
el fix de recuperar-foco.

No se agregó este puente a `ContadorAsignaciones.tsx` (badge informativo, no
urgente) ni se acortó el intervalo global de 30s — el caso reportado
(banner de despacho asignado no aparecía hasta navegar) quedó cubierto sin
tocar el costo de BD del polling normal.
```

## Verificación final (checklist completo del plan)

1. `npx tsc --noEmit` sin errores.
2. `npm run build` sin errores.
3. `npx graphify update`.
4. Repetir, ahora de punta a punta y con el código final, las dos pruebas
   manuales descritas en `00-contexto.md`:
   - Push activado + oficial quieto en `/oficial` → banner en 1-2s al
     asignarle un despacho desde 911.
   - Push desactivado + pestaña oculta/bloqueada unos segundos antes de la
     asignación → fetch inmediato al recuperar el foco (no hace falta
     esperar 30s completos, aunque tampoco es instantáneo como con push).
5. Confirmar que ninguna de las dos pruebas requirió navegar a otra ruta ni
   recargar la página — ese era exactamente el síntoma reportado.

Reportar el resultado de las 5 verificaciones. No hay Etapa 4 — el plan
termina aquí.
