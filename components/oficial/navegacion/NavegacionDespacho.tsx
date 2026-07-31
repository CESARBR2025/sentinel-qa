'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, DirectionsRenderer } from '@react-google-maps/api'
import { GOOGLE_MAPS_LOADER_ID, GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from '@/lib/maps/googleMapsConfig'
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
  incidenteId: string
  destino: { lat: number; lng: number }
  folio: string
  direccion?: string | null
  prioridad?: string | null
  onPosicionActualizada?: (pos: { lat: number; lng: number }) => void
  onLlegada?: () => void
}

export function NavegacionDespacho({ incidenteId, destino, folio, direccion, prioridad, onPosicionActualizada, onLlegada }: NavegacionDespachoProps) {
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
  const [fase, setFase] = useState<'no_iniciado' | 'navegando'>('no_iniciado')
  const [pendienteInicio, startTransitionInicio] = useTransition()
  const [pendienteLlegada, startTransitionLlegada] = useTransition()
  const llegadaDisparadaRef = useRef(false)

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

  const handleIniciar = () => {
    startTransitionInicio(async () => {
      await marcarEnCaminoOficial(incidenteId)
      setFase('navegando')
    })
  }

  const dispararLlegada = () => {
    if (llegadaDisparadaRef.current) return
    llegadaDisparadaRef.current = true
    startTransitionLlegada(async () => {
      await marcarEnSitioOficial(incidenteId)
      onLlegada?.()
    })
  }

  // watchPosition dedicado de alta precisión — independiente del heartbeat de
  // OficialUbicacionTracker.tsx (ese sigue en baja precisión / 30s para el mapa
  // del despachador; este es solo para esta vista, mientras está montada).
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

  if (fase === 'no_iniciado') {
    const color = colorPorPrioridad(prioridad).principal
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 16, width: '100%', height: '100%', minHeight: 420, padding: 24, boxSizing: 'border-box',
        fontFamily: 'Inter,sans-serif', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#64748b' }}>{folio}</div>
        <div style={{ fontFamily: 'Barlow Condensed,sans-serif', fontSize: 20, fontWeight: 700, color: '#1c3051' }}>
          {direccion ?? 'Destino del incidente'}
        </div>
        <span style={{
          fontFamily: 'JetBrains Mono,monospace', fontSize: 10, fontWeight: 700,
          padding: '4px 12px', borderRadius: 2, border: `1px solid ${color}`, color,
        }}>
          {prioridad ?? 'SIN PRIORIDAD'}
        </span>
        <button
          onClick={handleIniciar}
          disabled={pendienteInicio}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700, fontSize: 16, letterSpacing: '0.06em',
            textTransform: 'uppercase', cursor: pendienteInicio ? 'wait' : 'pointer',
            border: '1px solid #1f355a', borderRadius: 2,
            background: pendienteInicio ? '#c3c8d2' : '#1f355a',
            color: '#fff', transition: 'all .15s',
            opacity: pendienteInicio ? 0.7 : 1,
          }}
        >
          {pendienteInicio ? 'INICIANDO…' : '🚓 INICIAR NAVEGACIÓN'}
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
            {pendienteLlegada ? '...' : '✓ LLEGUÉ'}
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
          zoom={15}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          {ruta && (
            <DirectionsRenderer
              directions={ruta}
              options={{ suppressMarkers: true, polylineOptions: { strokeColor: '#1f355a', strokeWeight: 5 } }}
            />
          )}
          <MarkerF position={posicionActual} icon={buildPatrullaSvgIcon()} />
          <MarkerF position={destino} icon={buildDestinoSvgIcon(color)} clickable={false} />
        </GoogleMap>
      </div>
    </div>
  )
}
