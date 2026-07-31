# Etapa 3 — Refactor de `NavegacionDespacho.tsx`

> Lee primero [`00-contexto.md`](./00-contexto.md), que tiene el archivo completo actual. Puede ejecutarse en paralelo con las Etapas 1 y 2 (mismo archivo, sin dependencias cruzadas de código, solo de integración final en la Etapa 4).

**Archivo a modificar:** `components/oficial/navegacion/NavegacionDespacho.tsx`

## Objetivo

1. Quitar la pantalla `fase === 'no_iniciado'` y su botón — esa pantalla se mudó a `AsignacionCard.tsx` (Etapa 1), fuera del modal. Este componente ahora asume que, en cuanto se monta, el oficial ya confirmó "iniciar" — dispara `marcarEnCaminoOficial` automáticamente al montar.
2. **Modo navegación pasa a ser el default** (`modoNavegacion` inicia en `true`, no `false`) — arriba queda como vista secundaria.
3. La llegada (geofence o botón manual) ya no llama al callback del padre de inmediato — muestra una pantalla de confirmación **"Has llegado a destino"** dentro del mismo componente, y solo el botón **"ATENDER"** de esa pantalla dispara el callback hacia el padre (renombrado de `onLlegada` a `onAtender`).
4. El botón manual de respaldo se renombra de "✓ LLEGUÉ" a **"YA ESTOY AQUÍ"**.

## Cambios a aplicar

Reemplaza el archivo completo por esta versión (parte del `00-contexto.md` como base, con los cambios integrados):

```tsx
'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from '@react-google-maps/api'
import { Navigation2, Map as MapIcon, CheckCircle2 } from 'lucide-react'
import { GOOGLE_MAPS_LOADER_ID, GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES, GOOGLE_MAPS_MAP_ID } from '@/lib/maps/googleMapsConfig'
import { colorPorPrioridad } from '@/lib/incidentes/prioridad-colores'
import { marcarEnCaminoOficial, marcarEnSitioOficial } from '@/lib/oficial/actions'
import { distanciaHaversineKm } from '@/lib/shared/geo'

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  minHeight: 420,
}

const DESVIACION_RECALCULO_METROS = 150
const RECALCULO_MIN_INTERVALO_MS = 60_000
const LLEGADA_GEOFENCE_KM = 0.08 // 80 metros
const UMBRAL_RUMBO_METROS = 8
const TILT_NAVEGACION = 60
const ZOOM_NAVEGACION = 18
const ZOOM_ARRIBA = 15

function calcularRumbo(desde: { lat: number; lng: number }, hacia: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const φ1 = toRad(desde.lat)
  const φ2 = toRad(hacia.lat)
  const Δλ = toRad(hacia.lng - desde.lng)
  const y = Math.sin(Δλ) * Math.cos(φ2)
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
  const θ = Math.atan2(y, x)
  return ((θ * 180) / Math.PI + 360) % 360
}

function buildDestinoSvgIcon(color: string): { url: string } {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54">
  <circle cx="27" cy="21" r="24" fill="#fff" fill-opacity="0.55"/>
  <circle cx="27" cy="21" r="21" fill="${color}" stroke="#fff" stroke-width="3"/>
  <polygon points="27,54 15,36 39,36" fill="${color}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="28,9 18,21 27,21 26,29 36,17 27,17 28,9" fill="#fff"/>
</svg>`
  return { url: `data:image/svg+xml,${encodeURIComponent(svg)}` }
}

function buildPatrullaSvgIcon(): { url: string } {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42">
  <circle cx="17" cy="15" r="13" fill="#1f355a" stroke="#fff" stroke-width="2"/>
  <polygon points="17,40 9,25 25,25" fill="#1f355a" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
  <text x="17" y="19" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="10" font-weight="bold">P</text>
</svg>`
  return { url: `data:image/svg+xml,${encodeURIComponent(svg)}` }
}

function buildVehiculo3DIcon(): { url: string; scaledSize: google.maps.Size; anchor: google.maps.Point } {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 40 52">
  <ellipse cx="20" cy="46" rx="13" ry="5" fill="#000" opacity="0.28"/>
  <rect x="7" y="6" width="26" height="36" rx="9" fill="#1f355a" stroke="#ffffff" stroke-width="2.5"/>
  <rect x="11" y="11" width="18" height="12" rx="4" fill="#bfdbfe"/>
  <rect x="10" y="24" width="10" height="4" rx="1.5" fill="#dc2626"/>
  <rect x="20" y="24" width="10" height="4" rx="1.5" fill="#2563eb"/>
  <circle cx="14" cy="8" r="1.6" fill="#fde68a"/>
  <circle cx="26" cy="8" r="1.6" fill="#fde68a"/>
</svg>`
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(40, 52),
    anchor: new google.maps.Point(20, 26),
  }
}

