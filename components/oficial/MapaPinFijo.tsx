'use client'

import { useEffect, useRef, useState } from 'react'
import { loadGoogleMaps } from '@/lib/maps/loadGoogleMaps'

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
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>(
    () => (typeof window !== 'undefined' && window?.google?.maps ? 'ready' : 'loading'),
  )

  useEffect(() => {
    if (status !== 'loading') return
    let cancelled = false
    loadGoogleMaps()
      .then((g) => {
        if (cancelled) return
        if (g?.maps) setStatus('ready')
        else setStatus('unavailable')
      })
      .catch(() => {
        if (!cancelled) setStatus('unavailable')
      })
    return () => {
      cancelled = true
    }
  }, [status])

  useEffect(() => {
    if (status !== 'ready' || !mapRef.current) return

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
  }, [status, lat, lng, label, color])

  if (status === 'unavailable') {
    return (
      <div style={{ height: 280, background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#94a3b8' }}>
        Mapa no disponible
      </div>
    )
  }

  if (status === 'loading') {
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