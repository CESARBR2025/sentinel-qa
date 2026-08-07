'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Camera } from 'lucide-react'
import { loadGoogleMaps } from '@/lib/maps/loadGoogleMaps'

interface Props {
  lat: number | null
  lng: number | null
  onDireccion: (dir: { calle: string; colonia: string }) => void
}

export function MapaMiUbicacion({ lat, lng, onDireccion }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const onDireccionRef = useRef(onDireccion)
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading')
  const [enStreetView, setEnStreetView] = useState(false)
  const [streetViewDisponible, setStreetViewDisponible] = useState<boolean | null>(null)

  useEffect(() => {
    onDireccionRef.current = onDireccion
  }, [onDireccion])

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

  const geocodificar = useCallback((latv: number, lngv: number) => {
    if (!window.google?.maps) return
    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: { lat: latv, lng: lngv } }, (results, st) => {
      if (st !== 'OK' || !results?.[0]) return
      const comps = results[0].address_components
      let calle = ''
      let colonia = ''
      for (const c of comps) {
        if (c.types.includes('route')) calle = c.long_name
        if (c.types.includes('neighborhood') || c.types.includes('sublocality') || c.types.includes('sublocality_level_1')) colonia = c.long_name
      }
      onDireccionRef.current({ calle, colonia })
    })
  }, [])

  useEffect(() => {
    if (status !== 'ready' || lat == null || lng == null || !mapRef.current || mapInstanceRef.current) return

    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 17,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      gestureHandling: 'cooperative',
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ],
    })
    new google.maps.Marker({
      position: { lat, lng },
      map,
      title: 'Tu ubicación',
      animation: google.maps.Animation.DROP,
    })
    mapInstanceRef.current = map

    const pano = map.getStreetView()
    pano.addListener('visible_changed', () => setEnStreetView(pano.getVisible()))

    geocodificar(lat, lng)

    new google.maps.StreetViewService().getPanorama(
      { location: { lat, lng }, radius: 50 },
      (data, st) => setStreetViewDisponible(st === 'OK' && !!data),
    )
  }, [status, lat, lng, geocodificar])

  const abrirStreetView = useCallback(() => {
    const map = mapInstanceRef.current
    if (!map || lat == null || lng == null) return
    const pano = map.getStreetView()
    pano.setPosition({ lat, lng })
    pano.setPov({ heading: 0, pitch: 0 })
    pano.setVisible(true)
  }, [lat, lng])

  const volverAlMapa = useCallback(() => {
    mapInstanceRef.current?.getStreetView().setVisible(false)
  }, [])

  if (lat == null || lng == null) {
    return (
      <div style={{ height: 280, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>
        Esperando GPS...
      </div>
    )
  }

  if (status === 'unavailable') {
    return (
      <div style={{ height: 280, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>
        Mapa no disponible
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
      <div ref={mapRef} style={{ width: '100%', height: 280, borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }} />
      {status === 'loading' && (
        <div style={{ fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8' }}>
          Cargando mapa...
        </div>
      )}
      {status === 'ready' && (
        <>
          {!enStreetView ? (
            <button
              type="button"
              onClick={abrirStreetView}
              disabled={streetViewDisponible === false}
              className="mm-btn"
            >
              <Camera size={14} />
              {streetViewDisponible === false ? 'Street View no disponible' : 'Ver en Street View'}
            </button>
          ) : (
            <button type="button" onClick={volverAlMapa} className="mm-btn">
              <ArrowLeft size={14} />
              Volver al mapa
            </button>
          )}
        </>
      )}
      <style>{`
        .mm-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 16px; background: #ffffff; color: #1e293b;
          border: 1px solid #e2e8f0; border-radius: var(--radius-lg);
          font-family: var(--apple-font-display); font-size: 13px;
          font-weight: 500; cursor: pointer; transition: all 0.2s;
          align-self: flex-start;
        }
        .mm-btn:hover:not(:disabled) { background: #f1f5f9; border-color: #1f355a; }
        .mm-btn:active:not(:disabled) { transform: scale(0.97); }
        .mm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </div>
  )
}
