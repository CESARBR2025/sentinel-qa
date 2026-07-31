# Etapa 2 — Componente `NavegacionDespacho` (base: mapa + ruta calculada)

> Lee primero [`00-contexto.md`](./00-contexto.md). Depende de [`etapa-1.md`](./etapa-1.md) (necesita `latitud`/`longitud` disponibles y `'geometry'` en `GOOGLE_MAPS_LIBRARIES`, aunque esta etapa en particular todavía no usa `geometry` — la deja lista para la Etapa 3).

**Archivo a crear:** `components/oficial/navegacion/NavegacionDespacho.tsx` (nuevo)

## Objetivo

Construir el componente de mapa **aislado, sin integrarlo todavía a `DespachoContent.tsx`** (eso es la Etapa 4). Debe: cargar Google Maps con el loader compartido, obtener la posición del oficial **una sola vez** (`getCurrentPosition`, no `watchPosition` todavía — eso es la Etapa 3), calcular la ruta con `DirectionsService` desde esa posición hasta el destino, y pintarla con `DirectionsRenderer`. Header simple con folio/dirección/ETA/distancia, estilo DiDi.

## Código completo del componente

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from '@react-google-maps/api'
import { GOOGLE_MAPS_LOADER_ID, GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from '@/lib/maps/googleMapsConfig'
import { colorPorPrioridad } from '@/lib/incidentes/prioridad-colores'

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  minHeight: 420,
}

function buildDestinoSvgIcon(color: string): { url: string } {
  // Mismo patrón que components/911/despacho/AsignacionMapa.tsx::buildIncidenteSvgIcon
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

interface NavegacionDespachoProps {
  destino: { lat: number; lng: number }
  folio: string
  direccion?: string | null
  prioridad?: string | null
}

export function NavegacionDespacho({ destino, folio, direccion, prioridad }: NavegacionDespachoProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

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

  if (loadError) {
    return (
      <div style={{ ...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', fontFamily: 'Inter,sans-serif', fontSize: 13 }}>
        Error cargando Google Maps.
      </div>
    )
  }

  if (!isLoaded || !origen) {
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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: '#1c3051', color: '#fff',
        fontFamily: 'Inter,sans-serif',
      }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.75, fontFamily: 'JetBrains Mono,monospace' }}>{folio}</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{direccion ?? 'Destino del incidente'}</div>
        </div>
        {leg && (
          <div style={{ textAlign: 'right', fontFamily: 'Barlow Condensed,sans-serif' }}>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{leg.duration?.text}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>{leg.distance?.text}</div>
          </div>
        )}
      </div>

      {errorRuta && (
        <div style={{ padding: '8px 16px', background: '#fef2f2', color: '#dc2626', fontSize: 12, fontFamily: 'Inter,sans-serif' }}>
          {errorRuta}
        </div>
      )}

      <div style={{ flex: 1, position: 'relative' }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={origen}
          zoom={15}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          {ruta && (
            <DirectionsRenderer
              directions={ruta}
              options={{ suppressMarkers: true, polylineOptions: { strokeColor: '#1f355a', strokeWeight: 5 } }}
            />
          )}
          <MarkerF position={origen} icon={buildPatrullaSvgIcon()} />
          <MarkerF position={destino} icon={buildDestinoSvgIcon(color)} clickable={false} />
        </GoogleMap>
      </div>
    </div>
  )
}
```

Notas de diseño:
- `suppressMarkers: true` en `DirectionsRenderer` — los marcadores A/B por defecto de Directions se ocultan porque ya dibujamos nuestros propios íconos (patrulla + destino), consistentes con el resto del proyecto.
- `directionsServiceRef` evita crear una instancia nueva de `DirectionsService` en cada render.
- El `useEffect` de cálculo de ruta tiene el lint de `exhaustive-deps` suprimido a propósito: en esta etapa solo debe correr cuando cambia `origen` (posición inicial) o `isLoaded`, no en cada render — el control de recálculo por desviación es tema de la Etapa 3, no adelantarlo aquí.
- No se dispara ninguna mutación de servidor todavía (`marcarEnCaminoOficial`, etc.) — eso es la Etapa 4. Este componente en esta etapa es puramente de lectura/visualización.

## Cómo verificar esta etapa sin integrarla al flujo real

No modifiques `DespachoContent.tsx` todavía. Para confirmar visualmente que el componente funciona, monta una página de prueba temporal (bórrala al terminar la etapa, o dime si prefieres dejarla — no es parte del plan final):

```tsx
// app/oficial/_test-navegacion/page.tsx (TEMPORAL, borrar antes de cerrar el plan)
import { NavegacionDespacho } from '@/components/oficial/navegacion/NavegacionDespacho'

export default function TestNavegacion() {
  return (
    <div style={{ height: '100vh' }}>
      <NavegacionDespacho
        destino={{ lat: 20.3894, lng: -99.9964 }} // San Juan del Río, ajustar a una coordenada real de prueba
        folio="TEST-0001"
        direccion="Calle de prueba, Colonia de prueba"
        prioridad="ALTA"
      />
    </div>
  )
}
```

Entra a `/oficial/_test-navegacion` con sesión de oficial abierta, acepta el permiso de ubicación del navegador, y confirma que se ve la ruta calculada real (no una línea recta) entre tu posición y el punto de prueba, con ETA y distancia en el header.

## Criterios de aceptación

- [ ] `npx tsc --noEmit` sin errores nuevos.
- [ ] El componente compila y renderiza sin la integración real (usando la página de prueba temporal).
- [ ] Al aceptar el permiso GPS, el mapa centra en la posición real y dibuja una ruta por calles (no línea recta) hasta el `destino` de prueba.
- [ ] El header muestra ETA y distancia coherentes con la ruta dibujada.
- [ ] Si se deniega el permiso GPS, se muestra el mensaje de error correspondiente sin romper la página (sin excepción no capturada en consola).
- [ ] Borrar `app/oficial/_test-navegacion/` (o dejarlo señalado explícitamente si se decide conservarlo para QA manual futura — pero no debe quedar accesible desde ninguna navegación real del oficial).
