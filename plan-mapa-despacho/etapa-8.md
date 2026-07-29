# Etapa 8 — Fix: primer reporte de ubicación del oficial tarda en llegar (última etapa, cierre del plan)

> Repo: `seguridad_publica` (Next.js 16.2.4, React 19, TypeScript). Última parte del plan "Mapa tipo Uber en Asignar Unidades". Ver `00-contexto.md` para trasfondo general. **Requiere que las etapas 1 a 7 ya estén construidas** (todo el mapa de asignación de unidades, la regla de "unidad ocupada", y el fix de datos frescos al abrir el modal — todo ya en producción en este repo).

## Bug reportado por el usuario

La ubicación del oficial se manda "tiempo después" de iniciar sesión, no de inmediato. En un contexto de despacho 911 el tiempo es crítico: un oficial recién conectado puede ser justo la unidad más cercana a un incidente nuevo, y cada segundo sin su posición real es una oportunidad de despacho más lenta o menos precisa.

**Objetivo:** que apenas el oficial inicia sesión con su rol (oficial/policía), su ubicación se reporte automáticamente lo antes posible — sin esperar el ciclo completo del heartbeat — y que el heartbeat periódico existente (cada `HEARTBEAT_SEGUNDOS`) siga funcionando exactamente igual después de ese primer envío.

## Causa raíz confirmada en el código real

Archivo: `components/oficial/OficialUbicacionTracker.tsx`.

- `OficialUbicacionProvider` se monta en `app/oficial/layout.tsx` — se activa apenas el oficial entra a cualquier página de su sección, justo tras iniciar sesión (el layout ya está gateado por auth vía `proxy.ts`, no hace falta ningún chequeo de rol adicional en este fix).
- Dentro de su `useEffect`, `navigator.geolocation.watchPosition` va guardando cada posición nueva en un ref:
  ```ts
  const watchId = navigator.geolocation.watchPosition(
    pos => {
      ultimaPosicionRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude }
    },
    err => { if (err.code === err.PERMISSION_DENIED) setPermisoDenegado(true) },
    { enableHighAccuracy: false, maximumAge: 20_000, timeout: 15_000 },
  )
  ```
  Esto normalmente resuelve en pocos segundos.
- Pero el envío real al backend solo ocurre dentro de un `setInterval` de 1 segundo que lleva la cuenta regresiva `segundosParaProximoEnvio`, inicializada en `HEARTBEAT_SEGUNDOS = 30`:
  ```ts
  const tick = setInterval(() => {
    setPosicionActual(ultimaPosicionRef.current)
    setSegundosParaProximoEnvio(s => {
      if (s > 1) return s - 1
      const pos = ultimaPosicionRef.current
      if (pos) {
        reportarUbicacionOficial(pos.lat, pos.lng)
        setUltimoEnvio({ ...pos, en: new Date() })
      }
      return HEARTBEAT_SEGUNDOS
    })
  }, 1000)
  ```
  Aunque el navegador ya tenga la posición disponible en el ref desde el segundo 2 o 3, el primer envío real no ocurre hasta que la cuenta llega a 0 — es decir, hasta 30 segundos después de montar el layout (justo después del login), sin importar qué tan rápido esté disponible el fix de GPS.

## Archivo a tocar

- **Modificar (único archivo):** `components/oficial/OficialUbicacionTracker.tsx`

No tocar `lib/oficial/actions.ts` — `reportarUbicacionOficial(lat, lng)` ya resuelve la sesión del lado servidor (`auth.api.getSession`) y valida rangos de lat/lng por su cuenta; no necesita cambios para que este fix funcione. No tocar `app/oficial/layout.tsx` — el punto de montaje del provider ya es correcto (justo tras el login, por route grouping bajo `/oficial`).

## Instrucciones

1. Extrae una función `enviarUbicacion(lat: number, lng: number)` dentro del `useEffect` que encapsule exactamente lo que hoy hace el branch final del `tick`:
   ```ts
   const enviarUbicacion = (lat: number, lng: number) => {
     reportarUbicacionOficial(lat, lng)
     setUltimoEnvio({ lat, lng, en: new Date() })
     setSegundosParaProximoEnvio(HEARTBEAT_SEGUNDOS)
   }
   ```
