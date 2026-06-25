'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, Target } from 'lucide-react'

export type LocationData = {
  calle: string
  colonia: string
  numero: string
  referenciaUbicacion: string
  lat: number
  lng: number
}

export function MapaUbicacion({
  onLocationSelect,
  namePrefix = 'ofi',
}: {
  onLocationSelect: (loc: LocationData) => void
  namePrefix?: string
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markerRef = useRef<google.maps.Marker | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [currentLoc, setCurrentLoc] = useState<LocationData | null>(null)

  const geocodeAndSelect = useCallback((lat: number, lng: number) => {
    const map = mapInstanceRef.current
    if (!map) return

    if (markerRef.current) markerRef.current.setMap(null)
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    })
    markerRef.current = marker

    marker.addListener('dragend', () => {
      const pos = marker.getPosition()!
      geocodeAndSelect(pos.lat(), pos.lng())
    })

    const geocoder = new google.maps.Geocoder()
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status !== 'OK' || !results?.[0]) return

      const components = results[0].address_components
      let calle = ''
      let colonia = ''
      let numero = ''

      for (const c of components) {
        if (c.types.includes('route')) calle = c.long_name
        if (c.types.includes('street_number')) numero = c.long_name
        if (c.types.includes('neighborhood') || c.types.includes('sublocality') || c.types.includes('sublocality_level_1')) colonia = c.long_name
      }

      const loc: LocationData = {
        calle,
        colonia,
        numero,
        referenciaUbicacion: results[0].formatted_address,
        lat,
        lng,
      }
      setCurrentLoc(loc)
      onLocationSelect(loc)
    })
  }, [onLocationSelect])

  const goToMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      geocodeAndSelect(20.3892, -99.9968)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        mapInstanceRef.current?.setCenter({ lat: latitude, lng: longitude })
        mapInstanceRef.current?.setZoom(17)
        geocodeAndSelect(latitude, longitude)
      },
      () => geocodeAndSelect(20.3892, -99.9968)
    )
  }, [geocodeAndSelect])

  useEffect(() => {
    if (window.google?.maps) { setLoaded(true); return }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => setLoaded(true)
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!loaded || !mapRef.current || mapInstanceRef.current) return

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 20.3892, lng: -99.9968 },
      zoom: 14,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ],
    })
    mapInstanceRef.current = map

    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      const latLng = e.latLng!
      geocodeAndSelect(latLng.lat(), latLng.lng())
    })

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        map.setCenter({ lat: latitude, lng: longitude })
        map.setZoom(17)
        geocodeAndSelect(latitude, longitude)
      },
      () => {
        geocodeAndSelect(20.3892, -99.9968)
      }
    )
  }, [loaded, geocodeAndSelect])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div ref={mapRef} style={{ width: '100%', height: 320, borderRadius: 2, border: '1px solid #e2e8f0' }} />
      {!loaded && (
        <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#94a3b8' }}>
          Cargando mapa...
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" onClick={goToMyLocation} className="of-map-btn">
          <Target size={14} /> Mi Ubicación Actual
        </button>
      </div>
      {currentLoc && (
        <div style={{
          background: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 2,
          fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#475569',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <MapPin size={14} color="#2563eb" />
            <span style={{ fontWeight: 600 }}>UBICACIÓN SELECCIONADA</span>
          </div>
          <div>{currentLoc.referenciaUbicacion}</div>
          {currentLoc.calle && <div>Calle: {currentLoc.calle}</div>}
          {currentLoc.numero && <div>Número: {currentLoc.numero}</div>}
          {currentLoc.colonia && <div>Colonia: {currentLoc.colonia}</div>}
          <div style={{ color: '#94a3b8', marginTop: 4 }}>lat: {currentLoc.lat.toFixed(6)}, lng: {currentLoc.lng.toFixed(6)}</div>
        </div>
      )}
      <input type="hidden" name={`${namePrefix}_calle`} value={currentLoc?.calle ?? ''} />
      <input type="hidden" name={`${namePrefix}_colonia`} value={currentLoc?.colonia ?? ''} />
      <input type="hidden" name={`${namePrefix}_latitud`} value={currentLoc?.lat ?? ''} />
      <input type="hidden" name={`${namePrefix}_longitud`} value={currentLoc?.lng ?? ''} />

      <style>{`
        .of-map-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 16px; background: #ffffff; color: #1e293b;
          border: 1px solid #e2e8f0; border-left: 3px solid #2563eb;
          font-family: JetBrains Mono,monospace; font-size: 10px;
          font-weight: 600; cursor: pointer; transition: all 0.2s;
        }
        .of-map-btn:hover { background: #f1f5f9; border-color: #2563eb; }
      `}</style>
    </div>
  )
}
