'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  lat:   number
  lng:   number
  label: string
  color: 'red' | 'blue' | 'green'
}

const PIN_ICONS: Record<string, string> = {
  red:   'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  blue:  'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  green: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
}

export function MapaPinFijo({ lat, lng, label, color }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(() => !!window?.google?.maps)

  useEffect(() => {
    if (loaded) return

    const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')
    if (existing) {
      existing.addEventListener('load', () => setLoaded(true))
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.onload = () => setLoaded(true)
    document.head.appendChild(script)
  }, [loaded])

  useEffect(() => {
    if (!loaded || !mapRef.current) return

    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 16,
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
      title: label,
      icon: PIN_ICONS[color],
      animation: google.maps.Animation.DROP,
    })
  }, [loaded, lat, lng, label, color])

  if (!loaded) {
    return (
      <div style={{ height: 280, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#94a3b8' }}>
        Cargando mapa...
      </div>
    )
  }

  return (
    <div ref={mapRef} style={{ width: '100%', height: 280, borderRadius: 2, border: '1px solid #e2e8f0' }} />
  )
}