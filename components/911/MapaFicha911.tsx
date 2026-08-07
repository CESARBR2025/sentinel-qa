'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Map as MapIcon, Camera, Loader2, MapPin } from 'lucide-react'
import { loadGoogleMaps } from '@/lib/maps/loadGoogleMaps'

interface Props {
  lat: number | null
  lng: number | null
}

type Vista = 'street' | 'map'

// MapaFicha911 — Vista Street View prioritaria con toggle a Mapa (ficha 911).
// Si no hay cobertura Street View en las coordenadas, cae al mapa por defecto.
export function MapaFicha911({ lat, lng }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const panoRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const panoInstanceRef = useRef<google.maps.StreetViewPanorama | null>(null)

  const hasCoords = lat != null && lng != null && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0

  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading')
  const [vista, setVista] = useState<Vista>('street')
  const [svDisponible, setSvDisponible] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    loadGoogleMaps()
      .then((g) => {
        if (cancelled) return
        setStatus(g?.maps ? 'ready' : 'unavailable')
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable')
      })
    return () => { cancelled = true }
  }, [])

  // Prioriza Street View: se activa por defecto si hay cobertura en el punto.
  useEffect(() => {
    if (status !== 'ready' || !hasCoords || !window.google?.maps) return
    const sv = new google.maps.StreetViewService()
    sv.getPanorama({ location: { lat: lat!, lng: lng! }, radius: 80 }, (_, st) => {
      setSvDisponible(st === google.maps.StreetViewStatus.OK)
    })
  }, [status, hasCoords, lat, lng])

  const renderMapa = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current || !window.google?.maps) return
    const map = new google.maps.Map(mapRef.current, {
      center: { lat: lat!, lng: lng! },
      zoom: 16,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      gestureHandling: 'cooperative',
    })
    new google.maps.Marker({ position: { lat: lat!, lng: lng! }, map, title: 'Ubicación del reporte' })
    mapInstanceRef.current = map
  }, [lat, lng])

  const renderStreetView = useCallback(() => {
    if (!panoRef.current || panoInstanceRef.current || !window.google?.maps) return
    const pano = new google.maps.StreetViewPanorama(panoRef.current, {
      position: { lat: lat!, lng: lng! },
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      addressControl: false,
      fullscreenControl: false,
      zoomControl: true,
      motionTracking: false,
      clickToGo: true,
      scrollwheel: true,
      linksControl: true,
      visible: true,
    })
    panoInstanceRef.current = pano
  }, [lat, lng])

  const activarVista = (v: Vista) => {
    setVista(v)
    if (v === 'map') {
      requestAnimationFrame(renderMapa)
    } else {
      requestAnimationFrame(renderStreetView)
    }
  }

  // Inicializa la vista efectiva al estar listo (sin esperar un clic):
  // Street View si hay cobertura, Mapa si no. Deja el placeholder visible
  // mientras se resuelve la disponibilidad.
  useEffect(() => {
    if (status !== 'ready' || !hasCoords || svDisponible === null) return
    const efectiva = vista === 'street' && svDisponible === false ? 'map' : vista
    if (efectiva === 'street') requestAnimationFrame(renderStreetView)
    else requestAnimationFrame(renderMapa)
  }, [status, hasCoords, svDisponible, vista, renderStreetView, renderMapa])

  const pillActiva: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px',
    fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 600,
    background: '#1f355a', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)',
    cursor: 'pointer', letterSpacing: 'normal', textTransform: 'none',
  }
  const pillInactiva: React.CSSProperties = {
    ...pillActiva, background: '#f1f5f9', color: '#64748b',
  }

  if (!hasCoords) {
    return (
      <div style={{
        height: 200, borderRadius: 'var(--radius-lg)', background: '#f8fafc',
        border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8, color: '#94a3b8',
      }}>
        <MapPin size={20} />
        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12 }}>Sin coordenadas registradas</span>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div style={{
        height: 220, borderRadius: 'var(--radius-lg)', background: '#f8fafc',
        border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#64748b',
      }}>
        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12 }}>Cargando mapas…</span>
      </div>
    )
  }

  if (status === 'unavailable') {
    return (
      <div style={{
        height: 200, borderRadius: 'var(--radius-lg)', background: '#f8fafc',
        border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8, color: '#94a3b8',
      }}>
        <MapPin size={20} />
        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12 }}>Mapa no disponible</span>
      </div>
    )
  }

  // Street View sin cobertura → usa el mapa como vista efectiva.
  const vistaEfectiva = vista === 'street' && svDisponible === false ? 'map' : vista

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12, fontWeight: 500, color: '#64748b', textTransform: 'none' }}>
          {vistaEfectiva === 'street' ? 'Vista Street View' : 'Vista de mapa'}
        </span>
        <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 'var(--radius-full)' }}>
          <button
            type="button"
            onClick={() => activarVista('street')}
            style={vistaEfectiva === 'street' ? pillActiva : pillInactiva}
            aria-pressed={vistaEfectiva === 'street'}
          >
            <Camera size={13} />
            Street View
          </button>
          <button
            type="button"
            onClick={() => activarVista('map')}
            style={vistaEfectiva === 'map' ? pillActiva : pillInactiva}
            aria-pressed={vistaEfectiva === 'map'}
          >
            <MapIcon size={13} />
            Mapa
          </button>
        </div>
      </div>

      <div style={{
        height: 240, borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        border: '1px solid #e2e8f0', background: '#f1f5f9', position: 'relative',
      }}>
        {/* Street View (por defecto) */}
        <div
          ref={panoRef}
          style={{ position: 'absolute', inset: 0, display: vistaEfectiva === 'street' ? 'block' : 'none' }}
        />
        {/* Mapa (secundario) */}
        <div
          ref={mapRef}
          style={{ position: 'absolute', inset: 0, display: vistaEfectiva === 'map' ? 'block' : 'none' }}
        />
        {vista === 'street' && svDisponible === null && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, background: '#f1f5f9', color: '#64748b',
          }}>
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontFamily: 'var(--apple-font-display)', fontSize: 12 }}>Buscando vista…</span>
          </div>
        )}
      </div>
    </div>
  )
}