2. Agrega un ref de control: `const primerEnvioRef = useRef(false)` (junto a `ultimaPosicionRef`).
3. Dentro del callback de éxito de `watchPosition`, después de guardar la posición en `ultimaPosicionRef.current`, agrega el envío inmediato condicionado al ref:
   ```ts
   const watchId = navigator.geolocation.watchPosition(
     pos => {
       const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
       ultimaPosicionRef.current = coords
       if (!primerEnvioRef.current) {
         primerEnvioRef.current = true
         enviarUbicacion(coords.lat, coords.lng)
       }
     },
     err => { if (err.code === err.PERMISSION_DENIED) setPermisoDenegado(true) },
     { enableHighAccuracy: false, maximumAge: 20_000, timeout: 15_000 },
   )
   ```
4. Actualiza el `tick` para usar la misma función `enviarUbicacion` en vez de repetir la lógica inline:
   ```ts
   const tick = setInterval(() => {
     setPosicionActual(ultimaPosicionRef.current)
     setSegundosParaProximoEnvio(s => {
       if (s > 1) return s - 1
       const pos = ultimaPosicionRef.current
       if (pos) enviarUbicacion(pos.lat, pos.lng)
       return HEARTBEAT_SEGUNDOS
     })
   }, 1000)
   ```
5. Como `enviarUbicacion` ya resetea `segundosParaProximoEnvio` a `HEARTBEAT_SEGUNDOS` cada vez que se llama (tanto en el envío inmediato como en el periódico), el siguiente envío cae correctamente `HEARTBEAT_SEGUNDOS` después del envío inmediato — no hay doble conteo ni desincronización entre el timer visual y los envíos reales.
6. No cambies el valor de `HEARTBEAT_SEGUNDOS` (se mantiene en 30) ni las opciones de `watchPosition` (`enableHighAccuracy: false, maximumAge: 20_000, timeout: 15_000`) — el fix es solo sobre el momento del primer envío, no sobre precisión ni cadencia.
7. Si `watchPosition` nunca entrega un fix (permiso denegado, timeout, sin soporte del navegador), el comportamiento debe ser idéntico al actual: no se fuerza ningún envío sin una posición real disponible, y `permisoDenegado`/el badge visual siguen funcionando sin cambios.

## Qué NO hacer en esta etapa

- No tocar `lib/oficial/actions.ts`, `app/oficial/layout.tsx`, ni ningún componente que consuma `useUbicacionOficial()` (ej. `MiUbicacionSection`) — el contrato del contexto (`posicionActual`, `ultimoEnvio`, `segundosParaProximoEnvio`, `permisoDenegado`, `soportado`) no cambia.
- No agregar un nuevo endpoint ni cambiar la forma en que `reportarUbicacionOficial` valida/guarda la ubicación.
- No introducir websockets/SSE ni background tracking — sigue fuera de alcance de todo este plan (el reporte sigue siendo foreground-only, mientras el oficial tenga la sesión/pestaña abierta).
- No cambiar `HEARTBEAT_SEGUNDOS` ni las opciones de `watchPosition`.

## Criterios de aceptación

1. `npx tsc --noEmit` sin errores.
2. Con permisos de geolocalización otorgados, al iniciar sesión como oficial de prueba y entrar a cualquier página bajo `/oficial`, el primer `UPDATE` de `ofi_oficiales.ultima_lat/ultima_lng/ultima_ubicacion_en` para ese oficial debe ocurrir en cuanto el navegador resuelve el primer fix de GPS/red (normalmente unos pocos segundos) — verificable consultando la tabla directamente antes/después, o con un log temporal en `enviarUbicacion` durante la prueba (quitarlo antes de dar la etapa por terminada).
3. Después de ese primer envío, los envíos siguientes continúan ocurriendo cada `HEARTBEAT_SEGUNDOS` (30s) tal como antes — verificar al menos 2-3 ciclos completos (ej. observando `ultima_ubicacion_en` avanzar cada ~30s, o el countdown visual si hay una pantalla que lo muestre).
4. Si se deniega el permiso de geolocalización, el comportamiento (mensaje/badge de "Ubicación no disponible", sin ningún envío) es idéntico al actual.
5. Cerrar la pestaña o salir de `/oficial` sigue deteniendo el tracking igual que hoy (cleanup de `clearWatch`/`clearInterval` sin cambios de comportamiento).
6. No se rompió ninguna otra funcionalidad de `OficialUbicacionTracker.tsx` — el contexto `useUbicacionOficial()` sigue exponiendo los mismos valores con el mismo significado para cualquier pantalla que lo consuma.

Con esta etapa completada y validada, el plan del mapa de asignación de unidades — incluyendo la cadena completa desde que el oficial reporta su posición hasta que el despachador la ve en el mapa — queda cerrado. No quedan etapas pendientes en este plan.
