# Etapa 3 — Geolocalización en vivo (watchPosition + recálculo por desviación)

> Lee primero [`00-contexto.md`](./00-contexto.md). Depende de [`etapa-2.md`](./etapa-2.md) — este archivo modifica el componente que esa etapa creó.

**Archivo a modificar:** `components/oficial/navegacion/NavegacionDespacho.tsx`

## Objetivo

Reemplazar la posición estática (`getCurrentPosition`, una sola lectura) por seguimiento en vivo (`watchPosition`, alta precisión) — el marcador "yo" se mueve conforme el oficial avanza, y la ruta solo se recalcula si el oficial se desvía significativamente de la polyline actual (no en cada tick, por costo de Directions API). Se expone la posición en vivo hacia afuera con un callback, porque la Etapa 4 la necesita para detectar la llegada (geofence).

**No toques** el JSX del header ni de los marcadores/`GoogleMap` — solo la lógica de estado y efectos de geolocalización/ruta.

## Cambios a aplicar

### 1. Nuevas constantes, arriba del componente (después de los imports)

```ts
const DESVIACION_RECALCULO_METROS = 150
const RECALCULO_MIN_INTERVALO_MS = 60_000
```

### 2. Reemplazar el estado y los dos `useEffect` de geolocalización/ruta

Código actual (de la Etapa 2) a **reemplazar por completo**:

```tsx
  const [origen, setOrigen] = useState<{ lat: number; lng: number } | null>(null)
  const [errorGps, setErrorGps] = useState<string | null>(null)
  const [ruta, setRuta] = useState<google.maps.DirectionsResult | null>(null)
  const [errorRuta, setErrorRuta] = useState<string | null>(null)
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null)

  // Posición inicial (una sola vez) — el watchPosition en vivo llega en la Etapa 3.
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorGps('Este navegador no soporta geolocalización.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => setOrigen({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => setErrorGps(err.code === err.PERMISSION_DENIED ? 'Permiso de ubicación denegado.' : 'No se pudo obtener tu ubicación.'),
      { enableHighAccuracy: true, timeout: 15_000 },
    )
  }, [])

  useEffect(() => {
    if (!isLoaded || !origen) return
    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService()
    }
    directionsServiceRef.current.route(
      { origin: origen, destination: destino, travelMode: google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setRuta(result)
          setErrorRuta(null)
        } else {
          setErrorRuta('No se pudo calcular la ruta.')
        }
      },
    )
    // Solo al montar / si cambia el destino — el recálculo por desviación llega en la Etapa 3.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, origen])
```

Reemplázalo por:

```tsx
  const [posicionActual, setPosicionActual] = useState<{ lat: number; lng: number } | null>(null)
  const [errorGps, setErrorGps] = useState<string | null>(null)
  const [ruta, setRuta] = useState<google.maps.DirectionsResult | null>(null)
  const [errorRuta, setErrorRuta] = useState<string | null>(null)
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null)
  const primerFixRef = useRef(false)
  const ultimoRecalculoRef = useRef(0)

  const calcularRuta = (origen: { lat: number; lng: number }) => {
    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new google.maps.DirectionsService()
    }
    directionsServiceRef.current.route(
      { origin: origen, destination: destino, travelMode: google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setRuta(result)
          setErrorRuta(null)
          ultimoRecalculoRef.current = Date.now()
        } else {
          setErrorRuta('No se pudo calcular la ruta.')
        }
      },
    )
  }

  // watchPosition dedicado de alta precisión — independiente del heartbeat de
  // OficialUbicacionTracker.tsx (ese sigue en baja precisión / 30s para el mapa
  // del despachador; este es solo para esta vista, mientras está montada).
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorGps('Este navegador no soporta geolocalización.')
      return
    }
    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setPosicionActual(coords)
        onPosicionActualizada?.(coords)
      },
      err => setErrorGps(err.code === err.PERMISSION_DENIED ? 'Permiso de ubicación denegado.' : 'No se pudo obtener tu ubicación.'),
      { enableHighAccuracy: true, maximumAge: 5_000, timeout: 15_000 },
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [onPosicionActualizada])

  // Cálculo inicial de ruta — solo con el primer fix de GPS.
  useEffect(() => {
    if (!isLoaded || !posicionActual || primerFixRef.current) return
    primerFixRef.current = true
    calcularRuta(posicionActual)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, posicionActual])

  // Recálculo por desviación — solo si hay ruta previa, pasó al menos
  // RECALCULO_MIN_INTERVALO_MS desde el último recálculo, y la posición actual
  // se alejó más de DESVIACION_RECALCULO_METROS del trazo de la ruta vigente.
  useEffect(() => {
    if (!isLoaded || !posicionActual || !ruta) return
    if (Date.now() - ultimoRecalculoRef.current < RECALCULO_MIN_INTERVALO_MS) return

    const path = ruta.routes[0]?.overview_path
    if (!path || path.length === 0) return

    const punto = new google.maps.LatLng(posicionActual.lat, posicionActual.lng)
    let distanciaMinMetros = Infinity
    for (const vertice of path) {
      const d = google.maps.geometry.spherical.computeDistanceBetween(punto, vertice)
      if (d < distanciaMinMetros) distanciaMinMetros = d
    }

    if (distanciaMinMetros > DESVIACION_RECALCULO_METROS) {
      calcularRuta(posicionActual)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, posicionActual, ruta])
```