interface NavegacionDespachoProps {
  incidenteId: string
  destino: { lat: number; lng: number }
  folio: string
  direccion?: string | null
  prioridad?: string | null
  onPosicionActualizada?: (pos: { lat: number; lng: number }) => void
  onAtender?: () => void
}

export function NavegacionDespacho({ incidenteId, destino, folio, direccion, prioridad, onPosicionActualizada, onAtender }: NavegacionDespachoProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  const [posicionActual, setPosicionActual] = useState<{ lat: number; lng: number } | null>(null)
  const [errorGps, setErrorGps] = useState<string | null>(null)
  const [ruta, setRuta] = useState<google.maps.DirectionsResult | null>(null)
  const [errorRuta, setErrorRuta] = useState<string | null>(null)
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null)
  const primerFixRef = useRef(false)
  const ultimoRecalculoRef = useRef(0)
  const [fase, setFase] = useState<'navegando' | 'llegada'>('navegando')
  const [pendienteLlegada, startTransitionLlegada] = useTransition()
  const llegadaDisparadaRef = useRef(false)
  const inicioDisparadoRef = useRef(false)

  const [modoNavegacion, setModoNavegacion] = useState(true)
  const [avisoMapId, setAvisoMapId] = useState(false)
  const [rumbo, setRumbo] = useState(0)
  const posicionAnteriorRumboRef = useRef<{ lat: number; lng: number } | null>(null)

  // Al montar, el oficial ya confirmó "iniciar navegación" en AsignacionCard —
  // no hay una segunda confirmación aquí dentro. Dispara la acción de negocio
  // una sola vez (StrictMode/remounts no la vuelven a llamar).
  useEffect(() => {
    if (inicioDisparadoRef.current) return
    inicioDisparadoRef.current = true
    marcarEnCaminoOficial(incidenteId)
  }, [incidenteId])

  useEffect(() => {
    if (!posicionActual) return
    const anterior = posicionAnteriorRumboRef.current
    if (!anterior) {
      posicionAnteriorRumboRef.current = posicionActual
      return
    }
    const distanciaMetros = distanciaHaversineKm(anterior.lat, anterior.lng, posicionActual.lat, posicionActual.lng) * 1000
    if (distanciaMetros > UMBRAL_RUMBO_METROS) {
      setRumbo(calcularRumbo(anterior, posicionActual))
      posicionAnteriorRumboRef.current = posicionActual
    }
  }, [posicionActual])

  const toggleModoNavegacion = () => {
    if (!modoNavegacion && !GOOGLE_MAPS_MAP_ID) {
      setAvisoMapId(true)
      return
    }
    setAvisoMapId(false)
    setModoNavegacion(m => !m)
  }

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

  // Transición visual inmediata a la pantalla de llegada — marcarEnSitioOficial
  // corre en background (startTransition) para que hora_llegada quede precisa
  // sin bloquear la confirmación visual al oficial.
  const dispararLlegada = () => {
    if (llegadaDisparadaRef.current) return
    llegadaDisparadaRef.current = true
    setFase('llegada')
    startTransitionLlegada(async () => {
      await marcarEnSitioOficial(incidenteId)
    })
  }

  useEffect(() => {
    if (fase !== 'navegando') return
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
  }, [fase, onPosicionActualizada])

  useEffect(() => {
    if (!isLoaded || !posicionActual || primerFixRef.current) return
    primerFixRef.current = true
    calcularRuta(posicionActual)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, posicionActual])

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

  useEffect(() => {
    if (fase !== 'navegando' || !posicionActual || llegadaDisparadaRef.current) return
    const distanciaKm = distanciaHaversineKm(posicionActual.lat, posicionActual.lng, destino.lat, destino.lng)
    if (distanciaKm < LLEGADA_GEOFENCE_KM) {
      dispararLlegada()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, posicionActual])

  if (loadError) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
        Error cargando Google Maps.
      </div>
    )
  }

  if (fase === 'llegada') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 20, width: '100%', height: '100%', flex: 1, padding: 24, boxSizing: 'border-box',
        fontFamily: 'Inter,sans-serif', textAlign: 'center', background: '#f8fafc',
      }}>
        <style>{`
          @keyframes llegadaCheckIn {
            0% { transform: scale(0.6); opacity: 0; }
            60% { transform: scale(1.08); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .llegada-check { animation: llegadaCheckIn .4s ease-out; }
        `}</style>
        <div className="llegada-check" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 88, height: 88, borderRadius: '50%', background: '#dcfce7',
        }}>
          <CheckCircle2 size={52} color="#16a34a" strokeWidth={1.75} />
        </div>
        <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontWeight: 800, fontSize: 26, color: '#0f172a', textTransform: 'uppercase' }}>
          Has llegado a destino
        </div>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#64748b' }}>{folio}</div>
        <button
          onClick={() => onAtender?.()}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 40px', marginTop: 12, fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: 16, letterSpacing: '0.06em', textTransform: 'uppercase',
            border: '1px solid #16a34a', borderRadius: 2, cursor: 'pointer',
            background: '#16a34a', color: '#fff', transition: 'all .15s',
          }}
        >
          ATENDER
        </button>
      </div>
    )
  }

  if (!isLoaded || !posicionActual) {
    return (
      <div style={{ ...containerStyle, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', fontSize: 13, color: '#64748b' }}>
        <span>{errorGps ?? 'Obteniendo tu ubicación…'}</span>
      </div>
    )
  }

  const leg = ruta?.routes[0]?.legs[0]
  const color = colorPorPrioridad(prioridad).principal

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
        gap: 8, padding: '12px 16px', background: '#1c3051', color: '#fff',
        fontFamily: 'Inter,sans-serif',
      }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.75, fontFamily: 'JetBrains Mono,monospace' }}>{folio}</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{direccion ?? 'Destino del incidente'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {leg && (
            <div style={{ textAlign: 'right', fontFamily: 'Barlow Condensed,sans-serif' }}>
              <div style={{ fontSize: 20, fontWeight: 700 }}>{leg.duration?.text}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{leg.distance?.text}</div>
            </div>
          )}
          <button
            onClick={dispararLlegada}
            disabled={pendienteLlegada}
            style={{
              padding: '8px 16px', fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700, fontSize: 13, letterSpacing: '0.05em', textTransform: 'uppercase',
              cursor: pendienteLlegada ? 'wait' : 'pointer',
              border: '1px solid #14b8a6', borderRadius: 2,
              background: pendienteLlegada ? '#ccfbf1' : '#14b8a6',
              color: '#fff', opacity: pendienteLlegada ? 0.7 : 1,
            }}
          >
            {pendienteLlegada ? '...' : 'YA ESTOY AQUÍ'}
          </button>
        </div>
      </div>

      {errorRuta && (
        <div style={{ padding: '8px 16px', background: '#fef2f2', color: '#dc2626', fontSize: 12, fontFamily: 'Inter,sans-serif' }}>
          {errorRuta}
        </div>
      )}

      <div style={{ flex: 1, position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={posicionActual}
          zoom={modoNavegacion ? ZOOM_NAVEGACION : ZOOM_ARRIBA}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            ...(GOOGLE_MAPS_MAP_ID ? { mapId: GOOGLE_MAPS_MAP_ID } : {}),
            tilt: modoNavegacion ? TILT_NAVEGACION : 0,
            heading: modoNavegacion ? rumbo : 0,
          }}
        >
          {ruta && (
            <DirectionsRenderer
              directions={ruta}
              options={{ suppressMarkers: true, polylineOptions: { strokeColor: '#1f355a', strokeWeight: 5 } }}
            />
          )}
          <MarkerF position={posicionActual} icon={modoNavegacion ? buildVehiculo3DIcon() : buildPatrullaSvgIcon()} />
          <MarkerF position={destino} icon={buildDestinoSvgIcon(color)} clickable={false} />
        </GoogleMap>

        <button
          onClick={toggleModoNavegacion}
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 10,
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 14px', fontFamily: 'Barlow Condensed,sans-serif',
            fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase',
            border: '1px solid #1f355a', borderRadius: 2, cursor: 'pointer',
            background: '#ffffff', color: '#1c3051', boxShadow: '0 2px 8px rgba(0,0,0,.15)',
          }}
        >
          {modoNavegacion ? <MapIcon size={15} /> : <Navigation2 size={15} />}
          {modoNavegacion ? 'VISTA DE ARRIBA' : 'MODO NAVEGACIÓN'}
        </button>

        {avisoMapId && (
          <div style={{
            position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 10,
            padding: '10px 14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 2,
            fontFamily: 'Inter,sans-serif', fontSize: 12, color: '#92400e',
          }}>
            El modo navegación necesita un Map ID vectorial configurado (<code>NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID</code>). Pídele a tu administrador que lo configure en Google Cloud Console.
          </div>
        )}
      </div>
    </div>
  )
}
```

## Resumen de los cambios respecto a la versión anterior

- Props: `onLlegada` → `onAtender`.
- `fase`: `'no_iniciado' | 'navegando'` → `'navegando' | 'llegada'`. Ya no hay gate interna.
- Nuevo `useEffect` con `inicioDisparadoRef` que llama `marcarEnCaminoOficial(incidenteId)` una sola vez al montar (reemplaza al viejo `handleIniciar` + botón).
- Se quitaron `pendienteInicio`/`startTransitionInicio`/`handleIniciar` — ya no hace falta un estado de "iniciando" separado, la pantalla de carga existente (`!isLoaded || !posicionActual`) ya cubre ese momento.
- `modoNavegacion` inicia en `true` (antes `false`).
- `dispararLlegada` ya no llama a ningún callback del padre — cambia `fase` a `'llegada'` de inmediato (optimista) y dispara `marcarEnSitioOficial` en background.
- Nueva rama `fase === 'llegada'`: pantalla de confirmación con ícono animado, texto, folio y botón "ATENDER" que sí llama a `onAtender?.()`.
- Botón manual renombrado de "✓ LLEGUÉ" a "YA ESTOY AQUÍ" (mismo `onClick={dispararLlegada}`, mismo estilo).
- Import nuevo: `CheckCircle2` de `lucide-react` (confirmar que existe en `node_modules/lucide-react/dist/esm/icons/check-circle-2.mjs` antes de usarlo — si el nombre exacto difiere en la versión instalada, usar el que sí exista con el mismo significado visual).

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores nuevos.
- [ ] Al montar el componente (ya no hay pantalla de "Iniciar navegación" interna), se dispara `marcarEnCaminoOficial` automáticamente — confirmar en BD que `hora_salida` se puebla sin ninguna interacción adicional del oficial dentro de este componente.
- [ ] El mapa arranca directo en modo navegación (tilt inclinado, ícono 3D) sin que el oficial tenga que tocar el botón de alternancia.
- [ ] "VISTA DE ARRIBA" sigue funcionando para volver al top-down, y desde ahí se puede regresar a "MODO NAVEGACIÓN".
- [ ] Al simular llegada (geofence o botón "YA ESTOY AQUÍ"), el mapa desaparece de inmediato y aparece la pantalla "HAS LLEGADO A DESTINO" con animación del ícono — sin esperar a que `marcarEnSitioOficial` termine de responder.
- [ ] Confirmar en BD que `incidentes.estatus` pasa a `en_sitio` y `hora_llegada` se puebla, incluso antes de que el oficial toque "ATENDER".
- [ ] El botón "ATENDER" es el único elemento que dispara `onAtender?.()` — no debe dispararse solo.
- [ ] No queda ningún código muerto referenciando `fase === 'no_iniciado'`, `handleIniciar`, `pendienteInicio` u `onLlegada`.
