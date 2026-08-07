'use client'

import { useEffect, useRef, useCallback } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api'
import { MapPin, MapPinOff } from 'lucide-react'
import { colorPorPrioridad } from '@/lib/incidentes/prioridad-colores'
import { GOOGLE_MAPS_LOADER_ID, GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from '@/lib/maps/googleMapsConfig'
import { formatAntiguedad } from './UnidadCards'

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '340px',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid #e2e8f0',
}

const LOADING_STYLE: React.CSSProperties = {
  ...containerStyle,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f1f5f9',
  fontFamily: 'var(--apple-font-display)',
  fontSize: 13,
  color: '#94a3b8',
}

const ERROR_STYLE: React.CSSProperties = {
  ...containerStyle,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: 24,
  boxSizing: 'border-box',
  background: '#fef2f2',
  color: '#dc2626',
  fontFamily: 'var(--apple-font-display)',
  fontSize: 13,
  textAlign: 'center',
}

export interface PuntoSeguimiento {
  id: string
  etiqueta: string
  esRefuerzo: boolean
  esPrioritario: boolean
  ultimaLat: number | null
  ultimaLng: number | null
  ultimaUbicacionEn: string | null
}

interface MapaSeguimientoOficialProps {
  incidenteLat: number
  incidenteLng: number
  prioridad?: string | null
  puntos: PuntoSeguimiento[]
}

function buildIncidenteSvgIcon(color: string): { url: string } {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54">
  <circle cx="27" cy="21" r="24" fill="#fff" fill-opacity="0.55"/>
  <circle cx="27" cy="21" r="21" fill="${color}" stroke="#fff" stroke-width="3"/>
  <polygon points="27,54 15,36 39,36" fill="${color}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
  <polygon points="28,9 18,21 27,21 26,29 36,17 27,17 28,9" fill="#fff"/>
</svg>`
  return { url: `data:image/svg+xml,${encodeURIComponent(svg)}` }
}

function buildOficialSvgIcon(punto: PuntoSeguimiento, fresco: boolean): { url: string } {
  const fill = punto.esPrioritario ? '#16a34a' : punto.esRefuerzo ? '#f97316' : '#1f355a'
  const opacidad = fresco ? '' : ' fill-opacity="0.4" stroke-opacity="0.4"'
  const dash = fresco ? '' : ' stroke-dasharray="3 3"'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="42" viewBox="0 0 34 42">
  <circle cx="17" cy="15" r="13" fill="${fill}"${opacidad} stroke="#fff" stroke-width="2"${dash}/>
  <polygon points="17,40 9,25 25,25" fill="${fill}"${opacidad} stroke="#fff" stroke-width="2" stroke-linejoin="round"${dash}/>
  <text x="17" y="19" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="10" font-weight="bold">P</text>
${punto.esPrioritario ? `  <circle cx="7" cy="3" r="5" fill="#7c3aed" stroke="#fff" stroke-width="1.2"/>
  <text x="7" y="5" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="6" font-weight="bold">P</text>` : ''}
</svg>`
  return { url: `data:image/svg+xml,${encodeURIComponent(svg)}` }
}

export default function MapaSeguimientoOficial({ incidenteLat, incidenteLng, prioridad, puntos }: MapaSeguimientoOficialProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_LOADER_ID,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  })

  const mapRef = useRef<google.maps.Map | null>(null)
  const boundsSetRef = useRef(false)

  const conUbicacion = puntos.filter(p => p.ultimaLat != null && p.ultimaLng != null)

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || boundsSetRef.current) return

    const bounds = new google.maps.LatLngBounds()
    bounds.extend({ lat: incidenteLat, lng: incidenteLng })

    for (const p of conUbicacion) {
      bounds.extend({ lat: p.ultimaLat!, lng: p.ultimaLng! })
    }

    if (!bounds.isEmpty()) {
      mapRef.current.fitBounds(bounds, { left: 48, right: 48, top: 48, bottom: 48 })
      boundsSetRef.current = true
    }
  }, [isLoaded, incidenteLat, incidenteLng, conUbicacion])

  if (loadError) {
    return (
      <div style={ERROR_STYLE}>
        <span style={{ fontWeight: 600 }}>Error de Google Maps</span>
        <span>Cuota de API excedida. Verifique su plan de facturación en la consola de Google Cloud.</span>
      </div>
    )
  }

  if (!isLoaded) {
    return <div style={LOADING_STYLE}>Cargando mapa...</div>
  }

  const center = { lat: incidenteLat, lng: incidenteLng }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={14}
        onLoad={onMapLoad}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
        }}
      >
        <MarkerF
          position={{ lat: incidenteLat, lng: incidenteLng }}
          icon={buildIncidenteSvgIcon(colorPorPrioridad(prioridad).principal)}
          clickable={false}
        />

        {conUbicacion.map(p => {
          const antiguedad = p.ultimaUbicacionEn ? formatAntiguedad(p.ultimaUbicacionEn) : null
          return (
            <MarkerF
              key={p.id}
              position={{ lat: p.ultimaLat!, lng: p.ultimaLng! }}
              icon={buildOficialSvgIcon(p, antiguedad?.fresco ?? false)}
              clickable={false}
            />
          )
        })}
      </GoogleMap>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {conUbicacion.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--apple-font-display)', fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>
            <MapPinOff size={12} /> Sin ubicación reportada por los oficiales asignados
          </div>
        )}
        {conUbicacion.map(p => {
          const antiguedad = p.ultimaUbicacionEn ? formatAntiguedad(p.ultimaUbicacionEn) : null
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--apple-font-display)', fontSize: 12 }}>
              <MapPin size={11} color={antiguedad?.fresco ? '#16a34a' : '#b45309'} />
              <span style={{ fontWeight: 600, color: '#334155' }}>{p.etiqueta}</span>
              {p.esRefuerzo && <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 6px', background: '#fff7ed', color: '#c2410c', borderRadius: 'var(--radius-full)' }}>Ref</span>}
              {p.esPrioritario && <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 6px', background: '#dcfce7', color: '#16a34a', borderRadius: 'var(--radius-full)' }}>Prioritario</span>}
              {antiguedad
                ? <span style={{ color: antiguedad.fresco ? '#16a34a' : '#b45309', fontWeight: 500 }}>{antiguedad.texto}</span>
                : <span style={{ color: '#94a3b8' }}>sin ubicación</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