Puntos clave:
- `primerFixRef` asegura que el cálculo inicial de ruta ocurra **una sola vez**, con el primer fix de GPS — los fixes siguientes no vuelven a llamar `calcularRuta` por sí mismos, solo mueven el marcador (vía `posicionActual`) hasta que el efecto de desviación decida recalcular.
- El chequeo de desviación usa `google.maps.geometry.spherical.computeDistanceBetween` (requiere `'geometry'` en `GOOGLE_MAPS_LIBRARIES`, agregado en la Etapa 1) contra los vértices de `overview_path` de la ruta vigente — es una aproximación por distancia al vértice más cercano, no una proyección exacta sobre el segmento, mismo criterio de simplicidad que el resto del proyecto (ver `distanciaHaversineKm`, línea recta, no ruteo real).
- `ultimoRecalculoRef` se actualiza dentro de `calcularRuta` (no antes), para que el throttle cuente desde el último recálculo **exitoso**, no desde el intento.

### 3. Nueva prop `onPosicionActualizada`

Agrega a la interfaz de props (mantén las que ya existían):

```tsx
interface NavegacionDespachoProps {
  destino: { lat: number; lng: number }
  folio: string
  direccion?: string | null
  prioridad?: string | null
  onPosicionActualizada?: (pos: { lat: number; lng: number }) => void
}
```

Y en la firma del componente, agrega `onPosicionActualizada` a la desestructuración:

```tsx
export function NavegacionDespacho({ destino, folio, direccion, prioridad, onPosicionActualizada }: NavegacionDespachoProps) {
```

Este callback no se usa todavía dentro del componente más que para reenviar la posición hacia el padre — la Etapa 4 lo consume para detectar la llegada (geofence) y disparar las acciones de servidor.

### 4. Actualizar las referencias a `origen` en el resto del componente

Todo el JSX que antes usaba `origen` (el `if (!isLoaded || !origen)`, `center={origen}`, `<MarkerF position={origen} .../>`) ahora debe usar `posicionActual`. Es un rename directo — no cambia la lógica de esas partes, solo el nombre de la variable.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores nuevos.
- [ ] Usando la página de prueba temporal de la Etapa 2 (o recréala si ya la borraste), confirmar en DevTools → Sensors → Geolocation que, al simular movimiento manual (cambiar coordenadas), el marcador "yo" se mueve sin que la ruta se recalcule en cada cambio pequeño.
- [ ] Simular un salto de posición grande (>150m fuera de la ruta dibujada) y confirmar que, tras el throttle de 60s, la ruta se recalcula (nueva llamada a Directions, visible en Network tab).
- [ ] Confirmar que el cálculo inicial de ruta ocurre exactamente una vez por montaje (revisar Network tab: una sola request a Directions API al cargar, no una por cada tick de posición).
- [ ] Al desmontar el componente (navegar fuera), `navigator.geolocation.clearWatch` se llama (puedes confirmarlo indirectamente: sin errores de "callback after unmount" en consola).
- [ ] `onPosicionActualizada` se dispara con cada posición nueva (agrega un `console.log` temporal en la página de prueba para confirmarlo, quítalo antes de cerrar la etapa).
